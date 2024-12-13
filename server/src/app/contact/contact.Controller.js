const asyncWrapper = require("../../middleware/async");
const contactService = require("./contact.service");

class ContactController {
  createConTact = asyncWrapper(async (req, res) => {
    const { fullName, email, phone, text } = req.body;
    if (!fullName || !email || !phone || !text) {
      return res.status(400).json("Thiếu giá trị");
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ" });
    }

    // Kiểm tra định dạng số điện thoại
    const phoneRegex = /^[0-9]{9,10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Số điện thoại không hợp lệ" });
    }

    const contact = await contactService.createConTact(req.body);
    if (!contact) {
      return res.status(400).json({ message: "Không có sản phẩm" });
    }
    return res.status(200).json(contact);
  });

  searchContact = asyncWrapper(async (req, res) => {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query không hợp lệ" });
    }

    const contacts = await contactService.searchContact({ query });

    if (!contacts || contacts?.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy liên hệ nào" });
    }

    return res.status(200).json(contacts);
  });
  getAllContacts = asyncWrapper(async (req, res) => {
    const contacts = await contactService.getAllContacts();
    return res.status(200).json(contacts);
  });
  getContactById = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id không hợp lệ" });
    }
    const contact = await contactService.getContactById(id);
    if (!contact) {
      return res.status(404).json({ message: "không tìm thấy" });
    }
    return res.status(200).json(contact);
  });

  updateContact = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const { fullName, email, phone, text } = req.body;
    if (isNaN(id)) {
      return res.status(400).json({ message: "id không hợp lệ" });
    }
    const contact = await contactService.getContactById(id);
    if (!contact) {
      return res.status(404).json({ message: "không tìm thấy" });
    }
    const updatedContact = await contactService.updateContact(id, req.body);
    if (!updatedContact) {
      return res.status(400).json({ message: "Không cập nhật được " });
    }
    return res.status(200).json(updatedContact);
  });

  deleteContact = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "id không hợp lệ" });
    }

    const contact = await contactService.getContactById(id);

    if (!contact) {
      return res.status(404).json({ message: "không tìm thấy" });
    }

    const deletedContact = await contactService.deleteContact(id);

    if (!deletedContact) {
      return res.status(400).json({ message: "Lỗi xóa" });
    }

    return res.status(200).json({ message: "Đã xóa" });
  });
}

module.exports = new ContactController();
