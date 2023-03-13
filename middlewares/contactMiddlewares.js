const fs = require("fs").promises;
const Joi = require("joi");

exports.checkContactData = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  });

  const validationErr = schema.validate(req.body).error;

  if (validationErr) {
    const fieldName = validationErr.details[0].context.key;

    return res
      .status(400)
      .json({ message: `Missing reqiured ${fieldName} field` });
  }

  next();
};

exports.checkContactId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contacts = JSON.parse(await fs.readFile("./models/contacts.json"));

    const contact = contacts.find((item) => item.id === id);

    if (contact) {
      req.contact = contact;
      return next();
    }

    return res.status(404).json({ message: "Not found" });
  } catch (err) {
    next(err);
  }
};

exports.checkContactBody = (req, res, next) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: "missing fields" });
  }
  next();
};
