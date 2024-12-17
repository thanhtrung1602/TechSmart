const express = require("express");
const router = express.Router();
const ValueAttributeController = require("./valueattribute.controller");
const { jwtMiddlewareRole, jwtMiddleware } = require("../../middleware");

router.get(
  "/getAllValueAttribute",
  ValueAttributeController.getAllValueAttribute
);
router.get(
  "/getOneValueAttributeById/:id",
  ValueAttributeController.getOneValueAttributeById
);
router.post(
  "/createValueAttribute",
  jwtMiddlewareRole,
  ValueAttributeController.createValueAttribute
);
router.patch(
  "/updateValueAttribute/:id",
  jwtMiddlewareRole,
  ValueAttributeController.updateValueAttribute
);
router.patch(
  "/updateProductValueAttribute/:productId",
  jwtMiddlewareRole,
  ValueAttributeController.updateProductValueAttribute
);
router.delete(
  "/delValueAttribute/:id",
  jwtMiddlewareRole,
  ValueAttributeController.delValueAttribute
);

router.delete(
  "/delValueAttributeByVariant/:id",
  jwtMiddlewareRole,
  ValueAttributeController.delValueAttributeByVariant
);

module.exports = router;
