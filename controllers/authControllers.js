const User = require("../models/userModel");
const { addUser, loginUser, logoutUser } = require("../models/user");
const ImageService = require("../services/imageService");

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
