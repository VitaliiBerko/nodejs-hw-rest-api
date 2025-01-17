const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../models/contacts");

exports.getListContactsController = async (req, res, next) => {
  try {
    const { id } = req.user;

    const contacts = await listContacts(id, req.query);
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

exports.getAddContactByIdController = async (req, res) => {
  try {
    const { body, user } = req;
    const contactAdd = await addContact(body, user);
    // console.log("--->", req.user);
    // console.log("addContact--->", contactAdd);
    res.status(201).json(contactAdd);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.removeContactController = async (req, res) => {
  try {
    const { contactId } = req.params;
    await removeContact(contactId);
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
    const { contactId } = req.params;
    const contactUpdated = await updateContact(contactId, body);

    res.status(200).send(contactUpdated);
  } catch (err) {
    res.status(500).json({
      msg: err.msg,
    });
  }
};

exports.updateStatusContactController = async (req, res) => {
  try {
    const { body } = req;
    const { contactId } = req.params;
    const statusContactUpdated = await updateStatusContact(contactId, body);
    res.status(200).send(statusContactUpdated);
  } catch (error) {}
};
