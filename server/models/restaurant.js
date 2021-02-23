const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  catagories: {
    type: Array,
    default: []
  },
  deliveryTime: {
    type: String,
    required: true
  },
  deliveryPrice: {
    type: Number,
    required: true
  },
  schedule: [
    {
      days: {
        type: String,
        required: true
      },
      openingTime: {
        type: String,
        required: true
      },
      closingTime: {
        type: String,
        required: true
      }
    }
  ],
  menuId: {
    type: mongoose.Types.ObjectId,
    ref: "Menu"
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
