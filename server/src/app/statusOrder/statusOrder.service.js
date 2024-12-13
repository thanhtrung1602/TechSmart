const { where } = require("sequelize");
const db = require("../../models/index");

class StatusOrderService {
  async createStatusOrder({ status }) {
    try {
      const statusOrder = await db.StatusOrder.create({
        status,
      });
      return statusOrder;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAllStatusOrder() {
    try {
      const status = await db.StatusOrder.findAll({
        order: [["id", "ASC"]]

      });
      return status;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOneStatusOrder(id) {
    try {
      const status = await db.StatusOrder.findOne({ where: { id } });
      if (!status) {
        return "not found status";
      }
      return status;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateStatusOrder(id, { status }) {
    try {
      await this.findOneStatusOrder(id);
      const updatedStatus = await db.StatusOrder.update(
        {
          status,
        },
        {
          where: {
            id,
          },
        }
      );
      return updatedStatus;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteStatusOrder(id) {
    try {
      await this.findOneStatusOrder(id);
      const statusOrder = await db.StatusOrder.findByPk(id);
      if (!statusOrder) {
        return null;
      }
      await statusOrder.destroy();
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAllStatusOrderById(id) {
    try {
      const findAllStatus = await db.StatusOrder.findAll({
        where: {
          id: id,
        },
      });
      return findAllStatus;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new StatusOrderService();
