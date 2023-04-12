const jwt = require("jsonwebtoken");
const User = require("./userModel");
const { nanoid } = require("nanoid");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

const addUser = async (body) => {
  try {
    const verificationToken = nanoid();
    const newUser = await User.create({ ...body, verificationToken });
    const { email, subscription, avatarURL } = newUser;
    newUser.password = undefined;

    const msg = {
      to: email,
      from: "v.berko85@gmail.com",
      subject: "Thank you for registration!",
      text: `Please, confirm your email address POST http://localhost:3000/api/users/verify/${verificationToken}`,
      html: `Please, confirm your email address POST http://localhost:3000/api/users/verify/${verificationToken}`,
    };

    await sgMail.send(msg);

    return { user: { email, subscription, avatarURL } };
  } catch (err) {
    console.error(err.message);
  }
};

const loginUser = async (body) => {
  try {
    const { email, password } = body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) return { token: null, user: null };

    const passwordIsValid = await user.checkPassword(password, user.password);

    if (!passwordIsValid) return { token: null, user: null };

    user.password = undefined;
    const token = signToken(user.id);
    user.token = token;

    await User.findByIdAndUpdate({ _id: user.id }, user, {
      new: true,
    });

    return user;
  } catch (err) {
    console.error(err.message);
  }
};

const logoutUser = async (id) => {
  try {
    return await User.findByIdAndUpdate(id, { token: null }, { new: true });
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  addUser,
  loginUser,
  logoutUser,
};
