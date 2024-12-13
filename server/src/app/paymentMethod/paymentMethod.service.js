const { where } = require("sequelize");
const db = require("../../models/index");

class PaymentMethodService {
  async createPaymentMethod({ type }) {
    try {
      const paymentMethod = await db.PaymentMethod.create({
        type,
      });
      return paymentMethod;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAllPaymentMethod() {
    try {
      const paymentMethods = await db.PaymentMethod.findAll();
      return paymentMethods;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOnePaymentMethodById(id) {
    try {
      const paymentMethod = await db.PaymentMethod.findOne({
        where: { id: id },
      });
      return paymentMethod;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updatePaymentMethod(id, { type }) {
    try {
      const updatedAddress = await db.PaymentMethod.update(
        {
          type,
        },
        {
          where: {
            id,
          },
        }
      );
      return updatedAddress;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deletePaymentMethod(id) {
    try {
      const paymentMethod = await db.PaymentMethod.findByPk(id);
      if (!paymentMethod) {
        return null;
      }
      await paymentMethod.destroy();
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAllPaymentMethodById(id) {
    try {
      const paymentMethod = await db.PaymentMethod.findAll({
        where: {
          id: id,
        },
      });
      return paymentMethod;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new PaymentMethodService();
