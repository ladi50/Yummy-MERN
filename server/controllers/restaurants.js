const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

const User = require("../models/user");
const Restaurant = require("../models/restaurant");
const Menu = require("../models/menu");

exports.addRestaurant = async (req, res) => {
  const postData = req.body;
  const user = req.params.userId;
  const userId = req.userId;
  
  const parsedCatagories = JSON.parse(postData.catagories);
  const schedule = JSON.parse(postData.schedule);

  catagories = await parsedCatagories.filter((item) => item.length > 0);

  if (userId !== user) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  if (!req.file) {
    return res.status(404).json({ message: "Image not found" });
  }

  for (const item in postData) {
    if (!item || item.length === 0) {
      return res.status(422).json({ message: "All fields are required" });
    }
  }

  if (!catagories || catagories.length === 0) {
    return res.status(422).json({ message: "All fields are required" });
  }

  if (!schedule || schedule.length === 0) {
    return res.status(422).json({ message: "All fields are required" });
  }

  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  if (!foundUser) {
    return res.status(404).json({ message: "User not found!" });
  }

  let foundRestaurant;

  try {
    foundRestaurant = await Restaurant.findOne({ userId });
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  if (foundRestaurant) {
    return res
      .status(403)
      .json({ message: "You already signed up your restaurant!" });
  }

  const restaurant = new Restaurant({
    ...postData,
    imageUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/Restaurant+Image/${req.file.filename}`,
    catagories,
    schedule,
    userId
  });

  let createdRestaurant;

  try {
    foundUser.restaurantId = restaurant._id;
    await foundUser.save();

    createdRestaurant = await restaurant.save();
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  if (!createdRestaurant) {
    return res.status(500).json({ message: "Could not post restaurant!" });
  }

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  const s3 = new AWS.S3();

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: "Restaurant Image/" + req.file.filename,
    Body: fs.createReadStream(req.file.path),
    ACL: "public-read",
    ContentType: req.file.mimetype
  };

  s3.upload(params, (err, data) => {
    if (err) {
      throw new Error("Could not upload image to AWS S3! " + err);
    } else if (data && createdRestaurant) {
      fs.unlink(path.join(__dirname, "..", req.file.filename), (err) => {
        if (err) {
          throw new Error("Could not unlink image from server!");
        }
      });

      console.log("Image uploaded to AWS S3!");
    }
  });

  res.status(201).json({ restaurant: createdRestaurant });
};

exports.editRestaurant = async (req, res) => {
  const postData = req.body;
  const user = req.params.userId;
  const userId = req.userId;

  let catagories = JSON.parse(postData.catagories);
  const schedule = JSON.parse(postData.schedule);

  catagories = catagories.filter((item) => item.length > 0);

  if (userId !== user) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  if (!req.file) {
    console.log("No new image restaurant uploaded.");
  }

  for (const item in postData) {
    if (!item || item.length === 0) {
      return res.status(422).json({ message: "All fields are required" });
    }
  }

  let foundRestaurant;

  try {
    foundRestaurant = await Restaurant.findOne({ userId });
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  if (!foundRestaurant || foundRestaurant.length === 0) {
    return res.status(404).json({ message: "Restaurant not found!" });
  }

  let editedRestaurant;

  try {
    editedRestaurant = await Restaurant.updateOne(
      { userId },
      {
        $set: {
          ...postData,
          imageUrl: req.file
            ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/Restaurant+Image/${req.file.filename}`
            : foundRestaurant.imageUrl,
          catagories,
          schedule
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  if (!editedRestaurant) {
    return res.status(500).json({ message: "Could not edit restaurant!" });
  }

  if (req.file) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    const s3 = new AWS.S3();

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: "Restaurant Image/" + req.file.filename,
      Body: fs.createReadStream(req.file.path),
      ACL: "public-read",
      ContentType: req.file.mimetype
    };

    s3.upload(params, (err, data) => {
      if (err) {
        throw new Error("Could not upload image to AWS S3! " + err);
      } else if (data && editedRestaurant) {
        fs.unlink(path.join(__dirname, "..", req.file.filename), (err) => {
          if (err) {
            throw new Error("Could not unlink image from server!");
          }
        });

        console.log("Image uploaded to AWS S3!");
      }
    });
  }

  res.status(200).json({ restaurant: editedRestaurant });
};

exports.postMenu = async (req, res) => {
  const menuItems = req.body.items;
  const restaurantId = req.params.restaurantId;
  const user = req.params.userId;
  const userId = req.userId;
  let items = JSON.parse(menuItems);

  if (userId !== user) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  for (const item of menuItems) {
    if (!item || item.length === 0) {
      return res.status(422).json({ message: "All fields required!" });
    }
  }

  // check if images exist
  if (!req.files || req.files.length === 0) {
    return res.status(404).json({ message: "No dish images uploaded!" });
  }

  // check if menu already exists
  let foundMenu;

  try {
    foundMenu = await Menu.findOne({ restaurantId });
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  if (foundMenu) {
    return res
      .status(409)
      .json({ message: "Menu already exists for this restaurant!" });
  }

  // create new Menu and save it, also save inside Restaurant document
  let foundRestaurant;

  try {
    foundRestaurant = await Restaurant.findById(restaurantId);
  } catch (err) {
    return res.status(500).json({ message: "Could not find restaurant data!" });
  }

  if (!foundRestaurant) {
    return res.status(404).json({ message: "Restaurant not found!" });
  }

  let index = 0;

  for (const item of items) {
    let filteredDishes = [];

    item.dishes.map((dish) => {
      filteredDishes.push({
        ...dish,
        imageUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/Menu+Dishes/${req.files[index].filename}`
      });

      index++;
    });

    item.dishes = filteredDishes;
  }

  const menu = new Menu({
    items,
    restaurantId,
    userId
  });

  let createdMenu;

  try {
    foundRestaurant.menuId = menu._id;
    await foundRestaurant.save();
    createdMenu = await menu.save();
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  // check if new Menu created
  if (!createdMenu) {
    return res.status(404).json({ message: "Menu could not be created!" });
  }

  // create new AWS S3
  // Save image to AWS
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
  const s3 = new AWS.S3();

  for (const file of req.files) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: "Menu Dishes/" + file.filename,
      Body: fs.createReadStream(file.path),
      ACL: "public-read",
      ContentType: file.mimetype
    };

    s3.upload(params, (err, data) => {
      if (err) {
        throw new Error("Could not upload image to AWS S3! " + err);
      } else if (data && createdMenu) {
        fs.unlink(path.join(__dirname, "..", file.filename), (err) => {
          if (err) {
            throw new Error("Could not unlink image from server!");
          }
        });

        console.log("Image uploaded to AWS S3!");
      }
    });
  }

  res.status(201).json({ menu: createdMenu });
};

exports.editMenu = async (req, res) => {
  const menuItems = req.body.items;
  const restaurantId = req.params.restaurantId;
  const user = req.params.userId;
  const userId = req.userId;
  let items = JSON.parse(menuItems);

  if (userId !== user) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  for (const item of menuItems) {
    if (!item || item.length === 0) {
      return res.status(422).json({ message: "All fields required!" });
    }
  }

  // check if images exist
  if (!req.files || req.files.length === 0) {
    console.log("No images uploaded");
  }

  // check if menu exists
  let foundMenu;

  try {
    foundMenu = await Menu.findOne({ restaurantId });
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  if (!foundMenu) {
    return res.status(404).json({ message: "Menu not found!" });
  }

  // configure catagory dishes
  if (req.files.length > 0) {
    let index = 0;

    for (const item of items) {
      let filteredDishes = [];

      item.dishes.map((dish) => {
        if (dish.imageUrl.includes("data:image")) {
          filteredDishes.push({
            ...dish,
            imageUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/Menu+Dishes/${req.files[index].filename}`
          });

          index++;
        } else {
          filteredDishes.push({ ...dish });
        }
      });

      item.dishes = filteredDishes;
    }
  }

  // update menu
  let updatedMenu;

  try {
    foundMenu.items = items;
    updatedMenu = await foundMenu.save();
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  if (!updatedMenu) {
    return res.status(404).json({ message: "Could not update menu!" });
  }

  // create new AWS S3
  // Save image to AWS
  if (req.files.length > 0) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    const s3 = new AWS.S3();

    for (const file of req.files) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: "Menu Dishes/" + file.filename,
        Body: fs.createReadStream(file.path),
        ACL: "public-read",
        ContentType: file.mimetype
      };

      s3.upload(params, (err, data) => {
        if (err) {
          throw new Error("Could not upload image to AWS S3! " + err);
        } else if (data && updatedMenu) {
          fs.unlink(path.join(__dirname, "..", file.filename), (err) => {
            if (err) {
              throw new Error("Could not unlink image from server!");
            }
          });

          console.log("Image uploaded to AWS S3!");
        }
      });
    }
  }

  res.status(201).json({ menu: updatedMenu });
};

