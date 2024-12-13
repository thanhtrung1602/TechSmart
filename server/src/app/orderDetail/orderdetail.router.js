const express = require("express");
const router = express.Router();
const OrderDetailController = require("./orderdetail.controller");
const { jwtMiddleware } = require("../../middleware");


router.post(
  "/createOrderDetail",
  jwtMiddleware,
  OrderDetailController.createOrderDetail
);

router.get(
  "/getAllOrderDetails",
  jwtMiddleware,
  OrderDetailController.getAllOrderDetails
);

router.get(
  "/getAllOrderDetailByOrderId/:id",
  jwtMiddleware,
  OrderDetailController.getAllOrderDetailByOrderId
);

router.delete(
  "/deleteOrderDetail/:id",
  jwtMiddleware,
  OrderDetailController.deleteOrderDetail
);

module.exports = router;
