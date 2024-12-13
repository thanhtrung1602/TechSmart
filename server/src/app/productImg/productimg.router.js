const express = require("express");
const router = express.Router();
const ProductImgController = require("./productImg.controller");
const uploadCloud = require("../../config/cloudinary");
const { jwtMiddleware, jwtMiddlewareRole } = require("../../middleware");

router.post(
  "/createProductImg",
  jwtMiddlewareRole,
  uploadCloud.array("img", 10),
  ProductImgController.createProductImg
);
router.get("/getAllProductImgs", ProductImgController.getAllProductImg);
router.get(
  "/getOneProductImgById/:id",
  ProductImgController.getOneProductImgById
);
router.get(
  "/getAllProductImgByProduct/:id",
  ProductImgController.getAllProductImgByProduct
);
router.patch(
  "/updateProductImg/:id",
  jwtMiddlewareRole,
  uploadCloud.array("img", 10),
  ProductImgController.updateProductImg
);
router.delete(
  "/deleteProductImg/:id",
  jwtMiddlewareRole,
  ProductImgController.deleteProductImg
);

module.exports = router;
