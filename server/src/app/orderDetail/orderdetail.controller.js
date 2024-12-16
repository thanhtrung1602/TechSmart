const asyncWrapper = require("../../middleware/async");
const orderdetailService = require("./orderdetail.service");
const variant = require("../variant/variant.service");
const socket = require("../../module/socket");
const orderService = require("../order/order.service");
const cartService = require("../cart/cart.service");

class OrderDetailController {
  createOrderDetail = asyncWrapper(async (req, res) => {
    const { orderId, variantId, quantity, total, color, size } = req.body;

    if (!orderId || !variantId || !quantity || !total) {
      return res.status(400).json({ error: "Invalid product data" });
    }

    // Làm tròn total để đảm bảo nó là số nguyên
    const roundedTotal = Math.round(total);

    const order = await orderService.getOrderById(orderId);

    console.log(req.body);

    const newOrderDetail = await orderdetailService.createOrderDetail(req.body, roundedTotal);

    if (newOrderDetail) {
      // Sau khi tạo orderDetail, cập nhật kho cho sản phẩm
      await variant.updateStock(variantId, quantity);

      // Lấy thông tin sản phẩm sau khi cập nhật kho
      const variant = await variant.getVariantById(variantId);

      // Nếu cần thông báo thay đổi kho qua WebSocket
      const io = socket.getIo();
      io.emit('stockUpdate', { variantId: variantId, newStock: variant.stock });

      // Xóa sản phẩm khỏi giỏ hàng dựa trên thông tin OrderDetail
      const cartItems = await cartService.getAllCartByUserId(order.userId);

      if (cartItems && cartItems.rows) {
        for (const cartItem of cartItems.rows) {
          console.log(cartItem);
          // So sánh các thuộc tính variantId, color, size
          if (
            cartItem.variantId === variantId &&
            cartItem.color === color &&
            cartItem.rom === size
          ) {
            await cartService.deleteCartItem(cartItem.id);

            // Phát tín hiệu cập nhật giỏ hàng qua WebSocket
            io.emit("cartUpdate", {
              userId: order.userId,
              cartId: cartItem.id,
            });
          }
        }
      }
    }

    return res.status(200).json(newOrderDetail);
  });

  getAllOrderDetails = asyncWrapper(async (req, res) => {
    const orderDetails = await orderdetailService.getAllOrderDetails();
    return res.status(200).json(orderDetails);
  });

  getAllOrderDetailByOrderId = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const orderDetails = await orderdetailService.getAllOrderDetailByOrderId(
      id
    );
    return res.status(200).json(orderDetails);
  });

  deleteOrderDetail = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const deletedOrderDetailCount = await orderdetailService.deleteOrderDetail(
      id
    );
    return res.status(200).json({
      message: `Đã xóa chi tiết đơn hàng thành công, ${deletedOrderDetailCount} đơn hàng đã đã xóa.`,
    });
  });
}

module.exports = new OrderDetailController();
