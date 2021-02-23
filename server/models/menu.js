const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  items: [
    {
      name: {
        type: String,
        required: true
      },
      dishes: [
        {
          name: {
            type: String,
            required: true
          },
          description: {
            type: String,
            required: true
          },
          price: {
            type: Number,
            required: true
          },
          imageUrl: {
            type: String,
            required: true
          }
        }
      ]
    }
  ],
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
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
