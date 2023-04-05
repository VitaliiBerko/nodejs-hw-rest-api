const jwt = require("jsonwebtoken");
const User = require("./userModel");
const { nanoid } = require("nanoid");
const sgMail = require("@sendgrid/mail");
const AppError = require("../utils/error");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

const addUser = async (body) => {
  try {
    const verificationToken = nanoid();
    const newUser = await User.create(body, verificationToken);
    const { email, subscription, avatarURL } = newUser;
    newUser.password = undefined;   
    

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

const registrationVerification = async (verificationToken) => {
  const user = await User.findOne({
    verificationToken,
    verify: false   
  });
    
  if (!user) {
    throw new AppError(404, "User not found");
  }  
  user.verify = true;
  await user.save();

  const msg = {
    to: user.email,
    from: 'v.berko85@gmail.com',
    subject: 'Verification successful',
    text: 'Thank you for registration! Your verification successful.',
    html: '<p>Thank you for registration! Your verification successful.<p>'
  };

  await sgMail.send(msg);

};

module.exports = {
  addUser,
  loginUser,
  logoutUser,
  registrationVerification,
};
