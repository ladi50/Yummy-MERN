const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = async (req, res) => {
  const userData = req.body;

  let foundUser;

  try {
    foundUser = await User.findOne({ email: userData.email });
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  if (foundUser) {
    return res.status(422).json({ message: "Email already exists!" });
  }

  const encryptedPassword = bcrypt.hashSync(userData.password, 12);

  const user = new User({ ...userData, password: encryptedPassword });

  let createdUser;

  try {
    createdUser = await user.save();
  } catch (err) {
    return res.status(500).json({ message: err.stack });
  }

  let token;

  if (createdUser) {
    try {
      token = jwt.sign(
        {
          email: createdUser.email,
          username: createdUser.username,
          userId: createdUser._id.toString()
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    } catch (err) {
      return res.status(500).json({ message: err.stack });
    }
  }

  res.status(201).json({ user: createdUser, token });
};

exports.login = async (req, res) => {
  const userData = req.body;

  let foundUser;

  try {
    foundUser = await User.findOne({ email: userData.email });
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  if (!foundUser) {
    return res.status(422).json({ message: "User not found!" });
  }

  const encryptedPassword = bcrypt.compareSync(
    userData.password,
    foundUser.password
  );

  let token;

  if (!encryptedPassword) {
    return res.status(422).json({ message: "Email or password is incorrect!" });
  } else {
    try {
      token = jwt.sign(
        {
          email: foundUser.email,
          username: foundUser.username,
          userId: foundUser._id.toString()
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }

  res.status(201).json({ user: foundUser, token });
};
