const asyncWrapper = require("../../middleware/async");
const statusPaymentService = require("./statusPayment.service");

class StatusPaymentController {
  createStatusPayment = asyncWrapper(async (req, res) => {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json("thiếu giá trị");
    }
    const statusPayment = await statusPaymentService.createStatusPayment(
      req.body
    );
    return res.status(200).json(statusPayment);
  });

  findAllStatusPayment = asyncWrapper(async (req, res) => {
    const findAll = await statusPaymentService.findAllStatusPayment();
    return res.status(200).json(findAll);
  });

  findOneStatusPayment = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id không hợp lệ" });
    }
    const findOne = await statusPaymentService.findOneStatusPayment(id);
    if (!findOne) {
      return res.status(404).json({ message: "không tìm thấy" });
    }
    return res.status(200).json(findOne);
  });

  updateStatusPayment = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id không hợp lệ" });
    }
    const updated = await statusPaymentService.updateStatusPayment(
      id,
      req.body
    );
    if (!updated) {
      return res.status(400).json({ message: "Không cập nhật được" });
    }
    return res.status(200).json(updated);
  });

  deleteStatusPayment = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id không hợp lệ" });
    }
    const deleted = await statusPaymentService.deleteStatusPayment(id);
    if (!deleted) {
      return res.status(400).json({ message: "Lỗi xóa" });
    }
    return res.status(200).json({ message: "Đã xóa" });
  });
  findAllStatusPaymentById = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const findAllById = await statusPaymentService.findAllStatusPaymentById(id);
    return res.status(200).json(findAllById);
  });
}

module.exports = new StatusPaymentController();
