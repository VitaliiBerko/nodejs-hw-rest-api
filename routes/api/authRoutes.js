const express = require("express");
const {registerController, loginController, logoutController } = require("../../controllers/authControllers");
const { checkRegisterData, checkLoginData, protect } = require("../../middlewares/authMiddlewares");

const router = express.Router();

router.post('/register', checkRegisterData, registerController);

router.post("/login", checkLoginData, loginController );
router.use(protect)
router.post("/logout", logoutController);
// router.get("/current", currentController)

module.exports = router;

