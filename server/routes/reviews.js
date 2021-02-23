const router = require("express").Router();

const reviewControllers = require("../controllers/reviews");
const reviewValidators = require("../middlewares/validators/reviews");
const jwtToken = require("../middlewares/token/jwtToken");

router.post(
  "/:restaurantId/:userId/review",
  jwtToken,
  reviewValidators.postReview,
  reviewControllers.postReview
);

router.get("/:restaurantId/reviews", reviewControllers.getReviews);

router.get("/:restaurantId/reviews/rating", reviewControllers.getReviewsRating);

module.exports = router;
