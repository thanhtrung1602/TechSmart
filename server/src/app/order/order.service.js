const { and } = require("sequelize");
const { Op } = require("sequelize");
const { deleteOrderFromElasticsearch } = require("../../helpers/handleElastic");
const db = require("../../models/index");
const paymentMethodService = require("../paymentMethod/paymentMethod.service");
const addressService = require("../address/address.service");
const storeService = require("../store/store.service");
const statusOrderService = require("../statusOrder/statusOrder.service");
const statusPaymentService = require("../statusPayment/statusPayment.service");
const userService = require("../user/user.service");
const orderdetailService = require("../orderDetail/orderdetail.service");
const ejs = require("ejs");
const path = require("path");
const { transporter } = require("../../utils/nodemailer");
nodemailer = require("nodemailer");

class OrderService {
  // Thêm vào OrderService
  async getAllOrderWithFilter({ limit, offset, filterConditions, searchTerm }) {
    try {
      const whereConditions = { ...filterConditions };

      // Nếu có searchTerm, tìm kiếm userId từ bảng User
      let userIds = [];
      if (searchTerm) {
        const users = await db.User.findAll({
          attributes: ["id"], // Chỉ lấy cột id
          where: {
            fullname: {
              [Op.iLike]: `%${searchTerm}%`, // Tìm kiếm fullname chứa searchTerm
            },
          },
        });

        // Lấy danh sách userId từ kết quả
        userIds = users.map((user) => user.id);

        // Thêm điều kiện lọc userId vào whereConditions
        if (userIds.length > 0) {
          whereConditions.userId = {
            [Op.in]: userIds, // Chỉ lấy đơn hàng có userId trong danh sách
          };
        } else {
          // Nếu không tìm thấy user nào, trả về kết quả rỗng
          return { count: 0, rows: [] };
        }
      }

      // Lấy danh sách đơn hàng
      const { count, rows } = await db.Order.findAndCountAll({
        where: whereConditions,
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });

      console.log("rows", rows);

      // Thu thập các ID cần thiết từ Order
      const orderIds = [...new Set(rows.map((order) => order.storeId))];
      const orderStatusId = [...new Set(rows.map((order) => order.statusId))];
      const addressId = [...new Set(rows.map((order) => order.addressId))];
      const paymentMethodId = [
        ...new Set(rows.map((order) => order.paymentMethodId)),
      ];
      const userId = [...new Set(rows.map((order) => order.userId))];

      const statusData = await db.StatusOrder.findAll({
        where: { id: orderStatusId },
      });
      const paymentMethods = await db.PaymentMethod.findAll({
        where: { id: paymentMethodId },
      });
      const addresses = await db.Addresses.findAll({
        where: { id: addressId },
      });
      const stores = await db.Store.findAll({ where: { id: orderIds } });
      const users = await db.User.findAll({ where: { id: userId } });

      // Kết hợp dữ liệu lại
      const result = rows.map((order) => ({
        ...order.toJSON(),
        statusData: statusData.find((s) => s.id === order.statusId),
        paymentMethods: paymentMethods.find(
          (p) => p.id === order.paymentMethodId
        ),
        addressData: addresses.find((a) => a.id === order.addressId),
        storeData: stores.find((s) => s.id === order.storeId),
        userData: users.find((u) => u.id === order.userId),
      }));

      return { count, rows: result };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProcessingOrder({ limit, offset, filterConditions, searchTerm }) {
    try {
      const whereConditions = { ...filterConditions, statusId: [1, 2] };

      if (searchTerm) {
        whereConditions.delivery_method = {
          [Op.like]: `%${searchTerm}%`,
        };
      }

      // Lấy danh sách đơn hàng mà không bao gồm các bảng liên quan
      const { count, rows } = await db.Order.findAndCountAll({
        where: whereConditions, // Thêm điều kiện lọc vào
        order: [["createdAt", "DESC"]], // Sắp xếp theo ngày tạo
        limit: limit,
        offset: offset,
      });

      const orderIds = [...new Set(rows.map((order) => order.storeId))];
      const orderStatusId = [...new Set(rows.map((order) => order.statusId))];
      const addressId = [...new Set(rows.map((order) => order.addressId))];
      const paymentMethodId = [
        ...new Set(rows.map((order) => order.paymentMethodId)),
      ];
      const userId = [...new Set(rows.map((order) => order.userId))];

      const statusData = await db.StatusOrder.findAll({
        where: { id: orderStatusId },
      });
      const paymentMethods = await db.PaymentMethod.findAll({
        where: { id: paymentMethodId },
      });
      const addresses = await db.Addresses.findAll({
        where: { id: addressId },
      });
      const stores = await db.Store.findAll({ where: { id: orderIds } });
      const users = await db.User.findAll({ where: { id: userId } });

      // Kết hợp dữ liệu lại
      const result = rows.map((order) => ({
        ...order.toJSON(),
        statusData: statusData.find((s) => s.id === order.statusId),
        paymentMethods: paymentMethods.find(
          (p) => p.id === order.paymentMethodId
        ),
        addressData: addresses.find((a) => a.id === order.addressId),
        storeData: stores.find((s) => s.id === order.storeId),
        userData: users.find((u) => u.id === order.userId),
      }));

      return { count, rows: result };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async generateOrderCode() {
    const lastOrder = await db.Order.findOne({
      order: [["order_code", "DESC"]],
    });

    if (!lastOrder) {
      return "#000000001";
    }

    const numericPart = parseInt(lastOrder.order_code.substring(1), 10);
    const newNumericPart = numericPart + 1;

    return "#" + newNumericPart.toString().padStart(9, "0");
  }

  async sendOrderConfirmationEmail(order) {
    try {
      const user = await db.User.findByPk(order.userId);
      const orderDetail = await orderdetailService.getAllOrderDetailByOrderId(
        order.id
      );
      const products = orderDetail.map((detail) => ({
        product: detail.productData.name,
        quantity: detail.quantity,
        price: detail.productData.price,
        image: detail.productData.img,
      }));
      console.log("email xác nhận ", user.dataValues);
      // Render the email HTML with order details
      const emailHTML = await ejs.renderFile(
        path.resolve(__dirname, "../../view/orderConfirmationTemplate.ejs"),
        {
          fullname: user.dataValues.fullname,
          phone: order.phone,
          orderCode: order.order_code,
          total: order.total,
          deliveryDate: order.deliveryDate,
          status: order.statusData.status,
          delivery_method: order.delivery_method,
          address_street: order.addressData.street,
          address_ward: order.addressData.ward,
          address_province: order.addressData.province.name,
          address_district: order.addressData.district.name,
          paymentMethod: order.paymentMethods.type,
          products,
        }
      );
      // Set up the mail options
      const mailOptions = {
        to: `${user.dataValues.email}`,
        subject: "Xác nhận đơn hàng",
        html: emailHTML,
      };

      // Send the email using the transporter
      await transporter.sendMail(mailOptions);
      console.log("Order confirmation email sent successfully!");
    } catch (error) {
      console.error("Error sending confirmation email:", error);
    }
  }

  async getAllOrder(limit, offSet, startDate, endDate) {
    try {
      const allOrders = await db.Order.findAll({
        order: [["createdAt", "DESC"]],
      });

      const allOrders = await db.Order.findAndCountAll({
        include: [
          {
            model: db.StatusOrder,
            as: "statusData",
          },
          {
            model: db.PaymentMethod,
            as: "paymentMethods",
          },
        ],
        limit: limit,
        offset: offSet,
      });

      const statusOrderId = [...new Set(allOrders.map((o) => o.statusId))];
      const paymentMethodId = [
        ...new Set(allOrders.map((o) => o.paymentMethodId)),
      ];
      const addressId = [...new Set(allOrders.map((o) => o.addressId))];
      const storeId = [...new Set(allOrders.map((o) => o.storeId))];

      const [status, payment, address, store] = await Promise.all([
        db.StatusOrder.findAll({ where: { id: statusOrderId } }),
        db.PaymentMethod.findAll({ where: { id: paymentMethodId } }),
        db.Addresses.findAll({ where: { id: addressId } }),
        db.Store.findAll({ where: { id: storeId } }),
      ]);

      const paginationOrder = allOrders.slice(offSet, offSet + limit);

      const result = {
        count: allOrders.length,
        rows: paginationOrder.map((order) => ({
          ...order.toJSON(),
          statusData: status.find((s) => s.id === order.statusId),
          paymentMethods: payment.find((p) => p.id === order.paymentMethodId),
          addressData: address.find((a) => a.id === order.addressId),
          storeData: store.find((s) => s.id === order.storeId),
        })),
      };

      if (!result) {
        return { error: "Not found" };
      }

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async FindAllOrder() {
    try {
      const allOrders = await db.Order.findAll({
        order: [["createdAt", "ASC"]],
      });

      const statusOrderId = [...new Set(allOrders.map((o) => o.statusId))];
      const paymentMethodId = [
        ...new Set(allOrders.map((o) => o.paymentMethodId)),
      ];
      const addressId = [...new Set(allOrders.map((o) => o.addressId))];
      const storeId = [...new Set(allOrders.map((o) => o.storeId))];
      const userId = [...new Set(allOrders.map((o) => o.userId))];

      const [status, payment, address, store, user] = await Promise.all([
        db.StatusOrder.findAll({ where: { id: statusOrderId } }),
        db.PaymentMethod.findAll({ where: { id: paymentMethodId } }),
        db.Addresses.findAll({ where: { id: addressId } }),
        db.Store.findAll({ where: { id: storeId } }),
        db.User.findAll({ where: { id: userId } }),
      ]);

      const result = allOrders.map((order) => ({
        ...order.toJSON(),
        statusData: status.find((s) => s.id === order.statusId),
        paymentMethods: payment.find((p) => p.id === order.paymentMethodId),
        addressData: address.find((a) => a.id === order.addressId),
        storeData: store.find((s) => s.id === order.storeId),
        userData: user.find((u) => u.id === order.userId),
      }));

      if (!result) {
        return { error: "Not found" };
      }

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getOrderById(id) {
    try {
      const order = await db.Order.findOne({
        where: {
          id,
        },
      });

      const order = await db.Order.findOne({
        where: {
          id,
        },
        include: [
          {
            model: db.StatusOrder,
            as: "statusData",
          },
          {
            model: db.PaymentMethod,
            as: "paymentMethods",
          },
        ],
      });

      const paymentMethod = await paymentMethodService.findOnePaymentMethodById(
        order.paymentMethodId
      );
      const address = await addressService.getAddressById(order.addressId);
      const store = await storeService.findOne(order.storeId);
      const user = await userService.getOneUserById(order.userId);
      const statusOrder = await statusOrderService.findOneStatusOrder(
        order.statusId
      );
      const statusPay = await statusPaymentService.findOneStatusPayment(
        order.statusPayId
      );

      const result = {
        ...order.toJSON(),
        paymentMethods: paymentMethod ? paymentMethod.toJSON() : null,
        addressData: address ? address.toJSON() : null,
        storeData:
          store && typeof store.toJSON === "function" ? store.toJSON() : null,
        statusData: statusOrder ? statusOrder.toJSON() : null,
        statusPayData: statusPay ? statusPay.toJSON() : null,
        userData: user ? user.toJSON() : null,
      };

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getOrderUserById(id, limit, offSet) {
    try {
      const { count, rows } = await db.Order.findAndCountAll({
        order: [["createdAt", "DESC"]],
        where: {
          userId: id,
        },
        offset: offSet,
        limit,
      });

      const orders = await db.Order.findAll({
        where: {
          userId,
        },
        include: [
          {
            model: db.StatusOrder,
            as: "statusData",
          },
          {
            model: db.PaymentMethod,
            as: "paymentMethods",
          },
        ],
      });

      const statusOrderId = [...new Set(rows.map((o) => o.statusId))];
      const paymentMethodId = [...new Set(rows.map((o) => o.paymentMethodId))];
      const addressId = [...new Set(rows.map((o) => o.addressId))];
      const storeId = [...new Set(rows.map((o) => o.storeId))];

      const userData = await db.User.findOne({
        where: {
          id: id,
        },
      });

      const [status, payment, address, store] = await Promise.all([
        db.StatusOrder.findAll({ where: { id: statusOrderId } }),
        db.PaymentMethod.findAll({ where: { id: paymentMethodId } }),
        db.Addresses.findAll({ where: { id: addressId } }),
        db.Store.findAll({ where: { id: storeId } }),
      ]);

      // Correcting the variable name from `orders` to `rows`
      const result = rows.map((order) => ({
        ...order.toJSON(),
        statusData: status.find((s) => s.id === order.statusId),
        paymentMethods: payment.find((p) => p.id === order.paymentMethodId),
        addressData: address.find((a) => a.id === order.addressId),
        storeData: store.find((s) => s.id === order.storeId),
        userData: userData,
      }));

      if (!result) {
        return { error: "Not found" };
      }

      return { count, rows: result };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createOrder({
    userId,
    phone,
    total,
    statusId,
    statusPayId,
    addressId,
    paymentMethodId,
    storeId,
    delivery_method,
    deliveryDate,
  }) {
    try {
      const orderCode = await this.generateOrderCode();
      const order = await db.Order.create({
        phone,
        userId,
        addressId,
        statusPayId,
        total,
        paymentMethodId,
        statusId,
        order_code: orderCode,
        storeId,
        delivery_method,
        deliveryDate,
      });

      return order;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateOrder(
    id,
    {
      phone,
      total,
      statusId,
      createdAt,
      paymentMethodId,
      tracking_order,
      transactionCode,
      reason,
    }
  ) {
    try {
      const order = await db.Order.findOne({ where: { id } });

      if (!order) {
        return { error: "Order không tồn tại với id đã cho" };
      }

      // Thực hiện put
      const [updated] = await db.Order.update(
        {
          phone,
          total,
          statusId,
          createdAt,
          paymentMethodId,
          transactionCode,
          tracking_order,
          reason,
        },
        { where: { id } }
      );

      if (updated === 0) {
        return { error: "Không thể cập nhật order" };
      }

      return { message: "Order updated successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteOrder(id) {
    try {
      const order = await db.Order.findByPk(id);

      if (!order) {
        return { error: "Order không tồn tại" };
      }

      const deletedOrder = await db.Order.destroy({
        where: { id },
      });

      if (deletedOrder === 0) {
        return { error: "Không thể xóa order" };
      }

      return { message: "Order deleted successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateOrderStatus(id, statusId) {
    try {
      const order = await db.Order.findByPk(id);
      if (!order) {
        return null;
      }

      const updateOrderStatus = await db.Order.update(
        { statusId },
        {
          where: {
            id,
          },
        }
      );

      if (updateOrderStatus) {
        return updateOrderStatus;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateOrderStatusPay(id, statusPayId, transactionCode, reason) {
    try {
      const order = await db.Order.findByPk(id);
      if (!order) {
        return null;
      }

      const updateOrderStatus = await db.Order.update(
        { statusPayId, transactionCode, reason },
        {
          where: {
            id,
          },
        }
      );

      if (updateOrderStatus) {
        return { message: "update trạng thái thành công" };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getOrderByStatus(id) {
    try {
      const getOrderByIdUser = await db.Order.findAll({
        order: [["createdAt", "ASC"]],
        where: {
          statusId: id,
        },
      });

      const getOrderByIdUser = await db.Order.findAll({
        where: {
          userId: id,
          statusId: id,
        },
        include: [
          {
            model: db.StatusOrder,
            as: "statusData",
          },
          {
            model: db.PaymentMethod,
            as: "paymentMethods",
          },
        ],
      });
      const statusOrderId = [
        ...new Set(getOrderByIdUser.map((o) => o.statusId)),
      ];
      const paymentMethodId = [
        ...new Set(getOrderByIdUser.map((o) => o.paymentMethodId)),
      ];

      const [status, payment] = await Promise.all([
        db.StatusOrder.findAll({ where: { id: statusOrderId } }),
        db.PaymentMethod.findAll({ where: { id: paymentMethodId } }),
      ]);

      const result = getOrderByIdUser.map((order) => ({
        ...order.toJSON(),
        statusData: status.find((s) => s.id === order.statusId),
        paymentMethods: payment.find((p) => p.id === order.paymentMethodId),
      }));

      if (!result) {
        return { error: "Not found" };
      }

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createOrderWithDetail({
    userId,
    phone,
    total,
    statusId,
    statusPayId,
    addressId,
    paymentMethodId,
    storeId,
    delivery_method,
    deliveryDate,
    orderDetails,
  }) {
    const t = await db.sequelize.transaction();
    try {
      const orderCode = await this.generateOrderCode();
      const order = await db.Order.create(
        {
          phone,
          userId,
          addressId,
          statusPayId,
          total,
          paymentMethodId,
          statusId,
          order_code: orderCode,
          storeId,
          delivery_method,
          deliveryDate,
        },
        {
          transaction: t,
        }
      );

      for (const detail of orderDetails) {
        const createOrder = await orderdetailService.createOrderDetail(
          { orderId: order.id, ...detail },
          t
        );
        if (!createOrder.success) {
          await t.rollback();
          return { success: false, message: createOrder.message };
        }
      }

      return order;
    } catch (error) {
      await t.rollback();
    }
  }
}

module.exports = new OrderService();
