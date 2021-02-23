require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const mongoose = require("mongoose");

const userRoutes = require("./routes/users");
const reviewRoutes = require("./routes/reviews");
const restaurantRoutes = require("./routes/restaurants");
const orderRoutes = require("./routes/orders");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());

app.use(userRoutes);
app.use(reviewRoutes);
app.use(restaurantRoutes);
app.use(orderRoutes);

mongoose
  .connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() =>
    app.listen(process.env.PORT || 8000, () =>
      console.log("Server is running!")
    )
  )
  .catch((err) => console.log(err));
