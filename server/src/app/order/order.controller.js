const orderService = require("./order.service");
const productService = require("../product/product.service");
const orderdetailService = require("../orderDetail/orderdetail.service");
const { Op } = require("sequelize");
const socket = require("../../module/socket");
const querystring = require("qs");
const crypto = require("crypto");
const { VNPay, ignoreLogger, consoleLogger } = require("vnpay");
require("dotenv").config();
const sortObject = require("../../utils/softObject");
const { payment } = require("../../utils/payment");
const asyncWrapper = require("../../middleware/async");
const { client } = require("../../db/init.elastic");
const { saveOrdersToElasticsearch } = require("../../helpers/handleElastic");
const {
  portOrderGHTK,
  getOrderGHTK,
  getPackageGHTK,
  cancelOrderGHTK,
} = require("../../utils/GHTK");
const cartService = require("../cart/cart.service");

if (!process.env.VNPAY_SECURE_SECRET || !process.env.VNPAY_TMN_CODE) {
  throw new Error("Missing VNPAY_SECURE_SECRET or VNPAY_TMN_CODE");
}

const vnpay = new VNPay({
  secureSecret: process.env.VNPAY_SECURE_SECRET,
  tmnCode: process.env.VNPAY_TMN_CODE,
  vnpayHost: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  testMode: true,
  hashAlgorithm: "SHA512",
  enableLog: true,
  loggerFn: ignoreLogger,
});

class OrderController {
  createPaymentUrl = asyncWrapper(async (req, res) => {
    const { id, bankSelect, contentPayment, total } = req.body;

    if (!id || !bankSelect || !contentPayment || !total) {
      return res.status(400).json("Invalid input: All fields are required");
    }

    const vnpUrl = payment(id, bankSelect, contentPayment, total);

    console.log("vnpUrl", vnpUrl);

    return res.status(200).json({ url: vnpUrl });
  });

