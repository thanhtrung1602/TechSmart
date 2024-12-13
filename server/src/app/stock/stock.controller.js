const asyncWrapper = require("../../middleware/async");
const stockService = require("./stock.service");
class StockController {
  findAll = asyncWrapper(async (req, res) => {
    const findAll = await stockService.findAll();
    return res.status(200).json(findAll);
  });

  findOne = asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const findOne = await stockService.findOne(id);
    return res.status(200).json(findOne);
  });

  findOneByStore = asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const findOneByStore = await stockService.findOneByStore(id);
    return res.status(200).json(findOneByStore);
  });

  findAllByProductId = asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const findAll = await stockService.findAllByProductId(id);
    return res.status(200).json(findAll);
  });

  createStock = asyncWrapper(async (req, res) => {
    const create = await stockService.createStock(req.body);
    return res.status(200).json(create);
  });

  updateStock = asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const update = await stockService.updateStock(id, req.body);
    return res.status(200).json(update);
  });

  delStock = asyncWrapper(async (req, res) => {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid ID" }); // Handle invalid IDs
    }
    const delStock = await stockService.delStock(id);
    return res.status(200).json(delStock);
  });
}

module.exports = new StockController();
