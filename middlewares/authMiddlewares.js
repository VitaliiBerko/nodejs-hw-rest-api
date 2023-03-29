const Joi = require("joi");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const ImageService = require("../services/imageService");

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

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cbf) => {
//     cbf(null, "public/avatars");
//   },

//   filename: (req, file, cbf) => {
//     const ext = file.mimetype.split("/")[1];
//     cbf(null, `${nanoid()}.${ext}`);
//   },
//   limits: {
//     fileSize: 1048576,
//   },
// });

// const multerFilter = (req, file, cbf, res) => {
//   if (file.mimetype.startsWith("image")) {
//     cbf(null, true);
//   } else {
//     cbf(res.status(400).json({ message: `Uoload images only` }), false);
//   }
// };

// exports.uploadUserAvatar = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// }).single("avatar");

exports.uploadUserAvatar = ImageService.upload("avatar");
