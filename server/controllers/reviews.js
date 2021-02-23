const Review = require("../models/review");
const Restaurant = require("../models/restaurant");

exports.postReview = async (req, res) => {
  const reviewData = req.body;
  const userId = req.userId;
  const user = req.params.userId;
  const restaurantId = req.params.restaurantId;

  if (userId !== user) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  let foundReview;

  try {
    foundReview = await Review.findOne({ userId, restaurantId });
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  if (foundReview) {
    return res
      .status(409)
      .json({ message: "You have already been reviewd this restaurant!" });
  }

  let foundRestaurant;

  try {
    foundRestaurant = await Restaurant.findById(restaurantId);
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  if (!foundRestaurant) {
    return res.status(404).json({ message: "Restaurant not found!" });
  }

  const review = new Review({ ...reviewData, userId, restaurantId });

  let createdReview;

  try {
    foundRestaurant.rating = reviewData.rating;
    await foundRestaurant.save();

    createdReview = await review.save();
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  if (!createdReview || createdReview.length === 0) {
    return res.status(404).json({ message: "Review not found!" });
  }

  res.status(201).json({ review: createdReview });
};

exports.getReviews = async (req, res) => {
  const restaurantId = req.params.restaurantId;

  let foundReviews;

  try {
    foundReviews = await Review.find({ restaurantId }).sort({ createdAt: -1 });
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  if (!foundReviews || foundReviews.length === 0) {
    return res.status(200).json({ message: "This restaurant has no reviews" });
  }

  res.status(200).json({ reviews: foundReviews });
};

exports.getReviewsRating = async (req, res) => {
  const restaurantId = req.params.restaurantId;

  let foundReviews;

  try {
    foundReviews = await Review.find({ restaurantId }, { _id: 0, rating: 1 });
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  if (!foundReviews || foundReviews.length === 0) {
    return res.status(200).json({ message: "This restaurant has no reviews" });
  }

  res.status(200).json({ ratings: foundReviews });
};
