const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    products: [
      {
        name: {
          type: String,
          required: true
        },
        imageUrl: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    payment: {
      name: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      status: {
        type: String,
        required: true
      },
      card: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true
      }
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
