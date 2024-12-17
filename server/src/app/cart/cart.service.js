const db = require("../../models/index");
const { Op } = require("sequelize");
const userService = require("../user/user.service");
const variantService = require("../variant/variant.service");

class CartService {
  //Gat cart by user
  async getAllCartByUserId(userId) {
    try {
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
            model: db.Variant,
            as: "variantData",
            include: [
              {
                model: db.Product,
                as: "productData",
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      console.log(count, rows);

      return { count, rows };
    } catch (error) {
      console.error("Error in CartService:", error.message);
      throw new Error(error.message);
    }
  }

  //Create Cart
  async createCart({ userId, variantId, quantity, color, rom, total }) {
    try {
      // Await the result of the findOne call
      const existingCartItem = await db.Cart.findOne({
        where: {
          userId,
          variantId,
          color,
          rom,
        },
        include: [
          {
            model: db.User,
            as: "userData",
          },
          {
            model: db.Variant,
            as: "variantData",
          },
        ],
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
          variantId,
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
        include: [
          {
            model: db.User,
            as: "userData",
          },
          {
            model: db.Variant,
            as: "variantData",
          },
        ],
      });

      const variant = await variantService.getVariantById(cartItem.variantId);

      if (!cartItem) {
        return { error: "Cart item not found" };
      }
      console.log(variant);
      // Cập nhật quantity và tổng giá
      cartItem.quantity = quantity;
      cartItem.total = Math.round(variant.dataValues.price * quantity);
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
        include: [
          {
            model: db.User,
            as: "userData",
          },
          {
            model: db.Variant,
            as: "variantData",
          },
        ],
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
  async deleteCartOrderComplete(variantId, color, rom) {
    try {
      const cartItem = await db.Cart.destroy({
        where: {
          variantId: variantId,
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
