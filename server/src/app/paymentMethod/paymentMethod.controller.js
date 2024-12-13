const asyncWrapper = require("../../middleware/async");
const paymentMethodService = require("./paymentMethod.service");

class PaymentMethodController {
  createPaymentMethod = asyncWrapper(async (req, res) => {
    const { type } = req.body;
    if (
      !type
    ) {
      return res.status(400).json("thiếu giá trị");
    }
    const paymentMethod = await paymentMethodService.createPaymentMethod(req.body);

    return res.status(200).json(paymentMethod);
  });

  findAllPaymentMethod = asyncWrapper(async (req, res) => {
    const paymentMethod = await paymentMethodService.findAllPaymentMethod();
    return res.status(200).json(paymentMethod);
  });

  findOnePaymentMethodById = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id không hợp lệ" });
    }
    const paymentMethod = await paymentMethodService.findOnePaymentMethodById(id);
    return res.status(200).json(paymentMethod);
  });

  updatePaymentMethod = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "id không hợp lệ" });
    }

    const updatePaymentMethod = await paymentMethodService.updatePaymentMethod(id, req.body);

    if (!updatePaymentMethod) {
      return res.status(400).json({ message: "Không cập nhật được" });
    }
    return res.status(200).json(updatePaymentMethod);
  });

  deletePaymentMethod = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id không hợp lệ" });
    }

    const deletePaymentMethod = await paymentMethodService.deletePaymentMethod(id);
    if (!deletePaymentMethod) {
      return res.status(400).json({ message: "Lỗi xóa" });
    }
    return res.status(200).json({ message: "Đã xóa" });
  });
  findAllPaymentMethodById= asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const findAllPaymentMethodById = await paymentMethodService.findAllPaymentMethodById(id);
    return res.status(200).json(findAllPaymentMethodById);
  });
}

module.exports = new PaymentMethodController();
