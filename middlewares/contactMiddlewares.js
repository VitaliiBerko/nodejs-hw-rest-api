// const fs = require("fs").promises;
const Joi = require("joi");
const {
  Types: { ObjectId },
} = require("mongoose");
const Contact = require("../models/contactModel");

exports.checkContactData = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
  });

  const validationErr = schema.validate(req.body).error;

  if (validationErr) {
    const fieldName = validationErr.details[0].context.key;

    return res
      .status(400)
      .json({ message: `Missing reqiured ${fieldName} field` });
  }
  const { email } = req.body;
  const contact = await Contact.findOne({ email }).select("-password");

  if (contact) res.status(400).json({ message: "Email already exists " });

  next();
};

exports.checkContactId = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!ObjectId.isValid(contactId)) {
      return res.status(404).json({ message: "Not found" });
    }

    const userExists = await Contact.exists({ _id: contactId });

    if (!userExists) {
      return res.status(404).json({ message: "Not found" });
    }
    next();
  } catch (err) {
    next(err);
  }
};

exports.checkContactStatus = async (req, res, next) => {
  const schema = Joi.object({
    favorite: Joi.boolean().required(),
  });

  const validationErr = schema.validate(req.body).error;

  if (validationErr) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  next();
};

exports.checkContactBody = (req, res, next) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: "missing fields" });
  }
  next();
};

// exports.errorHandler = (err, _, res, __) => {
//   res.status(500).json({
//     status: "fail",
//     code: 500,
//     message: err.message,
//     data: "Internal Server Error",
//   });
// };
