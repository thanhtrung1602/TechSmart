const express = require("express");
const router = express.Router();
const CategoryAttributeController = require("./categoryAttribute.controller");
const { jwtMiddlewareRole, jwtMiddleware } = require("../../middleware");

router.get(
  "/getAllCategoryAttributes",
  CategoryAttributeController.getAllCategoryAttributes
);

router.get(
  "/getCategoryAttributeById/:id",
  CategoryAttributeController.getOneCategoryAttribute
);

router.get(
  "/getCategoryAttributesByCategory/:categoryId",
  CategoryAttributeController.getCategoryAttributesByCategory
);

router.get(
  "/getCategoryAttributesByAttribute/:attributeId",
  CategoryAttributeController.getCategoryAttributesByAttribute
);

router.post(
  "/createCategoryAttribute",
  jwtMiddlewareRole,
  CategoryAttributeController.createCategoryAttribute
);

router.put(
  "/updateCategoryAttribute/:id",
  jwtMiddlewareRole,
  CategoryAttributeController.updateCategoryAttribute
);

router.delete(
  "/deleteCategoryAttribute/:id",
  jwtMiddlewareRole,
  CategoryAttributeController.deleteCategoryAttribute
);

module.exports = router;
