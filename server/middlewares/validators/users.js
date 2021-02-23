const { validationResult, body } = require("express-validator");

exports.signup = [
  body("email").isEmail().withMessage("Email is invalid!"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long!"),
  body("username").not().isEmpty().withMessage("Username is required!"),
  (req, res, next) => {
    const errors = validationResult(req);

    let modifiedErrors = [];

    for (const error of errors.errors) {
      modifiedErrors.push(error.msg);
    }

    if (!errors.isEmpty()) {
      return res.status(422).json({ message: modifiedErrors });
    }

    next();
  }
];

exports.login = [
  body("email").isEmail().withMessage("Email or password is incorrect!"),
  body("password")
    .not().isEmpty()
    .withMessage("Email or password is incorrect!"),
  (req, res, next) => {
    const errors = validationResult(req);

    let modifiedErrors = [];

    for (const error of errors.errors) {
      modifiedErrors.push(error.msg);
    }

    modifiedErrors = [...new Set(modifiedErrors)];

    if (!errors.isEmpty()) {
      return res.status(422).json({ message: modifiedErrors });
    }

    next();
  }
];
