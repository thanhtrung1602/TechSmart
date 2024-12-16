const asyncWrapper = require("../../middleware/async");
const storeService = require("./store.service");
class StoreController {
  findAll = asyncWrapper(async (req, res) => {
    const findAll = await storeService.findAll();
    return res.status(200).json(findAll);
  });

  findOne = asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const findOne = await storeService.findOne(id);
    return res.status(200).json(findOne);
  });

  createStore = asyncWrapper(async (req, res) => {
    console.log(req.body);
    const { province, district, ward, street, phone, codeStore } = req.body;

    if (
      !street ||
      !ward ||
      !district ||
      !province ||
      !phone ||
      !codeStore
    ) {
      return res.status(400).json("Thiếu giá trị");
    }

    const create = await storeService.createStore(req.body);

    if (!create) {
      return res.status(400).json({ message: "Không tạo được cửa hàng" });
    }

    return res.status(200).json(create);
  });

  updateStore = asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const update = await storeService.updateStore(id, req.body);
    return res.status(200).json(update);
  });

  delStore = asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const delStore = await storeService.delStore(id);
    return res.status(200).json(delStore);
  });
  updateStoreByVisible = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(500).json({ error: "invalid id" });
    }
    const updateStoreByVisible = await storeService.updateStoreByVisible(id);
    return res.status(200).json(updateStoreByVisible);
  });
}

module.exports = new StoreController();
