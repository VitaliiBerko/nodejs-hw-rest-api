// const { nanoid } = require("nanoid");npm 
const  path = require("path");

const fs = require("fs").promises;

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath, "utf-8"));
    return contacts;
  } catch (err) {
    console.error(err.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contact = contacts.find(({id})=>id===contactId);
    return contact;   
  } catch (err) {
    console.error(err.message);
  }

};

const removeContact = async (contactId) => {
  try {
    const contacts = listContacts();
    const newContacts = contacts.filter(({id})=>id!==contactId);
    await fs.writeFile(contactsPath, JSON.stringify(newContacts))
    return newContacts;   

  } catch (err) {
    console.error(err.message);
  }
};

const addContact = async (body) => {
  try {
    const contacts = listContacts();
     await fs.writeFile(contactsPath, JSON.stringify([...contacts, body]))
    const newContacts = JSON.parse(await fs.readFile(contactsPath))
    return newContacts;
  } catch (err) {
    console.error(err.message);
  }
};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
