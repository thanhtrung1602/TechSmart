const asyncWrapper = require("../../middleware/async");
const statusOrderService = require("./statusOrder.service");

class StatusOrderController {
  createStatusOrder = asyncWrapper(async (req, res) => {
    const { status } = req.body;
    if (
      !status
    ) {
      return res.status(400).json("thiếu giá trị");
    }
    const statusOrder = await statusOrderService.createStatusOrder(req.body);
    return res.status(200).json(statusOrder);
  });

  findAllStatusOrder = asyncWrapper(async (req, res) => {
    const findAll = await statusOrderService.findAllStatusOrder();
    return res.status(200).json(findAll);
  });

  findOneStatusOrder = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id không hợp lệ" });
    }
    const findOne = await statusOrderService.findOneStatusOrder(id);
    if (!findOne) {
      return res.status(404).json({ message: "không tìm thấy" });
    }
    return res.status(200).json(findOne);
  });

  updateStatusOrder = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id không hợp lệ" });
    }
    const updated = await statusOrderService.updateStatusOrder(id, req.body);
    if (!updated) {
      return res.status(400).json({ message: "Không cập nhật được" });
    }
    return res.status(200).json(updated);
  });

  deleteStatusOrder = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id không hợp lệ" });
    }
    const deleted = await statusOrderService.deleteStatusOrder(id);
    if (!deleted) {
      return res.status(400).json({ message: "Lỗi xóa" });
    }
    return res.status(200).json({ message: "Đã xóa" });
  });
  findAllStatusOrderById = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const findAllById = await statusOrderService.findAllStatusOrderById(id);
    return res.status(200).json(findAllById);
  });
}

module.exports = new StatusOrderController();
