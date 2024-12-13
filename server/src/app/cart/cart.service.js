const db = require("../../models/index");
const { Op } = require("sequelize");
const userService = require("../user/user.service");
const productService = require("../product/product.service");

class CartService {
  //Gat cart by user
  async getAllCartByUserId(userId) {
    try {
      const carts = await db.Cart.findAll({
        where: {
          userId,
        },
        order: [["createdAt", "DESC"]],
      });

      const { count, rows } = await db.Cart.findAndCountAll({
        where: {
          userId,
        },
        include: [
          {
            model: db.User,
            as: "userData",
          },
          {
            model: db.Product,
            as: "productData",
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return { count, rows };

      const user = await userService.getOneUserById(userId);
      const productIds = [...new Set(carts?.map((cart) => cart.productId))];
      const products = await productService.findAllProductsById(productIds);

      const result = carts?.map((cart) => ({
        ...cart.toJSON(),
        userData: user.toJSON(),
        productData:
          products.find((product) => product.id === cart.productId)?.toJSON() ||
          null,
      }));

      return { count: result?.length, rows: result };
    } catch (error) {
      console.error("Error in CartService:", error.message);
      throw new Error(error.message);
    }
  }

  //Create Cart
  async createCart({ userId, productId, quantity, color, rom, total }) {
    try {
      // Await the result of the findOne call
      const existingCartItem = await db.Cart.findOne({
        where: {
          userId,
          productId,
          color,
          rom,
        },
      });

      if (existingCartItem) {
        console.log(existingCartItem);

        // If the product already exists, increase the quantity
        existingCartItem.quantity += parseInt(quantity);
        existingCartItem.total += total;
        await existingCartItem.save(); // This will work now
        return { cart: existingCartItem };
      } else {
        // If the product does not exist, create a new item in the cart
        const newCartItem = await db.Cart.create({
          userId,
          productId,
          quantity: parseInt(quantity),
          color,
          rom,
          total,
        });

        console.log(newCartItem);

        return { cart: newCartItem, message: "Cart item created" };
      }
    } catch (error) {
      console.error("Error in CartService:", error.message);
      throw new Error(error.message);
    }
  }

  // Update cart item quantity
  async updateQuantityCart(id, { quantity, color, rom }) {
    console.log(id, quantity, color, rom);

    try {
      // Find the cart item for the given user and product
      const cartItem = await db.Cart.findOne({
        where: {
          id,
          color,
          rom,
        },
      });

      const product = await productService.getProductById(cartItem.productId);

      if (!cartItem) {
        return { error: "Cart item not found" };
      }

      // Hệ số giá theo dung lượng ROM
      const getPriceByRom = (basePrice, rom) => {
        let coefficient = 1.0;
        switch (rom) {
          case "128GB":
            coefficient = 1.2;
            break;
          case "256GB":
            coefficient = 1.3;
            break;
          case "512GB":
            coefficient = 1.4;
            break;
          case "1TB":
            coefficient = 2;
            break;
          case "2TB":
            coefficient = 2.1;
            break;
          case "64GB":
          case null:
          default:
            coefficient = 1.0;
        }
        return basePrice * coefficient;
      };

      // Tính giá dựa trên hệ số của ROM
      const total = getPriceByRom(product.price, rom);

      // Cập nhật quantity và tổng giá
      cartItem.quantity = quantity;
      cartItem.total = Math.round(total * quantity);
      await cartItem.save();
      return { cart: cartItem, message: "Cart item quantity updated" };
    } catch (error) {
      console.error("Error in CartService:", error.message);
      throw new Error(error.message);
    }
  }

  async findOne(id) {
    try {
      // Find the cart item for the user with the specific product, color, and rom
      const cartItem = await db.Cart.findOne({
        where: {
          id,
        },
      });

      if (!cartItem) {
        return { error: "Cart item not found" };
      }

      return cartItem;
    } catch (error) {
      console.error("Error in CartService:", error.message);
      throw new Error(error.message);
    }
  }

  // Delete cart item
  async deleteCartItem(id) {
    try {
      await this.findOne(id);
      const cartItem = await db.Cart.destroy({
        where: {
          id: id,
        },
      });

      if (cartItem) {
        return { message: "Cart item deleted successfully" };
      }
    } catch (error) {
      console.error("Error in CartService:", error.message);
      throw new Error(error.message);
    }
  }

  // Delete cart item
  async deleteCartOrderComplete(productId, color, rom) {
    try {
      const cartItem = await db.Cart.destroy({
        where: {
          productId: productId,
          color: color,
          rom: rom,
        },
      });

      if (cartItem) {
        return { message: "Cart item deleted successfully" };
      }
    } catch (error) {
      console.error("Error in CartService:", error.message);
      throw new Error(error.message);
    }
  }

  // Clear all cart items for the user
  async clearCart(userId) {
    try {
      await db.Cart.destroy({
        where: { userId },
      });
      return { message: "All cart items cleared" };
    } catch (error) {
      console.error("Error in CartService:", error.message);
      throw new Error(error.message);
    }
  }
}

module.exports = new CartService();
