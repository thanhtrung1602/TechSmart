const db = require("../../models/index");

class OrderDetailService {
  async createOrderDetail(
    { orderId, productId, quantity, color, size },
    total,
    t
  ) {
    try {
      const orderDetail = await db.OrderDetail.create(
        {
          orderId,
          productId,
          quantity,
          total,
          color,
          size,
        },
        { transaction: t }
      );

      if (orderDetail) {
        return { success: true, message: "Tạo đơn hàng thành công" };
      }
    } catch (error) {
      await t.rollback();
      throw new Error(error.message);
    }
  }

  async getAllOrderDetails() {
    try {
      const orderDetails = await db.OrderDetail.findAll({
        include: [
          {
            model: db.Product,
            as: "productData",
          },
          {
            model: db.Order,
            as: "orderData",
          },
        ],
      });

      return orderDetails;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async getAllOrderDetailByOrderId(orderId) {
    try {
      const orderDetails = await db.OrderDetail.findAll({
        where: { orderId },
        include: [
          {
            model: db.Product,
            as: "productData",
          },
          {
            model: db.Order,
            as: "orderData",
            include: [
              {
                model: db.User,
                as: "userData",
              },
              {
                model: db.Addresses,
                as: "addressData",
              },
              {
                model: db.Store,
                as: "storeData",
              },
              {
                model: db.StatusOrder,
                as: "statusData",
              },
              {
                model: db.PaymentMethod,
                as: "paymentMethodData",
              },
              {
                model: db.StatusPayment,
                as: "statusPayData",
              },
            ],
          },
        ],
      });

      return orderDetails;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteOrderDetail(orderDetailId) {
    try {
      const deletedCount = await db.OrderDetail.destroy({
        where: { id: orderDetailId },
      });
      return deletedCount;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new OrderDetailService();