  getBankList = asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const numberId = parseInt(id);
    const bankList = (await vnpay.getBankList())?.filter(
      (type) => type.bank_type === numberId
    );
    return res.status(200).json({
      showTitle: true,
      bankList,
    });
  });

  createOrder = asyncWrapper(async (req, res) => {
    const { total, ...rest } = req.body;

    // Làm tròn total để đảm bảo nó là số nguyên
    const roundedTotal = Math.round(total);

    const newOrder = await orderService.createOrder({
      ...rest,
      total: roundedTotal,
    });

    await saveOrdersToElasticsearch(newOrder);

    const io = socket.getIo();
    io.emit("newOrder", newOrder);

    return res.status(200).json({ newOrder });
  });

  vnpay_ipn = asyncWrapper(async (req, res) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", process.env.VNPAY_SECURE_SECRET);
    const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      res.status(200).json({ RspCode: "00", Message: "success" });
    } else {
      res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
    }
  });

  vnpay_return = asyncWrapper(async (req, res) => {
    let vnp_Params = req.query;

    let secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", process.env.VNPAY_SECURE_SECRET);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    // Tham số query
    const amount = vnp_Params["vnp_Amount"] / 100;
    const bankCode = vnp_Params["vnp_BankCode"];
    const orderId = vnp_Params["vnp_TxnRef"];
    const transactionCode = vnp_Params["vnp_TransactionNo"];

    const order = await orderService.getOrderById(orderId);

    if (secureHash === signed) {
      const responseCode = vnp_Params["vnp_ResponseCode"];
      if (responseCode === "00") {
        await orderService.updateOrderStatusPay(orderId, 2, transactionCode);
        const orderDetail = await orderdetailService.getAllOrderDetailByOrderId(
          orderId
        );
        const order = await orderService.getOrderById(orderId);
        orderService.sendOrderConfirmationEmail(order);
        if (orderDetail) {
          orderDetail.forEach(async (item) => {
            await productService.increaseHot(item.productId, item.quantity);
          });
        }
      }

      const orderCode = order ? order.order_code : null;
      const orderDate = order ? order.createdAt : null;
      const orderTrackingOrder = order ? order.tracking_order : null;

      const isProduction = process.env.NODE_ENV === "production";
      res.cookie(
        "order",
        JSON.stringify({
          total: amount,
          bankCode: bankCode,
          responseCode,
          order_code: orderCode,
          id: orderId,
          tracking_order: orderTrackingOrder,
          createdAt: orderDate,
          transactionCode,
        }),
        {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          maxAge: 24 * 60 * 60 * 1000,
        }
      );

      // Chuyển hướng đến trang hoàn tất đơn hàng
      res.redirect(process.env.URL_VNPAY_RETURN_SUCCESSFULLY);
    } else {
      res.redirect(process.env.URL_VNPAY_RETURN_FAILED);
    }
  });

  getOrderReturn = asyncWrapper(async (req, res) => {
    const order = req.cookies.order;
    if (order) {
      res.json(JSON.parse(order));
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  });

  getAllOrder = asyncWrapper(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    const limit = size;
    const offSet = (page - 1) * size;

    const { count, rows } = await orderService.getAllOrder(limit, offSet);
    return res.status(200).json({
      total: count,
      rows,
    });
  });

  FindAllOrder = asyncWrapper(async (req, res) => {
    const orders = await orderService.FindAllOrder();
    return res.status(200).json(orders);
  });

  getOrderById = asyncWrapper(async (req, res) => {
    const { id } = req.params;

    const order = await orderService.getOrderById(id);
    return res.status(200).json(order);
  });

  updateOrder = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const { statusId, reason, tracking_order } = req.body;

    if (statusId === 4) {
      await cancelOrderGHTK(tracking_order);
    }

    const result = await orderService.updateOrder(id, req.body);

    const orderDetail = await orderdetailService.getAllOrderDetailByOrderId(id);

    if (orderDetail) {
      orderDetail.forEach(async (item) => {
        await productService.updateStock(item.productId, -item.quantity);

        // Lấy thông tin sản phẩm sau khi cập nhật kho
        const product = await productService.getProductById(item.productId);

        // Nếu cần thông báo thay đổi kho qua WebSocket
        const io = socket.getIo();
        io.emit("stockUpdate", {
          productId: item.productId,
          newStock: product.stock,
        });
      });
    }

    return res.status(200).json(result);
  });

  deleteOrder = asyncWrapper(async (req, res) => {
    const { id } = req.params;

    const result = await orderService.deleteOrder(id);
    return res.status(200).json({ message: result.message });
  });

  updateOrderStatus = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const { orderDetails, userId, statusId, addressId } = req.body;

    if (!statusId || !id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedOrder = await orderService.updateOrderStatus(id, statusId);
    console.log(updatedOrder);
    if (statusId === 2 || statusId === 3) {
      try {
        orderService.sendOrderConfirmationEmail(updatedOrder);
        await portOrderGHTK(orderDetails, userId, id, addressId);
        return res.status(200).json({
          message: "Order successfully updated and GHTK order created.",
        });
      } catch (error) {
        console.error("Error creating GHTK order:", error);
        return res.status(500).json({ message: "Error creating GHTK order" });
      }
    }

    return res.status(200).json(updatedOrder);
  });

  searchOrder = asyncWrapper(async (req, res) => {
    const { q } = req.query;
    const order = await client.search({
      index: "orders",
      body: {
        query: {
          match: {
            order_code: q,
          },
        },
      },
    });

    return res.status(200).json(order.body.hits.hits);
  });

  getOrderByIdUser = asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    const limit = size;
    const offSet = (page - 1) * size;
    const getOrderByIdUser = await orderService.getOrderUserById(
      id,
      limit,
      offSet
    );
    return res.status(200).json(getOrderByIdUser);
  });

  getOrderByStatus = asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const getOrderByStatus = await orderService.getOrderByStatus(id);
    return res.status(200).json(getOrderByStatus);
  });

  getProcessingOrder = asyncWrapper(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const paymentMethodFilter = req.query.paymentMethod || "";
    const statusFilter = req.query.status || "";
    const delivery_methodFilter = req.query.delivery_method || "";
    const userDataFilter = req.query.userData || "";
    const dateFilter = req.query.dateFilter || "";
    const searchTerm = req.query.search || ""; // Nhận từ khóa tìm kiếm

    const limit = size;
    const offset = (page - 1) * size;

    const filterConditions = {};

    if (paymentMethodFilter) {
      filterConditions.paymentMethodId = paymentMethodFilter;
    }

    if (statusFilter) {
      filterConditions.statusId = statusFilter;
    }

    if (delivery_methodFilter) {
      filterConditions.delivery_method = delivery_methodFilter;
    }

    if (userDataFilter) {
      filterConditions.userData = userDataFilter;
    }

    if (dateFilter) {
      const today = new Date();
      let startDate;

      switch (dateFilter) {
        case "today":
          startDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );
          break;
        case "last7days":
          startDate = new Date();
          startDate.setDate(today.getDate() - 7);
          break;
        case "last30days":
          startDate = new Date();
          startDate.setDate(today.getDate() - 30);
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        filterConditions.createdAt = {
          [Op.gte]: startDate, // Lọc từ ngày bắt đầu trở đi
        };
      }
    }

    // Lọc và phân trang với tìm kiếm theo phone
    const { count, rows } = await orderService.getProcessingOrder({
      limit,
      offset,
      filterConditions,
      searchTerm, // Truyền từ khóa tìm kiếm vào
    });

    return res.status(200).json({
      total: count,
      rows,
    });
  });

  getStatusOrderByGHTK = asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const getStatusOrderGHTK = await getOrderGHTK(id);
    return res.status(200).json(getStatusOrderGHTK);
  });

  getPackageOrderGHTK = asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const getStatusOrderGHTK = await getPackageGHTK(id);
    return res.status(200).json(getStatusOrderGHTK);
  });

  getAllOrdersWithFilter = asyncWrapper(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const paymentMethodFilter = req.query.paymentMethod || "";
    const statusFilter = req.query.status || "";
    const delivery_methodFilter = req.query.delivery_method || "";
    const userDataFilter = req.query.userData || "";
    const dateFilter = req.query.dateFilter || "";
    const searchTerm = req.query.search || ""; // Nhận từ khóa tìm kiếm

    const limit = size;
    const offset = (page - 1) * size;

    const filterConditions = {};

    if (paymentMethodFilter) {
      filterConditions.paymentMethodId = paymentMethodFilter;
    }

    if (statusFilter) {
      filterConditions.statusId = statusFilter;
    }

    if (delivery_methodFilter) {
      filterConditions.delivery_method = delivery_methodFilter;
    }

    if (userDataFilter) {
      filterConditions.userData = userDataFilter;
    }

    if (dateFilter) {
      const today = new Date();
      let startDate;

      switch (dateFilter) {
        case "today":
          startDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );
          break;
        case "last7days":
          startDate = new Date();
          startDate.setDate(today.getDate() - 7);
          break;
        case "last30days":
          startDate = new Date();
          startDate.setDate(today.getDate() - 30);
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        filterConditions.createdAt = {
          [Op.gte]: startDate, // Lọc từ ngày bắt đầu trở đi
        };
      }
    }

    // Lọc và phân trang với tìm kiếm theo phone
    const { count, rows } = await orderService.getAllOrderWithFilter({
      limit,
      offset,
      filterConditions,
      searchTerm, // Truyền từ khóa tìm kiếm vào
    });

    return res.status(200).json({
      total: count,
      rows,
    });
  });

  createOrderWithDetail = asyncWrapper(async (req, res) => {
    const { total, ...rest } = req.body;
    const roundedTotal = Math.round(total);

    const newOrder = await orderService.createOrderWithDetail({
      ...rest,
      total: roundedTotal,
    });

    return res.status(200).json({ newOrder });
  });
}

module.exports = new OrderController();
