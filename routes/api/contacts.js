const express = require("express");
// const { listContacts,} = require("../../models/contacts");

const {
  getListContactsController,
  getContactByIdController,
  removeContactController,
  updateContactController,
  getAddContactByIdController,
  updateStatusContactController,
} = require("../../controllers/contactControllers");
const {
  checkContactData,
  checkContactId,
  checkContactBody,
  checkContactStatus,
} = require("../../middlewares/contactMiddlewares");

const router = express.Router();

router
  .route("/")
  .get(getListContactsController)
  .post(checkContactData, getAddContactByIdController);

router.use("/:id", checkContactId);

router
  .route("/:contactId")
  .get(getContactByIdController)
  .put(checkContactBody, updateContactController)
  .delete(removeContactController);

router
  .route("/:contactId/favorite")
  .put(checkContactStatus, updateStatusContactController);

module.exports = router;
