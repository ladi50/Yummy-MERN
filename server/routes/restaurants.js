const router = require("express").Router();

const restaurantControllers = require("../controllers/restaurants");
const jwtToken = require("../middlewares/token/jwtToken");
const upload = require("../middlewares/upload/mediaHandler");

router.post(
  "/:userId/addRestaurant",
  jwtToken,
  upload.single("image"),
  restaurantControllers.addRestaurant
);

router.patch(
  "/:userId/editRestaurant",
  jwtToken,
  upload.single("image"),
  restaurantControllers.editRestaurant
);

router.delete(
  "/:userId/:restaurantId/deleteRestaurant",
  jwtToken,
  restaurantControllers.deleteRestaurant
);

router.post(
  "/:userId/:restaurantId/add_menu",
  jwtToken,
  upload.array("image"),
  restaurantControllers.postMenu
);

router.patch(
  "/:userId/:restaurantId/edit_menu",
  jwtToken,
  upload.array("image"),
  restaurantControllers.editMenu
);

router.get(
  "/:userId/restaurant",
  jwtToken,
  restaurantControllers.getUserRestaurant
);

router.get("/restaurants/:restaurantId", restaurantControllers.getRestaurant);

router.get("/restaurants", restaurantControllers.getRestaurants);

router.get(
  "/:restaurantId/restaurant_menu",
  restaurantControllers.getRestaurantMenu
);

router.get("/:restaurantId/menu_price", restaurantControllers.getMenuPrice);

module.exports = router;
