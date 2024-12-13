const asyncWrapper = require("../../middleware/async");
const cartService = require("./cart.service");
const productService = require("../product/product.service");
const db = require("../../models/index");
const socket = require("../../module/socket");

class CartController {
  //Get all cart by user
  getAllCartByUserId = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "invalid id" });
    }

    const { count, rows } = await cartService.getAllCartByUserId(id);
    return res.status(200).json({ count, rows });
  });

  //Created cart
  createCart = asyncWrapper(async (req, res) => {
    const { userId, productId, quantity, color, rom, total } = req.body;

    // Kiểm tra từng sản phẩm
    if (!userId || !productId || !quantity || !total) {
      return res.status(400).json({ error: "Invalid product data" });
    }

    const parsedUserId = parseInt(userId);
    const parsedProductId = parseInt(productId);
    const parsedQuantity = parseInt(quantity);
    const parsedTotal = Math.round(parseInt(total));

    // Tạo giỏ hàng
    const cartItem = await cartService.createCart({
      userId: parsedUserId,
      productId: parsedProductId,
      quantity: parsedQuantity,
      color,
      rom,
      total: parsedTotal,
    });

    return res.status(200).json(cartItem);
  });

  //Update quantity
  updateQuantity = asyncWrapper(async (req, res) => {
    const { quantity, color, rom } = req.body;

    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(500).json("Invalid user");
    }

    if (!quantity) {
      return res.status(500).json("invalid user");
    }

    const parsedQuantity = parseInt(quantity);

    const updateQuantity = await cartService.updateQuantityCart(id, {
      quantity: parsedQuantity,
      color,
      rom,
    });

    return res.status(200).json(updateQuantity);
  });

  //Delete cart
  deleteCartItem = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);

    try {
      // Xóa sản phẩm khỏi giỏ
      const result = await cartService.deleteCartItem(id);
      res.status(200).json({ result, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  //Clear
  clearCart = asyncWrapper(async (req, res) => {
    const userId = parseInt(req.params.userId);

    try {
      // Xóa toàn bộ giỏ hàng
      const result = await cartService.clearCart(userId);
      res.status(200).json({ result, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

module.exports = new CartController();
