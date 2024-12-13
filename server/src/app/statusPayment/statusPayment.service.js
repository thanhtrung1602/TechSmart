const { where } = require("sequelize");
const db = require("../../models/index");

class StatusPaymentService {
  async createStatusPayment({ status }) {
    try {
      const statusPayment = await db.StatusPayment.create({
        status,
      });
      return statusPayment;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAllStatusPayment() {
    try {
      const status = await db.StatusPayment.findAll({
        order: [["id", "ASC"]],
      });
      return status;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOneStatusPayment(id) {
    try {
      const status = await db.StatusPayment.findOne({ where: { id } });
      if (!status) {
        return "not found status";
      }
      return status;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateStatusPayment(id, { status }) {
    try {
      await this.findOneStatusPayment(id);
      const updatedStatus = await db.StatusPayment.update(
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

  async deleteStatusPayment(id) {
    try {
      await this.findOneStatusPayment(id);
      const statusPayment = await db.StatusPayment.findByPk(id);
      if (!statusPayment) {
        return null;
      }
      await statusPayment.destroy();
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAllStatusPaymentById(id) {
    try {
      const findAllStatus = await db.StatusPayment.findAll({
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

module.exports = new StatusPaymentService();
