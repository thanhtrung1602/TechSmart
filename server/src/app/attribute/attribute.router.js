const express = require("express");
const router = express.Router();
const AttributeController = require("./attribute.controller");
const { attributeVal } = require("../../validators/other.validator");
const { jwtMiddlewareRole, jwtMiddleware } = require("../../middleware");
router.post(
  "/createAttribute",
  jwtMiddlewareRole,
  attributeVal,
  AttributeController.createAttribute
);
router.get("/getAllAttribute", AttributeController.getAllAttribute);
router.patch(
  "/updateAttribute/:id",
  jwtMiddlewareRole,
  AttributeController.updateAttribute
);
router.delete(
  "/deleteAttribute/:id",
  jwtMiddlewareRole,
  AttributeController.deleteAttribute
);
router.get("/getOneAttribute/:id", AttributeController.getOneAttribute);

module.exports = router;
