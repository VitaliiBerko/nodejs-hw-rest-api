
const { model, Schema, SchemaTypes } = require("mongoose");

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: { type: String, 
    // unique: true, 
    required: true },
  phone: {
    type: String,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: 'user',
  }
});

const Contact = model("Contact", contactSchema);

module.exports = Contact;
