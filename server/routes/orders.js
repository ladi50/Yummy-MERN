const router = require("express").Router();

const orderControllers = require("../controllers/orders");
const jwtToken = require("../middlewares/token/jwtToken");

router.post(
  "/:userId/:restaurantId/checkout-session",
  jwtToken,
  orderControllers.checkout
);

router.post(
  "/:userId/:restaurantId/postOrder",
  jwtToken,
  orderControllers.postOrder
);

router.get("/:userId/order/:orderId", jwtToken, orderControllers.getUserOrder);

router.get(
  "/:userId/order/:orderId/download_invoice",
  jwtToken,
  orderControllers.downloadInvoice
);

router.get("/:userId/orders", jwtToken, orderControllers.getUserOrders);

module.exports = router;
