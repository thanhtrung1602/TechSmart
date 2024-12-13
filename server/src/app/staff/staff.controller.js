const asyncWrapper = require("../../middleware/async");
const staffService = require("./staff.service"); 

class StaffController {
  // Lấy danh sách tất cả nhân viên
  findAll = asyncWrapper(async (req, res) => {
    const findAll = await staffService.findAll();
    return res.status(200).json(findAll);
  });

  // Lấy thông tin chi tiết một nhân viên theo ID
  findOne = asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const findOne = await staffService.findOne(id);
    if (!findOne) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên này" });
    }
    return res.status(200).json(findOne);
  });

  // Tạo mới nhân viên
  createStaff = asyncWrapper(async (req, res) => {
    const { fullName, date_of_birth, gender, phone, email, position, hire_date, salary } = req.body;

    if (!fullName || !date_of_birth || !gender || !phone || !email || !position || !hire_date || !salary) {
      return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
    }

    const create = await staffService.createStaff(req.body);

    if (!create) {
      return res.status(400).json({ message: "Không thể tạo nhân viên" });
    }

    return res.status(201).json({ message: "Tạo nhân viên thành công", data: create });
  });

  // Cập nhật thông tin nhân viên
  updateStaff = asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const update = await staffService.updateStaff(id, req.body);

    if (!update) {
      return res.status(400).json({ message: "Không thể cập nhật thông tin nhân viên" });
    }

    return res.status(200).json({ message: "Cập nhật thành công", data: update });
  });

  // Xóa nhân viên
  delStaff = asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const delStaff = await staffService.delStaff(id);

    if (!delStaff) {
      return res.status(400).json({ message: "Không thể xóa nhân viên" });
    }

    return res.status(200).json({ message: "Xóa nhân viên thành công", data: delStaff });
  });

  getAllStaffWithFilter = asyncWrapper(async (req, res) => {
    // Lấy các tham số từ query string
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const genderFilter = req.query.gender || '';
    const positionFilter = req.query.position || '';

    // Xác định giới hạn và offset cho phân trang
    const limit = size;
    const offset = (page - 1) * size;

    // Tạo điều kiện lọc cho Sequelize
    const filterConditions = {};

    if (genderFilter) {
      filterConditions.gender = genderFilter;
    }

    if (positionFilter) {
      filterConditions.position = positionFilter;
    }

    const { count, rows } = await staffService.getAllStaffWithFilter({
      limit,
      offset,
      filterConditions
    });

    return res.status(200).json({
      total: count,
      rows,
    });
  });
}

module.exports = new StaffController();
