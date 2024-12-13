const asyncWrapper = require("../../middleware/async");
const AddressService = require("./address.service");

class AddressController {
  createAddress = asyncWrapper(async (req, res) => {
    const { province, ward, district, street, userId, name, phone } = req.body;
    if (
      !province ||
      !ward ||
      !district ||
      !street ||
      !userId ||
      !name ||
      !phone
    ) {
      return res.status(400).json("thiếu giá trị");
    }
    const address = await AddressService.createAddress(req.body);
    if (!address) {
      return res.status(400).json({ message: "Không tạo được địa chỉ" });
    }
    return res.status(200).json(address);
  });

  getAllAddresses = asyncWrapper(async (req, res) => {
    const addresses = await AddressService.getAllAddresses();
    return res.status(200).json(addresses);
  });

  getAddressById = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id không hợp lệ" });
    }
    const address = await AddressService.getAddressById(id);
    if (!address) {
      return res.status(404).json({ message: "không tìm thấy" });
    }
    return res.status(200).json(address);
  });

  updateAddress = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id không hợp lệ" });
    }
    const address = await AddressService.getAddressById(id);
    if (!address) {
      return res.status(404).json({ message: "không tìm thấy" });
    }
    const updatedAddress = await AddressService.updateAddress(id, req.body);
    if (!updatedAddress) {
      return res.status(400).json({ message: "Không cập nhật được" });
    }
    return res.status(200).json(updatedAddress);
  });

  deleteAddress = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id không hợp lệ" });
    }
    const address = await AddressService.getAddressById(id);
    if (!address) {
      return res.status(404).json({ message: "không tìm thấy" });
    }
    const deletedAddress = await AddressService.deleteAddress(id);
    if (!deletedAddress) {
      return res.status(400).json({ message: "Lỗi xóa" });
    }
    return res.status(200).json({ message: "Đã xóa" });
  });
  getAddressesByUser = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const addressByUser = await AddressService.getAddressesByUser(id);
    return res.status(200).json(addressByUser);
  });
}

module.exports = new AddressController();
