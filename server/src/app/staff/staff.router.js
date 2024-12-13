const express = require("express");
const router = express.Router();
const staffController = require("./staff.controller");
const { jwtMiddlewareRole, jwtMiddleware } = require("../../middleware");

router.get("/findAll", jwtMiddlewareRole, staffController.findAll);

router.get("/findOne/:id", jwtMiddlewareRole, staffController.findOne);

router.post("/createStaff", jwtMiddlewareRole, staffController.createStaff);

router.put("/updateStaff/:id", jwtMiddlewareRole, staffController.updateStaff);

router.delete("/delStaff/:id", jwtMiddlewareRole, staffController.delStaff);

router.get(
  "/getAllStaffWithFilter",
  jwtMiddlewareRole,
  staffController.getAllStaffWithFilter
);

module.exports = router;
