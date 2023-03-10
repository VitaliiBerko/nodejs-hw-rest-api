const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../models/contacts");

exports.getListContactsController = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({
      msg: err.msg,
    });
  }
};

exports.getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    //   const {contact}= req

    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({
      msg: err.msg,
    });
  }
};

exports.getAddContactByIdController = async (req, res, next) => {
  try {
    const { body } = req;

    const contactAdd = await addContact(body);

    res.status(201).json(contactAdd);
  } catch (err) {
    res.status(500).json({
      msg: err.msg,
    });
  }
};

exports.removeContactController = async (req, res) => {
  try {
    const { id } = req.params;
    await removeContact(id);
    res.status(200).json({ message: "contact deleted" });
  } catch (err) {
    res.status(500).json({
      msg: err.msg,
    });
  }
};

exports.updateContactController = async (req, res) => {
  try {
    const { body } = req;
    const { id } = req.params;
    const contactUpdated = await updateContact(id, body);
    res.status(200).json(contactUpdated);
  } catch (err) {
    res.status(500).json({
      msg: err.msg,
    });
  }
};