exports.getUserRestaurant = async (req, res) => {
  const user = req.params.userId;
  const userId = req.userId;

  if (userId !== user) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  let foundRestaurant;

  try {
    foundRestaurant = await Restaurant.findOne({
      userId: user
    }).populate("menuId");
  } catch (err) {
    res.status(500).json({ message: err.stack });
  }

  if (!foundRestaurant || foundRestaurant.length === 0) {
    foundRestaurant = await Restaurant.findOne({ userId: user });
  }

  if (!foundRestaurant || foundRestaurant.length === 0) {
    return res.status(200).json({ message: "No restaurant found!" });
  }

  res.status(200).json({ restaurant: foundRestaurant });
};

exports.getRestaurant = async (req, res) => {
  const restaurantId = req.params.restaurantId;

  let foundRestaurant;

  try {
    foundRestaurant = await Restaurant.findById(restaurantId);
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  res.status(200).json({ restaurant: foundRestaurant });
};

exports.getRestaurants = async (_req, res) => {
  let foundRestaurants;

  try {
    foundRestaurants = await Restaurant.find({ menuId: { $exists: true } });
  } catch (err) {}

  if (!foundRestaurants || foundRestaurants.length === 0) {
    return res.status(200).json({ message: "No restaurants found!" });
  }

  res.status(200).json({ restaurants: foundRestaurants });
};

exports.getMenuPrice = async (req, res) => {
  const restaurantId = req.params.restaurantId;

  let foundDishes;

  try {
    foundDishes = await Menu.findOne({ restaurantId }, { _id: 0, items: 1 });
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  if (!foundDishes || foundDishes.length === 0)
    return res.status(404).json({ message: "No menu found!" });

  let prices = [];

  for (const item of foundDishes.items) {
    for (const dish of item.dishes) {
      prices.push(dish.price);
    }
  }

  const highestMenuPrice = Math.max.apply(Math, prices);

  let price;

  if (highestMenuPrice < 20) {
    price = "$";
  }

  if (highestMenuPrice > 20 && highestMenuPrice < 40) {
    price = "$$";
  }

  if (highestMenuPrice > 40) {
    price = "$$$";
  }

  res.status(200).json({ price });
};

exports.deleteRestaurant = async (req, res) => {
  const user = req.params.userId;
  const userId = req.userId;

  if (userId !== user)
    return res.status(401).json({ message: "Unauthorized!" });

  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  if (!foundUser || foundUser.length === 0) {
    res.status(404).json({ message: "User not found!" });
  }

  let foundRestaurant;

  try {
    foundRestaurant = await Restaurant.findOne({ userId });
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  if (!foundRestaurant || foundRestaurant.length === 0) {
    res.status(404).json({ message: "Restaurant not found!" });
  }

  let foundMenu;

  try {
    foundMenu = await Menu.findOne({ restaurantId: foundRestaurant._id });
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  if (!foundMenu || foundMenu.length === 0) {
    return res.status(404).json({ message: "Menu not found!" });
  }

  // delete restaurant, update user model, delete menu
  try {
    await User.updateOne({ _id: userId }, { $unset: { restaurantId: "" } });

    await Menu.deleteOne({ _id: foundMenu._id });

    await Restaurant.deleteOne({ _id: foundRestaurant._id });
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  res.status(200).json({ message: "Restaurant deleted!" });
};

exports.getRestaurantMenu = async (req, res) => {
  const restaurantId = req.params.restaurantId;

  let foundMenu;

  try {
    foundMenu = await Menu.findOne({ restaurantId });
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  if (!foundMenu || foundMenu.length === 0) {
    return res.status(404).json({ message: "Menu not found!" });
  }

  res.status(200).json({ menu: foundMenu });
};
