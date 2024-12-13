const express = require("express");
const router = express.Router();
const CategoriesController = require("./category.controller");
const uploadCloud = require("../../config/cloudinary");
const { postCategoryVal } = require("../../validators/other.validator");
const { jwtMiddlewareRole, jwtMiddleware } = require("../../middleware");
router.post(
  "/createCategories",
  jwtMiddlewareRole,
  uploadCloud.single("img"),
  // postCategoryVal,
  CategoriesController.createCategories
);
router.get("/getAllCategories", CategoriesController.getAllCategories);
router.get("/filteredCategories", CategoriesController.filteredCategories);

router.get("/getCategoryById/:id", CategoriesController.getCategoryById);
router.get("/getCategorySlug/:slug", CategoriesController.getCategorySlug);

router.patch(
  "/updateCategories/:id",
  jwtMiddlewareRole,
  uploadCloud.single("img"),
  CategoriesController.updateCategories
);
router.patch("/updateCategoriesByVisible/:id", jwtMiddlewareRole, CategoriesController.updateCategoriesByVisible);

router.delete(
  "/deleteCategories/:id",
  jwtMiddlewareRole,
  CategoriesController.deleteCategories
);

module.exports = router;
