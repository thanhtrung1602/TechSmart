const db = require("../../models/index");

class StaffService {
  // Lấy danh sách tất cả nhân viên, sắp xếp theo thời gian tạo (mới nhất trước)
  async findAll() {
    try {
      const findAll = await db.Staff.findAll({
        order: [["createdAt", "DESC"]],
      });
      return findAll;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Lấy thông tin chi tiết một nhân viên theo ID
  async findOne(id) {
    try {
      const findOne = await db.Staff.findByPk(id);
      if (!findOne) {
        return { message: "Không tìm thấy nhân viên!" };
      }
      return findOne;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Tạo nhân viên mới
  async createStaff({
    fullName,
    date_of_birth,
    gender,
    phone,
    email,
    position,
    hire_date,
    salary,
  }) {
    try {
      const staff = await db.Staff.create({
        fullName,
        date_of_birth,
        gender,
        phone,
        email,
        position,
        hire_date,  
        salary,
      });
      return staff;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Cập nhật thông tin nhân viên
  async updateStaff(
    id,
    { fullName, date_of_birth, gender, phone, email, position, hire_date, salary }
  ) {
    try {
      const staff = await this.findOne(id); // Kiểm tra xem nhân viên có tồn tại không
      if (!staff || staff.message) {
        return { message: "Không tìm thấy nhân viên!" };
      }
      const update = await db.Staff.update(
        {
          fullName,
          date_of_birth,
          gender,
          phone,
          email,
          position,
          hire_date,
          salary,
        },
        {
          where: {
            id,
          },
        }
      );
      return update;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Xóa nhân viên
  async delStaff(id) {
    try {
      const staff = await this.findOne(id); // Kiểm tra xem nhân viên có tồn tại không
      if (!staff || staff.message) {
        return { message: "Không tìm thấy nhân viên!" };
      }
      const del = await db.Staff.destroy({
        where: {
          id,
        },
      });
      return del;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getAllStaffWithFilter({ limit, offset, filterConditions }) {
    try {
      // Lấy danh sách nhân viên với điều kiện lọc và phân trang
      const { count, rows } = await db.Staff.findAndCountAll({
        where: filterConditions, // Điều kiện lọc
        order: [["createdAt", "DESC"]], // Sắp xếp theo ngày tạo
        limit, // Giới hạn số lượng
        offset, // Bắt đầu từ
      });

      // Trả về kết quả
      return { count, rows };
    } catch (error) {
      throw new Error(error.message);
    }
  }

}

module.exports = new StaffService();
