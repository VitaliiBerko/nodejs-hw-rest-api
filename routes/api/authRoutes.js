const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
  currentUserController,
  avatarUploadController,
} = require("../../controllers/authControllers");
const {
  checkRegisterData,
  checkLoginData,
  protect,
  uploadUserAvatar,
} = require("../../middlewares/authMiddlewares");

const router = express.Router();

router.post("/register", checkRegisterData, registerController);

router.post("/login", checkLoginData, loginController);
router.use(protect);
router.post("/logout", logoutController);
router.get("/current", currentUserController);
router.patch("/avatars", uploadUserAvatar, avatarUploadController)

module.exports = router;
