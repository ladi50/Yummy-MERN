const router = require("express").Router();

const userControllers = require("../controllers/users");
const userValidators = require("../middlewares/validators/users");

router.post("/signup", userValidators.signup, userControllers.signup);

router.post("/login", userValidators.login, userControllers.login);

module.exports = router;
