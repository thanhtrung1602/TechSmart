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
        include: [
          {
            model: db.StatusOrder,
            as: "statusData",
          },
          {
            model: db.PaymentMethod,
            as: "paymentMethodData",
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
            model: db.User,
            as: "userData",
          }, {
            model: db.StatusPayment,
            as: "statusPayData",
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });

      return { count, rows };
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
        include: [
          {
            model: db.StatusOrder,
            as: "statusData",
          },
          {
            model: db.PaymentMethod,
            as: "paymentMethodData",
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
            model: db.User,
            as: "userData",
          },
          {
            model: db.StatusPayment,
            as: "statusPayData",
          }
        ],
        order: [["createdAt", "DESC"]], // Sắp xếp theo ngày tạo
        limit: limit,
        offset: offset,
      });

      return { count, rows };
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

  async getAllOrder(limit, offSet) {
    try {
      const allOrders = await db.Order.findAndCountAll({
        include: [
          {
            model: db.StatusOrder,
            as: "statusData",
          },
          {
            model: db.PaymentMethod,
            as: "paymentMethodData",
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
            model: db.User,
            as: "userData",
          },
          {
            model: db.StatusPayment,
            as: "statusPayData",
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: limit,
        offset: offSet,
      });

      return allOrders;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async FindAllOrder() {
    try {
      const allOrders = await db.Order.findAll({
        include: [
          {
            model: db.StatusOrder,
            as: "statusData",
          },
          {
            model: db.PaymentMethod,
            as: "paymentMethodData",
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
            model: db.User,
            as: "userData",
          },
          {
            model: db.StatusPayment,
            as: "statusPayData",
          },
        ],
        order: [["createdAt", "ASC"]],
      });

      return allOrders;
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
        include: [
          {
            model: db.StatusOrder,
            as: "statusData",
          },
          {
            model: db.PaymentMethod,
            as: "paymentMethodData",
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
            model: db.User,
            as: "userData",
          },
          {
            model: db.StatusPayment,
            as: "statusPayData",
          },
        ],
      });

      return order;
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
        include: [
          {
            model: db.StatusOrder,
            as: "statusData",
          },
          {
            model: db.PaymentMethod,
            as: "paymentMethodData",
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
            model: db.User,
            as: "userData",
          },
          {
            model: db.StatusPayment,
            as: "statusPayData",
          },
        ],
        offset: offSet,
        limit,
      });

      return { count, rows };
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
        include: [
          {
            model: db.StatusOrder,
            as: "statusData",
          },
          {
            model: db.PaymentMethod,
            as: "paymentMethodData",
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
            model: db.User,
            as: "userData",
          },
          {
            model: db.StatusPayment,
            as: "statusPayData",
          },
        ],
      });

      return getOrderByIdUser;
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
