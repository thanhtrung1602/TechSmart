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

router.get(
  "/getOneValueAttributeByProductId/:id",
  ValueAttributeController.getOneValueAttributeByProductId
);

router.get(
  "/getAttributeValueByVariant/:id",
  ValueAttributeController.getAttributeValueByVariant
);

router.post(
  "/createValueAttribute",

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

module.exports = router;
