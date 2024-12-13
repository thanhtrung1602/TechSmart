const { Op } = require("sequelize");
const { deleteUserFromElasticsearch } = require("../../helpers/handleElastic");
const db = require("../../models/index");
class UserService {
  //Get all users

  async getUser() {
    try {
      const getUser = await db.User.findAll({
        order: [["createdAt", "ASC"]],
      });
      return getUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Get one user by id

  async getOneUserById(id) {
    try {
      const getOneUserById = await db.User.findOne({
        where: {
          id,
        },
        attributes: ["id", "fullname", "phone", "email", "bom", "ban"],
      });

      if (!getOneUserById) {
        return { error: `không có user nào có id la ${id}` };
      }

      return getOneUserById;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Update user

  async updateUser({ phone, fullname, email, bom, ban }, id) {
    try {
      await this.getOneUserById(id);

      const user = await db.User.findOne({
        where: {
          [Op.or]: [{ email }, { phone }],
          id: { [Op.ne]: id },
        },
      });

      if (user) {
        const errors = {};
        if (user.email === email) {
          errors.email = "Email đã tồn tại";
        }
        if (user.phone === phone) {
          errors.phone = "Số điện thoại đã tồn tại";
        }
        return { status: 400, errors };
      }

      const updatedUsers = await db.User.update(
        {
          phone,
          fullname,
          email,
          ban,
          bom,
        },
        {
          where: {
            id: id,
          },
          returning: true,
          attributes: [
            "id",
            "fullname",
            "phone",
            "email",
            "role",
            "bom",
            "ban",
            "createdAt",
            "updatedAt",
          ],
        }
      );

      return updatedUsers[1][0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Update bom user

  async updateBomUser(id) {
    try {
      const checkUser = await db.User.findOne({
        where: {
          id,
        },
      });

      if (!checkUser) {
        return { error: "User không tồn tại" };
      }

      const userBom = checkUser.dataValues.bom;

      const updateBomUser = await db.User.update(
        { bom: userBom + 1 },
        {
          where: {
            id,
          },
          attributes: [
            "id",
            "fullname",
            "phone",
            "email",
            "role",
            "createdAt",
            "updatedAt",
          ],
        }
      );

      if (updateBomUser[0] > 0) {
        const updatedUser = await db.User.findOne({
          where: { id },
        });

        if (updatedUser.dataValues.bom === 3) {
          await this.updateBanUser(id);
        }
        return { message: "Update trạng thái bom thành công" };
      } else {
        return { error: "Update trạng thái bom thất bại" };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Update ban user

  async updateBanUser(id) {
    try {
      const checkUser = await db.User.findOne({
        where: {
          id,
        },
      });

      if (!checkUser) {
        return { error: "User không tồn tại" };
      }

      const user = checkUser.dataValues;

      if (user.bom === 3) {
        const updateBanUser = await db.User.update(
          { ban: true },
          {
            where: {
              id,
            },
            attributes: [
              "id",
              "fullname",
              "phone",
              "email",
              "role",
              "bom",
              "ban",
              "createdAt",
              "updatedAt",
            ],
          }
        );

        if (updateBanUser[0] > 0) {
          return { message: "Update ban thành công" };
        } else {
          return { error: "Update ban thất bại" };
        }
      } else {
        return { error: "User chưa đạt mức bom 3 để ban" };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // ban user
  async BanUser(id) {
    try {
      const checkUser = await db.User.findOne({
        where: {
          id,
        },
      });

      if (!checkUser) {
        return { error: "User không tồn tại" };
      }

      const user = checkUser.dataValues;

      if (user.ban === false) {
        const updateBanUser = await db.User.update(
          { ban: true },
          {
            where: {
              id,
            },
            attributes: [
              "id",
              "fullname",
              "phone",
              "email",
              "role",
              "bom",
              "ban",
              "createdAt",
              "updatedAt",
            ],
          }
        );

        if (updateBanUser[0] > 0) {
          return { message: "Update ban thành công" };
        } else {
          return { error: "Update ban thất bị" };
        }
      }

      if (user.ban === true) {
        const updateBanUser = await db.User.update(
          { ban: false },
          {
            where: {
              id,
            },
          }
        );
        if (updateBanUser[0] > 0) {
          return { message: "Update ban thành công" };
        } else {
          return { error: "Update ban thất bị" };
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  //Delete user

  async delUser(id) {
    try {
      const checkUser = await db.User.findOne({
        where: {
          id,
        },
      });

      if (!checkUser) {
        return { error: "User không tồn tại" };
      }

      await deleteUserFromElasticsearch(id);

      const delUser = await db.User.destroy({
        where: {
          id: checkUser.dataValues.id,
        },
      });

      if (delUser) {
        return { message: "delete user successfully!" };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getTotalUsers() {
    try {
      const getTotalUsers = await db.User.count();
      return getTotalUsers;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllUserRole(role) {
    try {
      const getAllUserRole = await db.User.findAll({
        where: {
          role: role,
          attributes: [
            "id",
            "fullname",
            "phone",
            "email",
            "role",
            "bom",
            "ban",
            "createdAt",
            "updatedAt",
          ],
        },
      });
      return getAllUserRole;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new UserService();
