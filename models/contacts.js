// const { nanoid } = require("nanoid");
// const path = require("path");
// const fs = require("fs").promises;
const Contact = require("../models/contactModel");

// const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async (id, query) => {
  try {
    const { limit, page, favorite } = query;

    // if (favorite) {
    //   const findOptions = {$and: [{id}, {favorite}]}
    // }

    const findOptions = favorite ? { $and: [{ id }, { favorite }] } : { id };
    const contactsQuery = Contact.find(findOptions);

    const paginationPage = +page || 1;
    const paginationLimit = +limit || 5;
    const skip = (paginationPage - 1) * paginationLimit;
    contactsQuery.skip(skip).limit(paginationLimit);

    const contacts = await contactsQuery.populate("owner");

    return contacts;
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
      body.owner = user.id  
    
    return Contact.create(body);
    
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
