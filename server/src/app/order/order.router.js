const express = require("express");
const router = express.Router();
const OrderController = require("./order.controller");
const { orderVal } = require("../../validators/other.validator");
const { jwtMiddleware, jwtMiddlewareRole } = require("../../middleware");

router.post(
  "/createOrderWithDetail",
  jwtMiddleware,
  orderVal,
  OrderController.createOrderWithDetail
);

router.post("/createOrder", jwtMiddleware, OrderController.createOrder);

router.post(
  "/payment/createPayment",
  jwtMiddleware,
  OrderController.createPaymentUrl
);

router.get("/vnpay_ipn", OrderController.vnpay_ipn);

router.get("/searchOrder", OrderController.searchOrder);

router.get("/vnpay_return", OrderController.vnpay_return);

router.get("/getOrderReturn", OrderController.getOrderReturn);

router.get("/getAllOrder", jwtMiddlewareRole, OrderController.getAllOrder);

router.get("/FindAllOrder", jwtMiddlewareRole, OrderController.FindAllOrder);

router.get("/getOrderById/:id", jwtMiddleware, OrderController.getOrderById);

router.get(
  "/getOrderByIdUser/:id",
  jwtMiddleware,
  OrderController.getOrderByIdUser
);

router.patch("/updateOrder/:id", jwtMiddleware, OrderController.updateOrder);

router.delete(
  "/deleteOrder/:id",
  jwtMiddlewareRole,
  OrderController.deleteOrder
);

router.get("/getOrderByStatus/:id", OrderController.getOrderByStatus);

router.get("/getProcessingOrder", OrderController.getProcessingOrder);

router.patch("/updateOrderStatus/:id", OrderController.updateOrderStatus);

router.get("/getStatusOrderByGHTK/:id", OrderController.getStatusOrderByGHTK);

router.get("/getPackageOrderGHTK/:id", OrderController.getPackageOrderGHTK);

router.get("/getAllOrdersWithFilter", OrderController.getAllOrdersWithFilter);

module.exports = router;
