const express = require("express");
const router = express.Router();
const contactController = require("./contact.Controller");
const { jwtMiddlewareRole, jwtMiddleware } = require("../../middleware");

router.post("/createConTact", contactController.createConTact);
router.get(
  "/getAllContacts",
  jwtMiddleware,
  jwtMiddlewareRole,
  contactController.getAllContacts
);
router.get(
  "/getOneContact/:id",
  jwtMiddleware,
  jwtMiddlewareRole,
  contactController.getContactById
);
router.put(
  "/updateContact/:id",
  jwtMiddleware,
  jwtMiddlewareRole,
  contactController.updateContact
);
router.delete(
  "/deleteContact/:id",
  jwtMiddleware,
  jwtMiddlewareRole,
  contactController.deleteContact
);
router.get("/searchContact", contactController.searchContact);

module.exports = router;
