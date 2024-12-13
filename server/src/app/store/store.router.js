const express = require("express");
const router = express.Router();
const storeController = require("./store.controller");
const { jwtMiddlewareRole, jwtMiddleware } = require("../../middleware");

router.get("/findAll", storeController.findAll);
router.get("/findOne/:id", storeController.findOne);
router.post("/createStore", jwtMiddlewareRole, storeController.createStore);
router.put("/updateStore/:id", jwtMiddlewareRole, storeController.updateStore);
router.delete("/delStore/:id", jwtMiddlewareRole, storeController.delStore);

module.exports = router;
