const asyncWrapper = require("../../middleware/async");
const attributeService = require("./attribute.service");

class AttributeController {
  getAllAttribute = asyncWrapper(async (req, res) => {
    const attribute = await attributeService.getAllAttribute();
    return res.status(200).json(attribute);
  });

  getOneAttribute = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const attribute = await attributeService.getOneAttribute(id);
    return res.status(200).json(attribute);
  });

  createAttribute = asyncWrapper(async (req, res) => {
    const attribute = await attributeService.createAttribute(req.body);
    return res.status(200).json(attribute);
  });

  updateAttribute = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const attribute = await attributeService.updateAttribute(id, req.body);
    return res.status(200).json(attribute);
  });

  deleteAttribute = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const attribute = await attributeService.deleteAttribute(id);
    return res.status(200).json(attribute);
  });
}

module.exports = new AttributeController();
