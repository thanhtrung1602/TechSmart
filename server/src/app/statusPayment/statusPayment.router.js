const express = require("express");
const router = express.Router();
const statusPayment = require("./statusPayment.controller");
const { jwtMiddlewareRole, jwtMiddleware } = require("../../middleware");

router.post(
  "/createStatusPayment",
  jwtMiddlewareRole,
  statusPayment.createStatusPayment
);
router.get("/findAllStatusPayment", statusPayment.findAllStatusPayment);
router.get("/findOneStatusPayment/:id", statusPayment.findOneStatusPayment);
router.patch(
  "/updateStatusPayment/:id",
  jwtMiddlewareRole,
  statusPayment.updateStatusPayment
);
router.delete(
  "/deleteStatusPayment/:id",
  jwtMiddlewareRole,
  statusPayment.deleteStatusPayment
);

module.exports = router;
