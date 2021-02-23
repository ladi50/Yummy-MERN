const { validationResult, body } = require("express-validator");

exports.postReview = [
  body("rating").not().isEmpty().withMessage("Rating is required!"),
  body("title", "Title must be at least 5 characters long!")
    .not()
    .isEmpty()
    .isLength({ min: 5 }),
  body("content", "Content must be at least 10 characters long!")
    .not()
    .isEmpty()
    .isLength({ min: 10 }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let modifiedErrors = [];

      for (const error of errors.errors) {
        modifiedErrors.push(error.msg);
      }

      modifiedErrors = [...new Set(modifiedErrors)];

      return res.status(422).json({ message: modifiedErrors });
    }

    next();
  }
];
