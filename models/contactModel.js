const { model, Schema } = require("mongoose");

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: { type: String, unique: true, required: true },
  phone: {
    type: String,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = model("Contact", contactSchema);

module.exports = Contact;
