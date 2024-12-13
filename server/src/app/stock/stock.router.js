const express = require("express");
const router = express.Router();
const stockController = require("./stock.controller");
const { jwtMiddlewareRole, jwtMiddleware } = require("../../middleware");
router.get("/findAll", stockController.findAll);
router.get("/findOne/:id", stockController.findOne);
router.get("/findOneByStore/:id", stockController.findOneByStore);
router.get("/findAllByProductId/:id", stockController.findAllByProductId);
router.post("/createStock", jwtMiddlewareRole, stockController.createStock);
router.patch(
  "/updateStock/:id",
  jwtMiddlewareRole,
  stockController.updateStock
);
router.delete("/delStock/:id", jwtMiddlewareRole, stockController.delStock);

module.exports = router;
