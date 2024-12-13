const express = require("express");
const router = express.Router();
const AddressController = require("./address.controller");
const { jwtMiddleware, jwtMiddlewareRole } = require("../../middleware");

router.post("/createAddress", jwtMiddleware, AddressController.createAddress);
router.get(
  "/getAllAddresses",
  jwtMiddlewareRole,
  AddressController.getAllAddresses
);
router.get(
  "/getAddressesByUser/:id",
  jwtMiddleware,
  AddressController.getAddressesByUser
);
router.get("/getAddress/:id", AddressController.getAddressById);
router.patch(
  "/updateAddress/:id",
  jwtMiddleware,
  AddressController.updateAddress
);
router.delete(
  "/deleteAddress/:id",
  jwtMiddleware,
  AddressController.deleteAddress
);

module.exports = router;
