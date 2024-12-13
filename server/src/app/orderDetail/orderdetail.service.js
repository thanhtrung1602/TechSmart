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
      // Bước 1: Lấy tất cả OrderDetail
      const orderDetails = await db.OrderDetail.findAll();

      if (!orderDetails.length) {
        return { error: "Không tìm thấy OrderDetails" };
      }

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

      const productIds = [
        ...new Set(orderDetails.map((detail) => detail.productId)),
      ];
      const products = await db.Product.findAll({
        where: {
          id: productIds,
        },
      });
      const orderIds = [
        ...new Set(orderDetails.map((detail) => detail.orderId)),
      ];
      const orders = await db.Order.findAll({
        where: {
          id: orderIds,
        },
      });

      const result = orderDetails.map((detail) => ({
        ...detail.toJSON(),
        productData:
          products
            .find((product) => product.id === detail.productId)
            ?.toJSON() || null,
        orderData:
          orders.find((order) => order.id === detail.orderId)?.toJSON() || null,
      }));

      return result;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async getAllOrderDetailByOrderId(orderId) {
    try {
      const orderDetails = await db.OrderDetail.findAll({
        where: { orderId },
      });

      if (!orderDetails.length) {
        return { error: "Không tìm thấy OrderDetail nào" };
      }

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
          },
        ],
      });

      const productIds = [
        ...new Set(orderDetails.map((detail) => detail.productId)),
      ];
      const products = await db.Product.findAll({
        where: { id: productIds },
      });

      const order = await db.Order.findOne({
        where: { id: orderId },
      });

      if (!order) {
        return { error: "Không tìm thấy Order" };
      }

      const user = await db.User.findOne({
        where: { id: order.userId },
      });

      const address = await db.Addresses.findOne({
        where: { id: order.addressId },
        attributes: ["street", "ward", "district", "province"],
      });

      const store = await db.Store.findOne({
        where: { id: order.storeId },
      });

      const statusOrder = await db.StatusOrder.findOne({
        where: { id: order.statusId },
      });

      const paymentMethod = await db.PaymentMethod.findOne({
        where: { id: order.paymentMethodId },
      });

      const result = orderDetails.map((detail) => ({
        ...detail.toJSON(),
        productData:
          products
            .find((product) => product.id === detail.productId)
            ?.toJSON() || null,
        orderData: {
          ...order.toJSON(),
          userData: user ? user.toJSON() : null,
          addressData: address ? address.toJSON() : null,
          statusData: statusOrder ? statusOrder.toJSON() : null,
          paymentMethods: paymentMethod.toJSON() || null,
          storeData: store ? store.toJSON() : null,
        },
      }));

      return result;
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
