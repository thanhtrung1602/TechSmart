const express = require("express");
const router = express.Router();
const ManufacturerController = require("./manufacturer.controller");
const uploadCloud = require("../../config/cloudinary");
const { brandVal } = require("../../validators/other.validator");
const { jwtMiddlewareRole, jwtMiddleware } = require("../../middleware");

router.get(
  "/filteredManufacturer",
  ManufacturerController.filteredManufacturer
);
router.get("/findAll", ManufacturerController.findAll);
router.get("/getAllManufacturer", ManufacturerController.getAllManufacturer);
router.get(
  "/getOneManufacturerById/:id",
  ManufacturerController.getOneManufacturerById
);
router.get(
  "/getAllManufacturerById/:id",
  ManufacturerController.getAllManufacturerById
);
router.get(
  "/getManufacturerByCategory/:slug",
  ManufacturerController.getManufacturerByCategory
);
router.post(
  "/createManufacturer",
  jwtMiddlewareRole,
  uploadCloud.single("img"),
  brandVal,
  ManufacturerController.createManufacturer
);
router.patch(
  "/updateManufacturer/:id",
  jwtMiddlewareRole,
  uploadCloud.single("img"),
  ManufacturerController.updateManufacturer
);
router.patch("/updateManufacturerByVisible/:id", jwtMiddlewareRole, ManufacturerController.updateManufacturerByVisible);
router.delete(
  "/delManufacturer/:id",
  jwtMiddlewareRole,
  ManufacturerController.delManufacturer
);

module.exports = router;
