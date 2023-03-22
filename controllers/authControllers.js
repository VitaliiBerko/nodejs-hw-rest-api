const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

exports.registerController = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email in use",
      data: "Conflict",
    });
  }

  try {
    const newUserData = { ...req.body };
    const newUser = await User.create(newUserData);

    newUser.password = undefined;
    // const token = signToken(newUser.id);

    res.status(201).json({
      user: newUser,
    //   token,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.msg,
    });
  }
};

exports.loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(401).json({ message: "Email or password is wrong" });

    const passwordIsValid = await user.checkPassword(password, user.password);

    if (!passwordIsValid)
      return res.status(401).json({ message: "Email or password is wrong" });

    user.password = undefined;
    const token = signToken(user.id);

    res.status(200).json({
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.msg,
    });
  }
};
