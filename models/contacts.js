const { nanoid } = require("nanoid");
const path = require("path");

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
    const contact = contacts.find(({ id }) => id === contactId);
    return contact;
  } catch (err) {
    console.error(err.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const newContacts = contacts.filter(({ id }) => id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
  } catch (err) {
    console.error(err.message);
  }
};

const addContact = async (body) => {
  try {
    const contacts = await listContacts();
    // body.id = nanoid();
    await fs.writeFile(contactsPath, JSON.stringify([...contacts, {id: nanoid(), ...body}]));
    return body;
  } catch (err) {
    console.error(err.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const { name, email, phone } = body;
    const contacts = await listContacts();
    const contactUpdated = contacts.find(({ id }) => id === contactId);

    if (name) contactUpdated.name = name;
    if (email) contactUpdated.email = email;
    if (phone) contactUpdated.phone = phone;

    const contactIdx = contacts.findIndex((item) => item.id === contactId);
    contacts[contactIdx] = contactUpdated;
    await fs.writeFile(contactsPath, JSON.stringify(contacts));

    return contactUpdated;
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
