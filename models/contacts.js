const Contact = require("../models/contactModel");

const listContacts = async (id, query) => {
  try {
    const { limit, page = 1, favorite } = query;
    console.log("favorite---->", favorite);

    const findOptions = favorite
      ? { $and: [{ owner: id }, { favorite }] }
      : { owner: id };

    const contactsQuery = Contact.find(findOptions);

    const skip = (page - 1) * limit;
    contactsQuery.skip(skip).limit(limit);

    const contacts = await contactsQuery.populate("owner");
    const contactsWithoutPassword = contacts.map((contact) => {
      contact.owner.password = undefined;
      return contact;
    });

    return contactsWithoutPassword;
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

const addContact = async (body, user) => {
  try {
    body.owner = user;

    const contact = await Contact.create(body);
   
    return contact;
  } catch (err) {
    console.error(err.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    return Contact.findByIdAndUpdate({ _id: contactId }, body, { new: true });
  } catch (err) {
    console.error(err.message);
  }
};

const updateStatusContact = async (contactId, body) => {
  try {
    const { favorite } = body;

    return Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
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
  updateStatusContact,
};
