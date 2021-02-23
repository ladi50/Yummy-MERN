const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    restaurantId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Restaurant"
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
