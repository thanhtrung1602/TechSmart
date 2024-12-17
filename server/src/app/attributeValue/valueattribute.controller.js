const { getKey, setKey } = require("../../db/init.redis");
const asyncWrapper = require("../../middleware/async");
const ValueAttributeService = require("./valueattribute.service");

class ValueAttributeController {
  getAllValueAttribute = asyncWrapper(async (req, res) => {
    const getAllValueAttribute =
      await ValueAttributeService.getAllValueAttribute();
    return res.status(200).json(getAllValueAttribute);
  });

  getOneValueAttributeById = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json("Invalid input: id is required");
    }

    const getOneValueAttributeById =
      await ValueAttributeService.getOneValueAttributeById(id);

    return res.status(200).json(getOneValueAttributeById);
  });

  createValueAttribute = asyncWrapper(async (req, res) => {

    const { attributeId, productId, variantId, value } = req.body;

    console.log("Controller created:", attributeId, productId, variantId, value);

    if (!attributeId || !productId || !value) {
      return res.status(400).json("Invalid input: attributeId, productId, value are required");
    }

    const numberAttributeId = parseInt(attributeId);

    const createValueAttribute =
      await ValueAttributeService.createValueAttribute({
        attributeId: numberAttributeId,
        productId,
        variantId,
        value
      });
    return res.status(200).json(createValueAttribute);
  });

  updateValueAttribute = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const { attributeId, productId, value } = req.body;
    if (!id) {
      return res.status(500).json({ error: "invalid id" });
    }
    const numberAttributeId = parseInt(attributeId);
    const numberProductId = parseInt(productId);
    const updateValueAttribute =
      await ValueAttributeService.updateValueAttribute(
        numberAttributeId,
        numberProductId,
        value,
        id
      );
    return res.status(200).json({ message: "Updated attributes successfully", results: updateValueAttribute });
  });

  updateProductValueAttribute = asyncWrapper(async (req, res) => {
    const productId = parseInt(req.params.productId);
    const { attributeId, variantId, value, id } = req.body;

    console.log("Controller updated:", productId, attributeId, variantId, value, id);

    if (!productId) {
      return res.status(500).json({ error: "invalid productId" });
    }

    const numberAttributeId = parseInt(attributeId);
    const valueId = parseInt(id);
    const numberVariantId = variantId !== null ? parseInt(variantId) : null;
    const updateResults = await ValueAttributeService.updateOrCreateProductValueAttribute({ productId, attributeId: numberAttributeId, variantId: numberVariantId, value, id: valueId });

    return res.status(200).json({ message: "Updated attributes successfully", results: updateResults });
  });


  delValueAttribute = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(500).json({ error: "invalid id" });
    }
    const delValueAttribute = await ValueAttributeService.delValueAttribute(id);
    return res.status(200).json(delValueAttribute);
  });

  delValueAttributeByVariant = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(500).json({ error: "invalid id" });
    }
    const delValueAttributeByVariant = await ValueAttributeService.delValueAttributeByVariant(id);
    return res.status(200).json(delValueAttributeByVariant);
  });
}

module.exports = new ValueAttributeController();
