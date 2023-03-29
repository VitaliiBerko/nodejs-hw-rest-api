const Joi = require("joi");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.checkRegisterData = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,128})/)
      .required(),
  });

  const validationErr = schema.validate(req.body).error;
  if (validationErr) {
    const fieldName = validationErr.details[0].context.key;
    console.log(validationErr.details[0].message);

    return res.status(400).json({
      message: `Missing reqiured ${fieldName} field. ${validationErr.details[0].message}`,
    });
  }

  next();
};

exports.checkLoginData = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  const validationErr = schema.validate(req.body).error;

  if (validationErr) {
    const fieldName = validationErr.details[0].context.key;
    console.log(validationErr.details[0].message);

    return res
      .status(400)
      .json({ message: `Missing reqiured ${fieldName} field.` });
  }

  next();
};

exports.protect = async (req, res, next) => {
  const { authorization } = req.headers;
  const token =
    authorization?.startsWith("Bearer") && authorization.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Not authorized" });
  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) return res.status(401).json({ message: "Not authorized" });
  req.user = currentUser;
  next();
};
