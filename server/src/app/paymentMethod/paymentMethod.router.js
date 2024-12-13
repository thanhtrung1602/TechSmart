const express = require("express");
const router = express.Router();
const paymentMethodController = require("./paymentMethod.controller");
const { jwtMiddlewareRole, jwtMiddleware } = require("../../middleware");

router.post(
  "/createPaymentMethod",
  jwtMiddlewareRole,
  paymentMethodController.createPaymentMethod
);
router.get(
  "/findAllPaymentMethod",
  paymentMethodController.findAllPaymentMethod
);
router.get(
  "/findAllPaymentMethodById/:id",
  paymentMethodController.findAllPaymentMethodById
);
router.get(
  "/findOnePaymentMethodById/:id",
  paymentMethodController.findOnePaymentMethodById
);
router.patch(
  "/updatePaymentMethod/:id",
  jwtMiddlewareRole,
  paymentMethodController.updatePaymentMethod
);
router.delete(
  "/deletePaymentMethod/:id",
  jwtMiddlewareRole,
  paymentMethodController.deletePaymentMethod
);

module.exports = router;
