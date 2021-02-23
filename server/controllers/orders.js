const path = require("path");
const fs = require("fs");
const request = require("request");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const { LocalStorage } = require("node-localstorage");
const PDFDocument = require("pdfkit");
const AWS = require("aws-sdk");

const Order = require("../models/order");
const User = require("../models/user");
const Menu = require("../models/menu");

const localStorage = new LocalStorage(
  path.join(__dirname, "..", "localStorage")
);

exports.checkout = async (req, res) => {
  const orderData = req.body;
  const restaurantId = req.params.restaurantId;
  const user = req.params.userId;
  const userId = req.userId;

  if (userId !== user) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  let orderItems = [];

  for (item of orderData) {
    const orderItem = {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image]
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    };

    orderItems.push(orderItem);
  }

  // integrate Stripe API
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: orderItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/${userId}/${restaurantId}/checkoutRedirect?success=true`,
    cancel_url: `${process.env.CLIENT_URL}?canceled=true`
  });

  if (!session) {
    return res
      .status(500)
      .json({ message: "Could not create Stripe session!" });
  }

  // save session id in localStorage
  localStorage.setItem("sessionId", session.id);
  localStorage.setItem("paymentIntent", session.payment_intent);

  res.status(200).json({ orderData, sessionId: session.id });
};

exports.postOrder = async (req, res) => {
  const restaurantId = req.params.restaurantId;
  const user = req.params.userId;
  const userId = req.userId;
  const sessionId = localStorage.getItem("sessionId");
  const paymentIntent = localStorage.getItem("paymentIntent");

  if (userId !== user) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session || session.length === 0) {
    return res.status(404).json({ message: "Stripe session not found!" });
  }

  if (session.payment_status !== "paid") {
    return res.status(409).json({ message: "Payment not finished yet!" });
  }
  const paymentDetails = await stripe.paymentIntents.retrieve(paymentIntent);
  console.log(paymentDetails);

  if (!paymentDetails || paymentDetails.length === 0) {
    return res.status(404).json({ message: "Stripe payment not found!" });
  }
  if (paymentDetails.status !== "succeeded") {
    return res.status(409).json({ message: "Payment not finished yet!" });
  }

  const orderItems = await stripe.checkout.sessions.listLineItems(sessionId);

  let products = [];

  for (const orderItem of orderItems.data) {
    products.push({
      name: orderItem.description,
      imageUrl: "",
      price: orderItem.price.unit_amount / 100,
      quantity: orderItem.quantity
    });
  }

  let foundMenu;

  try {
    foundMenu = await Menu.findOne({ restaurantId });
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  if (!foundMenu || foundMenu.length === 0) {
    return res.status(404).json({ message: "Menu not found!" });
  }

  for (const item of foundMenu.items) {
    for (const dish of item.dishes) {
      for (const product of products) {
        if (dish.name === product.name) {
          product.imageUrl = dish.imageUrl;
        }
      }
    }
  }

  let foundUser;

  try {
    foundUser = await User.findById(user);
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  if (!foundUser || foundUser.length === 0) {
    return res.status(404).json({ message: "User not found!" });
  }

  const paymentObject =
    paymentDetails.charges.data[0].payment_method_details.card;

  const payment = {
    name: paymentDetails.charges.data[0].billing_details.name,
    type: paymentObject.brand,
    status: session.payment_status,
    card: `XXXX-XXXX-XXXX-${paymentObject.last4}`,
    amount: session.amount_total / 100
  };

  const order = new Order({
    restaurantId,
    products,
    payment,
    userId
  });

  let createdOrder;

  try {
    foundUser.orders.push(order._id);
    await foundUser.save();

    createdOrder = await order.save();
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  if (!createdOrder || createdOrder.length === 0) {
    return res.status(404).json({ message: "Order creation failed!" });
  }

  let foundOrder;

  try {
    foundOrder = await Order.findById(createdOrder._id).populate(
      "restaurantId"
    );
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  if (!foundOrder || foundOrder.length === 0) {
    return res.status(404).json({ message: "Order not found!" });
  }

  try {
    setTimeout(() => {
      fs.unlink(
        path.join(__dirname, "..", "localStorage", "sessionId"),
        (err) => {
          if (err) console.log(err);
        }
      );

      fs.unlink(
        path.join(__dirname, "..", "localStorage", "paymentIntent"),
        (err) => {
          if (err) console.log(err);
        }
      );
    }, 15000);
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  res.status(201).json({ order: foundOrder });
};

exports.getUserOrder = async (req, res) => {
  const orderId = req.params.orderId;
  const user = req.params.userId;
  const userId = req.userId;

  if (userId !== user) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  let foundOrder;

  try {
    foundOrder = await Order.findOne({ _id: orderId, userId }).populate(
      "restaurantId"
    );
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  if (!foundOrder || foundOrder.length === 0) {
    return res.status(404).json({ message: "Order not found!" });
  }

  res.status(200).json({ order: foundOrder });
};

exports.downloadInvoice = async (req, res) => {
  const orderId = req.params.orderId;
  const user = req.params.userId;
  const userId = req.userId;
  const doc = new PDFDocument();

  if (userId !== user) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  let foundOrder;

  try {
    foundOrder = await Order.findOne({ _id: orderId, userId })
      .populate("restaurantId")
      .populate("userId");
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  if (!foundOrder || foundOrder.length === 0) {
    return res.status(404).json({ message: "Order not found!" });
  }

  const invoiceName = `invoice-${foundOrder._id}.pdf`;
  const invoicePath = path.join(__dirname, "..", invoiceName);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${invoiceName}"`);

  // create new pdf file for order
  const writeStream = fs.createWriteStream(invoicePath);
  doc.pipe(writeStream);

  const logoPath = path.join(__dirname, "..", "logo.png");

  request(
    `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/logo/yummy-logo.png`,
    (err) => {
      if (err) console.log(err);
    }
  )
    .pipe(fs.createWriteStream(logoPath, { encoding: "base64" }))
    .on("finish", () => {
      doc.image(logoPath, 20, 0, { width: 80, height: 80 });
      doc
        .moveDown(4)
        .font("Helvetica")
        .fontSize(24)
        .text(`Order #${foundOrder._id}`, {
          align: "center",
          underline: "true"
        })
        .moveDown(0.5)
        .fontSize(16)
        .fillColor("gray")
        .text(
          `Date: ${new Date(foundOrder.createdAt)
            .toLocaleString()
            .replace(/\-/g, "/")
            .substr(
              0,
              new Date(foundOrder.createdAt).toLocaleString().length - 3
            )}`,
          {
            align: "center"
          }
        )
        .fontSize(19)
        .moveDown(2.5)
        .fillColor("blue")
        .text("Restaurant Details:", { underline: "true" })
        .fillColor("black")
        .moveDown(1)
        .fontSize(14)
        .text(`Name: ${foundOrder.restaurantId.name}`)
        .moveDown(0.5)
        .text(
          `Address: ${foundOrder.restaurantId.street}, ${foundOrder.restaurantId.city}`
        )
        .moveDown(0.5)
        .text(`Phone Number: ${foundOrder.restaurantId.phoneNumber}`)
        .moveDown(1)
        .rect(72, doc.y, 455, 0)
        .stroke("#363636")
        .moveDown(1)
        .fontSize(19)
        .fillColor("blue")
        .text("Order Details:", { underline: "true" })
        .fontSize(14);

      for (const dish of foundOrder.products) {
        doc
          .fillColor("black")
          .moveDown(0.7)
          .text(`Name: ${dish.name}`)
          .moveDown(0.5)
          .text(`Dish Price: $${dish.price}`)
          .moveDown(0.5)
          .text(`Quantity: ${dish.quantity}`)
          .moveDown(0.7)
          .rect(72, doc.y, 200, 0)
          .stroke("gray");
      }

      doc
        .rect(72, doc.y, 455, 0)
        .stroke("#363636")
        .fontSize(19)
        .fillColor("blue")
        .text("Payment Details:", { underline: "true" }, doc.y + 30)
        .fillColor("black")
        .fontSize(14)
        .text(`Card Holder Name: ${foundOrder.payment.name}`, 72, doc.y + 15)
        .text(
          `Card Brand: ${
            foundOrder.payment.type.charAt(0).toUpperCase() +
            foundOrder.payment.type.slice(1)
          }`,
          72,
          doc.y + 15
        )
        .text(`Card Number: ${foundOrder.payment.card}`, 72, doc.y + 15)
        .text(
          `Payment Status: ${
            foundOrder.payment.status.charAt(0).toUpperCase() +
            foundOrder.payment.status.slice(1)
          }`,
          72,
          doc.y + 15
        )
        .text(`Payment Amount: $${foundOrder.payment.amount}`, 72, doc.y + 15);

      doc.end();

      // upload PDF to S3
      writeStream.on("finish", () => {
        AWS.config.update({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });

        const s3 = new AWS.S3();

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: "invoices/" + invoiceName,
          Body: fs.createReadStream(invoicePath),
          ACL: "public-read",
          ContentType: "application/pdf"
        };

        s3.upload(params, (err) => {
          if (err) {
            throw new Error("Could not upload pdf to AWS S3! " + err);
          } else {
            fs.unlink(invoicePath, (err) => {
              if (err) {
                throw new Error("Could not unlink pdf from server!");
              }
            });

            fs.unlink(logoPath, (err) => {
              if (err) {
                throw new Error("Could not unlink logo from server!");
              }
            });

            console.log("Pdf uploaded to AWS S3!");

            res.status(200).json({ message: "Pdf received successfuly!" });
          }
        });
      });
    });
};

exports.getUserOrders = async (req, res) => {
  const user = req.params.userId;
  const userId = req.userId;

  if (userId !== user) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  let foundOrders;

  try {
    foundOrders = await Order.find({ userId })
      .populate("restaurantId")
      .sort({ createdAt: -1 });
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  if (!foundOrders || foundOrders.length === 0) {
    return res.status(200).json({ message: "Orders not found!" });
  }

  res.status(200).json({ orders: foundOrders });
};
