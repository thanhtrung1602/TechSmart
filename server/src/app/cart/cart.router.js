const express = require("express");
const router = express.Router();
const CartController = require("./cart.controller");

router.get("/getAllCartByUserId/:id", CartController.getAllCartByUserId);

router.post("/createCart", CartController.createCart);

router.patch("/updateQuantity/:id", CartController.updateQuantity);

router.delete("/deleteCartItem/:id", CartController.deleteCartItem);

router.delete("/clearCart/:userId", CartController.clearCart);

module.exports = router;
