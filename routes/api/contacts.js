const express = require("express");
const { listContacts, getContactById } = require("../../models/contacts");
const { nanoid } = require("nanoid");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({
      contacts,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.msg,
    });
  }
  // res.json({ message: "template message" });
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const {contactId}= req.params;
    const contact = await getContactById(contactId);

    res.status(200).json({
      contact,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.msg,
    });
  }

  // res.json({ message: "template message" });
});

router.post("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();

    const newContact ={
      id: nanoid(),
      ...req.body
    }
    contacts.push(newContact);
    res.status(201).json({
      newContact,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.msg,
    });
  }
  // res.json({ message: "template message" });
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
