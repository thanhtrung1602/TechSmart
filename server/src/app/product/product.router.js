const express = require("express");
const router = express.Router();
const ProductsController = require("./product.controller");
const uploadCloud = require("../../config/cloudinary");
const { productVal } = require("../../validators/other.validator");
const { jwtMiddleware, jwtMiddlewareRole } = require("../../middleware");

//Get of products
router.get("/filteredProducts", ProductsController.filteredProducts);
router.get("/getAllProducts", ProductsController.getAllProducts);
router.get("/findAll", ProductsController.findAll);
router.get(
  "/getOneProduct/:slug",

  ProductsController.getSlugProduct
);
router.get("/getOneProductById/:id", ProductsController.getOneProductById);
router.get("/getProductPrice", ProductsController.getProductPrice);
router.get("/getProductVisible", ProductsController.getProductVisible);
router.get("/getProductsHot", ProductsController.getProductsHot);
router.get("/getProductsPoor", ProductsController.getProductsPoor);

router.get(
  "/getProductByDiscount/:discount",
  ProductsController.getProductByDiscount
);
router.get("/search", ProductsController.searchProduct);
router.get("/tim-kiem", ProductsController.search);
//Get of manufacturers
router.get(
  "/getProductByManufacturer/:id",

  ProductsController.getProductByManufacturer
);
router.get(
  "/getProductOfManufacturerCategoryAndPrice/:categorySlug/:manufacturerSlug",

  ProductsController.getProductOfManufacturerCategoryAndPrice
);

//Get of categories
router.get(
  "/getProductCategoryDiscount/:discount/:slug",

  ProductsController.getProductCategoryAndDiscount
);
router.get(
  "/getProductAllCategory/:slug",

  ProductsController.getProductAllCategory
);
router.get(
  "/getProductAllManufacturer/:id",

  ProductsController.getProductAllManufacturer
);
router.get(
  "/getProductCategory/:slug",

  ProductsController.getProductByCategory
);

//CUD
router.post(
  "/createProduct",
  jwtMiddlewareRole,
  uploadCloud.single("img"),
  // productVal,
  ProductsController.createProduct
);

router.patch(
  "/updateProduct/:id",
  jwtMiddlewareRole,
  uploadCloud.single("img"),
  ProductsController.updateProduct
);

router.patch("/updateProductStock/:id", ProductsController.updateProductStock);
router.get("/suggestProduct/:id", ProductsController.suggestProduct);
router.delete(
  "/deleteProduct/:id",
  jwtMiddlewareRole,
  ProductsController.deleteProduct
);

//Check stock
router.get("/checkStock/:id", ProductsController.checkStock);
router.patch(
  "/updateProductByVisible/:id",
  jwtMiddlewareRole,
  ProductsController.updateProductByVisible
);

module.exports = router;
