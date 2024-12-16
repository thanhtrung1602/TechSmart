const variantService = require("./variant.service");
const asyncWrapper = require("../../middleware/async");

class VariantController {
    getAllVariant = asyncWrapper(async (req, res) => {
        const variant = await variantService.getAllVariant();
        res.status(200).json(variant);
    });
    getVariantById = asyncWrapper(async (req, res) => {
        const id = parseInt(req.params.id);

        if (!id) {
            return res.status(400).json("Invalid input: id is required");
        }

        const variant = await variantService.getVariantById(id);
        res.status(200).json(variant);
    });
    createVariant = asyncWrapper(async (req, res) => {
        const { productId, stock, price } = req.body;

        const parseProductId = parseInt(productId);
        const parseStock = parseInt(stock);
        const parsePrice = parseInt(price);


        if (!parseProductId || !parseStock || !parsePrice) {
            return res.status(400).json("Invalid input: variant is required");
        }

        console.log("Controller created:", parseProductId, parseStock, parsePrice);

        const variant = await variantService.createVariant(
            parseProductId,
            parseStock,
            parsePrice
        );

        console.log("Response:", variant)

        res.status(200).json(variant);
    });
    updateVariant = asyncWrapper(async (req, res) => {
        const id = parseInt(req.params.id);
        const { productId, stock, price } = req.body;

        const parseProductId = parseInt(productId);
        const parseStock = parseInt(stock);
        const parsePrice = parseInt(price);

        if (!id || !parseProductId || !parseStock || !parsePrice) {
            return res.status(400).json("Invalid input: variant is required");
        }

        const variant = await variantService.updateVariant(
            id,
            parseProductId,
            parseStock,
            parsePrice
        );
        res.status(200).json(variant);
    });
    deleteVariant = asyncWrapper(async (req, res) => {
        const id = parseInt(req.params.id);

        if (!id) {
            return res.status(400).json("Invalid input: id is required");
        }

        const variant = await variantService.deleteVariant(id);
        res.status(200).json(variant);
    });
    getAllVariantByProductId = asyncWrapper(async (req, res) => {
        const productId = parseInt(req.params.id);

        if (!productId) {
            return res.status(400).json("Invalid input: id is required");
        }

        const variant = await variantService.getAllVariantByProductId(productId);
        res.status(200).json(variant);
    });
    getOneVariantByProductId = asyncWrapper(async (req, res) => {
        const productId = parseInt(req.params.id);

        if (!productId) {
            return res.status(400).json("Invalid input: id is required");
        }

        const variant = await variantService.getOneVariantByProductId(productId);
        res.status(200).json(variant);
    });
}

module.exports = new VariantController();