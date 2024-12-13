const db = require("../../models/index");
const userService = require("../user/user.service");
const productService = require("../product/product.service");
const { Op } = require("sequelize");

class CommentsService {
  async createComment({
    userId,
    productId,
    comment,
    commentId,
    status,
    isAdmin,
  }) {
    try {
      const newComment = await db.Comment.create({
        productId,
        userId,
        comment,
        commentId,
        status,
        isAdmin,
      });

      if (commentId) {
        await db.Comment.update(
          {
            status,
          },
          {
            where: {
              id: commentId,
            },
          }
        );
      }

      const user = await db.User.findByPk(userId, {
        attributes: ["id", "fullname", "phone", "email"],
      });

      const product = await db.Product.findByPk(productId, {
        attributes: ["id", "name"],
      });

      return { ...newComment.dataValues, userData: user, productData: product };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteComment(id) {
    try {
      const comment = await db.Comment.destroy({
        where: { id },
      });
      return comment;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateComment(id, { comment, userId }) {
    console.log(id, comment, userId);
    try {
      const existingComment = await db.Comment.findOne({
        where: { id },
      });
      if (!existingComment) {
        throw new Error("Comment not found");
      }

      const updatedComment = await db.Comment.update(
        { comment, userId },
        { where: { id } }
      );
      return updatedComment;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllComment(limit, offset) {
    try {
      const count = await db.Comment.count();
      // Lấy comments với phân trang
      const comments = await db.Comment.findAll({
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });

      const comment = await db.Comment.findAndCountAll({
        include: [
          {
            model: db.Product,
            as: "productData",
          },
        ],
        limit: limit,
        offset: offset,
      });

      // Lấy danh sách các ID liên quan
      const userIds = [...new Set(comments?.map((c) => c.userId))];
      const productIds = [...new Set(comments?.map((c) => c.productId))];
      const commentIds = [...new Set(comments?.map((c) => c.id))];

      // Lấy thông tin liên quan song song
      const [users, products, replies] = await Promise.all([
        db.User.findAll({
          where: { id: userIds },
          attributes: ["id", "fullname", "phone"],
        }),
        db.Product.findAll({
          where: { id: productIds },
          attributes: ["id", "name"],
        }),
        db.Comment.findAll({ where: { id: commentIds } }),
      ]);

      // Kết hợp dữ liệu
      const rows = comments.map((comment) => ({
        userData: users.find((user) => user.id === comment.userId) || null,
        productData:
          products.find((product) => product.id === comment.productId) || null,
        replies: replies.filter(
          (reply) => reply.commentId === comment.id && reply.isAdmin === true
        ),
      }));

      return { count, rows };
    } catch (error) {
      console.error("Detailed error:", error);
      throw new Error("Error fetching comments");
    }
  }

  async getOneCommentByProductId(productId, limit, offset) {
    try {
      const comments = await db.Comment.findAndCountAll({
        where: { productId, commentId: null },
        order: [["createdAt", "DESC"]],
        limit: limit,
        offset: offset,
      });

      const comment = await db.Comment.findAll({
        include: [
          {
            model: db.Product,
            as: "productData",
            where: {
              id: productId,
            },
          },
          {
            model: db.User,
            as: "userData",
          },
        ],
      });

      const commentIds = [...new Set(comments.rows.map((c) => c.id))];
      const userIds = [...new Set(comments.rows.map((c) => c.userId))];
      const productIds = [...new Set(comments.rows.map((c) => c.productId))];

      const replies = await db.Comment.findAll({
        where: {
          commentId: { [Op.in]: commentIds }, // Chỉ lấy reply của comment chính
          isAdmin: true,
        },
      });

      // Lấy thêm userId từ replies
      const replyUserIds = [...new Set(replies.map((reply) => reply.userId))];
      const allUserIds = [...new Set([...userIds, ...replyUserIds])]; // Loại bỏ trùng lặp

      // Truy vấn đồng thời các dữ liệu liên quan
      const [users, products] = await Promise.all([
        db.User.findAll({ where: { id: allUserIds } }),
        db.Product.findAll({ where: { id: productIds } }),
      ]);

      const result = comments.rows.map((comment) => {
        return {
          userData: users.find((user) => user.id === comment.userId) || null,
          productData:
            products.find((product) => product.id === comment.productId) ||
            null,
          replies: replies
            .filter(
              (reply) =>
                reply.commentId === comment.id && reply.isAdmin === true
            )
            .map((reply) => ({
              userData: users.find((user) => user.id === reply.userId) || null, // Gắn userData vào reply
            })),
        };
      });

      return {
        total: comments.count,
        comments: result,
        totalPages: Math.ceil(comments.count / limit),
        currentPage: Math.floor(offset / limit) + 1,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOne(id) {
    try {
      const comment = await db.Comment.findOne({
        where: { id },
      });

      const user = await userService.getOneUserById(comment.userId);
      const product = await productService.getProductById(comment.productId);

      const result = {
        userData: user,
        productData: product,
      };

      if (!result) {
        return { message: "Comment not found", id };
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new CommentsService();
