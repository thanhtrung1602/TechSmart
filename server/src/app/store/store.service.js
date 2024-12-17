const db = require("../../models/index");
class StoreService {
  async findAll() {
    try {
      const findAll = await db.Store.findAll({
        order: [["createdAt", "DESC"]],
      });

      return findAll;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOne(id) {
    try {
      const findOne = await db.Store.findByPk(id);
      if (!findOne) {
        return { message: "not found store!" };
      }

      return findOne;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createStore({ province, district, ward, street, phone, codeStore }) {
    try {
      const store = await db.Store.create({
        province,
        district,
        ward,
        street,
        phone,
        codeStore,
      });

      return store;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateStore(
    id,
    { street, ward, district, province, phone, codeStore }
  ) {
    try {
      await this.findOne(id);
      const update = await db.Store.update(
        {
          street,
          ward,
          district,
          province,
          phone,
          codeStore,
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

  async delStore(id) {
    try {
      await this.findOne(id);
      const del = await db.Store.destroy({
        where: {
          id,
        },
      });

      return del;
    } catch (error) {
      throw new Error(error.message);
    }
  }
    async updateStoreByVisible(id) {
      try {
        // Tìm đối tượng theo ID
        const checkStore = await db.Store.findOne({
          where: {
            id,
          },
        });
  
        // Kiểm tra nếu đối tượng không tồn tại
        if (!checkStore) {
          return { error: "Đối tượng không tồn tại" };
        }
  
        const store = checkStore.dataValues;
  
        if (store.visible === false) {
          const updateStore = await db.Store.update(
            { visible: true },
            {
              where: {
                id,
              },
            }
          );
  
          if (updateStore[0] > 0) {
            return { message: "Update visible thành công" };
          } else {
            return { error: "Update visible thất bại" };
          }
        } else if (store.visible === true) {
          const updateStore = await db.Store.update(
            { visible: false },
            {
              where: {
                id,
              },
            }
          );
          if (updateStore[0] > 0) {
            return { message: "Update visible thành công" };
          } else {
            return { error: "Update visible thất bại" };
          }
        }
      } catch (error) {
        throw new Error(error.message);
      }
    }
  
}

module.exports = new StoreService();
