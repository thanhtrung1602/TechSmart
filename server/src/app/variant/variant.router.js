const express = require("express");
const router = express.Router();
const VariantController = require("./variant.controller");
const { jwtMiddlewareRole, jwtMiddleware } = require("../../middleware");

router.get("/getAllVariant", VariantController.getAllVariant);
router.get("/getVariantById/:id", VariantController.getVariantById);
router.get("/getAllVariantByProductId/:id", VariantController.getAllVariantByProductId);
router.get("/getOneVariantByProductId/:id", VariantController.getOneVariantByProductId);
router.post("/createVariant", jwtMiddlewareRole, VariantController.createVariant);
router.patch("/updateVariant/:id", jwtMiddlewareRole, VariantController.updateVariant);
router.patch("/updateProductVariant/:id", jwtMiddlewareRole, VariantController.updateProductVariant);
router.delete("/deleteVariant/:id", jwtMiddlewareRole, VariantController.deleteVariant);

module.exports = router;