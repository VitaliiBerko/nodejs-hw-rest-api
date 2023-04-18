const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
  currentUserController,
  avatarUploadController,
  registrationVerificationtionController,
  resendVerificationController,
} = require("../../controllers/authControllers");
const {
  checkRegisterData,
  checkLoginData,
  protect,
  uploadUserAvatar,
  checkEmail,
} = require("../../middlewares/authMiddlewares");

const router = express.Router();

router.post("/register", checkRegisterData, registerController);
router.post("/verify", checkEmail, resendVerificationController)
router.get("/verify/:verificationToken", registrationVerificationtionController)

router.post("/login", checkLoginData, loginController);
router.use(protect);
router.post("/logout", logoutController);
router.get("/current", currentUserController);
router.patch("/avatars", uploadUserAvatar, avatarUploadController)


module.exports = router;
