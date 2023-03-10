const express = require("express");
// const { listContacts,} = require("../../models/contacts");

const {  getListContactsController, getContactByIdController, removeContactController, updateContactController } = require("../../controllers/contactControllers");

const router = express.Router();

router.get("/", getListContactsController
// async (req, res, next) => {
//   try {
//     const contacts = await listContacts();
//     res.status(200).json({
//       contacts,
//     });
//   } catch (err) {
//     res.status(500).json({
//       msg: err.msg,
//     });
//   }
  // res.json({ message: "template message" });
);

router.get("/:contactId",  getContactByIdController
// async (req, res, next) => {
//   try {
//     const {contactId}= req.params;
//     const contact = await getContactById(contactId);

//     res.status(200).json({
//       contact,
//     });
//   } catch (err) {
//     res.status(500).json({
//       msg: err.msg,
//     });
//   }

//   // res.json({ message: "template message" });
// }
);

router.post("/", getContactByIdController
// async (req, res, next) => {
//   try {
//     const contacts = await listContacts();

//     const newContact ={
//       id: nanoid(),
//       ...req.body
//     }
//     contacts.push(newContact);
//     res.status(201).json({
//       newContact,
//     });
//   } catch (err) {
//     res.status(500).json({
//       msg: err.msg,
//     });
//   }
//   
// }
);

router.delete("/:contactId", removeContactController);

router.put("/:contactId", updateContactController);

module.exports = router;
