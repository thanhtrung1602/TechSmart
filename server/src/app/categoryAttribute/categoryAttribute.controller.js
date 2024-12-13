const asyncWrapper = require("../../middleware/async");
const categoryAttributeService = require("./categoryAttribute.service");

class CategoryAttributeController {
    //Get all
    getAllCategoryAttributes = asyncWrapper(async (req, res) => {
        const categoryAttributes = await categoryAttributeService.getAll();
        return res.status(200).json(categoryAttributes);
    })

    //Get one
    getOneCategoryAttribute = asyncWrapper(async (req, res) => {
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(500).json({ error: "invalid id" });
        }

        const categoryAttribute = await categoryAttributeService.getOne(id);
        return res.status(200).json(categoryAttribute);
    })

    //Get by category
    getCategoryAttributesByCategory = asyncWrapper(async (req, res) => {
        const { categoryId } = req.params;

        if (!categoryId) {
            return res.status(500).json({ error: "invalid id" });
        }

        const categoryAttributes = await categoryAttributeService.getByCategory(categoryId);
        return res.status(200).json(categoryAttributes);
    })

    //Get by attribute
    getCategoryAttributesByAttribute = asyncWrapper(async (req, res) => {
        const { attributeId } = req.params;

        if (!attributeId) {
            return res.status(500).json({ error: "invalid id" });
        }

        const categoryAttributes = await categoryAttributeService.getByAttribute(attributeId);
        return res.status(200).json(categoryAttributes);
    })

    //Create
    createCategoryAttribute = asyncWrapper(async (req, res) => {
        const { categoryId, attributeId } = req.body;

        if (!categoryId || !attributeId) {
            return res.status(500).json({ error: "invalid id" });
        }

        const numberCategoryId = parseInt(categoryId);
        const numberAttributeId = parseInt(attributeId);

        const categoryAttribute = await categoryAttributeService.create({
            categoryId: numberCategoryId,
            attributeId: numberAttributeId
        });
        return res.status(200).json(categoryAttribute);
    })

    //Update
    updateCategoryAttribute = asyncWrapper(async (req, res) => {
        const { id } = req.params;
        const { categoryId, attributeId } = req.body;

        if (!categoryId || !attributeId) {
            return res.status(500).json({ error: "invalid id" });
        }

        if (!id) {
            return res.status(500).json({ error: "invalid id" });
        }

        const categoryAttribute = await categoryAttributeService.update(id, req.body);
        return res.status(200).json(categoryAttribute);
    })

    //Delete
    deleteCategoryAttribute = asyncWrapper(async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(500).json({ error: "invalid id" });
        }

        const categoryAttribute = await categoryAttributeService.delete(id);
        return res.status(200).json(categoryAttribute);
    })
}

module.exports = new CategoryAttributeController();