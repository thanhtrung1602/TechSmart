const express = require("express");
const router = express.Router();
const statusOrder = require("./statusOrder.controller");
const { jwtMiddlewareRole, jwtMiddleware } = require("../../middleware");

router.post(
  "/createStatusOrder",
  jwtMiddlewareRole,
  statusOrder.createStatusOrder
);
router.get("/findAllStatusOrder", statusOrder.findAllStatusOrder);
router.get("/findOneStatusOrder/:id", statusOrder.findOneStatusOrder);
router.patch(
  "/updateStatusOrder/:id",
  jwtMiddlewareRole,
  statusOrder.updateStatusOrder
);
router.delete(
  "/deleteStatusOrder/:id",
  jwtMiddlewareRole,
  statusOrder.deleteStatusOrder
);

module.exports = router;
