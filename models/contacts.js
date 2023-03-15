// const { nanoid } = require("nanoid");
// const path = require("path");
// const fs = require("fs").promises;
const Contact = require("../models/contactModel");

// const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    return Contact.find();
  } catch (err) {
    console.error(err.message);
  }
};

const getContactById = async (contactId) => {
  try {
    return Contact.findById({ _id: contactId });
  } catch (err) {
    console.error(err.message);
  }
};

const removeContact = async (contactId) => {
  try {
    
    return Contact.findByIdAndRemove({ _id: contactId });
  } catch (err) {
    console.error(err.message);
  }
};

const addContact = async (body) => {
  try {
     return Contact.create(body);
  } catch (err) {
    console.error(err.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    // const { name, email, phone } = body;
    // const contacts = await listContacts();
    // const contactUpdated = contacts.find(({ id }) => id === contactId);

    // if (name) contactUpdated.name = name;
    // if (email) contactUpdated.email = email;
    // if (phone) contactUpdated.phone = phone;

    // const contactIdx = contacts.findIndex((item) => item.id === contactId);
    // contacts[contactIdx] = contactUpdated;
    // await fs.writeFile(contactsPath, JSON.stringify(contacts));

    // return contactUpdated;

    return Contact.findByIdAndUpdate({ _id: contactId }, body, { new: true });
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
