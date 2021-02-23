const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  orders: [
    {
      type: mongoose.Types.ObjectId
    }
  ],
  restaurantId: {
    type: mongoose.Types.ObjectId,
    ref: "Restaurant"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
