const User = require("../models/userModel");
const {
  addUser,
  loginUser,
  logoutUser,
 } = require("../models/user");
const ImageService = require("../services/imageService");
const AppError = require("../utils/error");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.registerController = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      // status: "error",
      // code: 409,
      message: "Email in use",
      // data: "Conflict",
    });
  }

  try {
    const regUser = await addUser(req.body);

    return res.status(201).json(regUser);
  } catch (err) {
    res.status(500).json({
      msg: err.msg,
    });
  }
};

exports.loginController = async (req, res, next) => {
  try {
    const user = await loginUser(req.body);
    const { token, email, subscription } = user;

    if (!token)
      return res.status(401).json({ message: "Email or password is wrong" });

    res.status(200).json({
      token,
      user: { email, subscription },
    });
  } catch (err) {
    res.status(500).json({
      msg: err.msg,
    });
  }
};

exports.logoutController = async (req, res) => {
  try {
    const { id } = req.user;
    const logedoutUser = await logoutUser(id);

    if (!logedoutUser) {
      return res.status(401).json({ message: "Not authorized" });
    }

    return res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      msg: err.msg,
    });
  }
};

exports.currentUserController = (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

exports.avatarUploadController = async (req, res) => {
  const { file, user } = req;
  if (file) {
    user.avatarURL = await ImageService.save(file, "avatars", "users", user.id);
  }
  const updadatedUser = await user.save();

  res.status(200).json({ avatarURL: updadatedUser.avatarURL });
};

exports.registrationVerificationtionController = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({
    verificationToken,
  });

  try {
    if (!user) {
      return next(new AppError(404, "User not found"));
    }

    const msg = {
      to: user.email,
      from: "v.berko85@gmail.com",
      subject: "Verification successful",
      text: "Thank you for registration! Your verification successful.",
      html: "<p>Thank you for registration! Your verification successful.<p>",
    };

    await sgMail.send(msg);

    await User.findByIdAndUpdate(user.id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).json({ message: "Verification successful" });
  } catch (err) {
    console.error(err.message);
  }
};

exports.resendVerificationController = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError(404, "User doesn`t exist"));
    }

    if (user.verify) {
      return next(new AppError(400, "Verification has already been passed"));
    }

    const msg = {
      to: email,
      from: "v.berko85@gmail.com",
      subject: "Email verification",
      text: "Please, confirm your email address.",
      html: `Please, confirm your email address http://localhost:3000/api/users/verify/${user.verificationToken}`,
    };

    await sgMail.send(msg);

    res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    console.error(err.message);
  }
};
