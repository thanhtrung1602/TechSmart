const db = require("../../models/index");
class StockService {
  async findAll() {
    try {
      const findAll = await db.Stock.findAll();
      return findAll;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findOne(id) {
    try {
      const findOne = await db.Stock.findByPk(id);
      if (!findOne) {
        return { message: "not found stock!" };
      }
      return findOne;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findOneByStore(id) {
    try {
      const findOneByStore = await db.Stock.findOne({
        where: {
          id: id,
        },
      });
      if (!findOneByStore) {
        return { message: "not found codeStore!" };
      }
      return findOneByStore;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findAllByProductId(id) {
    try {
      const findAll = await db.Stock.findAll({
        where: {
          productId: id,
        },
        include: [
          {
            model: db.Product,
            as: "productData",
          },
          {
            model: db.Store,
            as: "storeData",
          },
        ],
      });

      return findAll;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async createStock({ storeId, productId, stockProduct }) {
    try {
      const create = await db.Stock.create({
        storeId,
        productId,
        stockProduct,
      });
      return create;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateStock(id, { storeId, productId, stockProduct }) {
    try {
      await this.findOne(id);
      const update = await db.Stock.update(
        {
          storeId,
          productId,
          stockProduct,
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
  async delStock(id) {
    try {
      await this.findOne(id);
      const del = await db.Stock.destroy({
        where: {
          id,
        },
      });
      return del;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new StockService();
