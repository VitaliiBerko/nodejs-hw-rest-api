const express = require("express");
const {registerController, loginController } = require("../../controllers/authControllers");
const { checkRegisterData, checkLoginData } = require("../../middlewares/authMiddlewares");

const router = express.Router();

router.post('/register', checkRegisterData, registerController);

router.post("/login", checkLoginData, loginController );

module.exports = router;

