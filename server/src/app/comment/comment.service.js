const db = require("../../models/index");
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
      const comment = await db.Comment.findAndCountAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: db.Product,
            as: "productData",
          },
          {
            model: db.User,
            as: "userData",
          },
          {
            model: db.Comment,
            as: "replies",
            where: {
              commentId: null,
              isAdmin: true,
            },
          },
        ],
        limit: limit,
        offset: offset,
      });

      return comment;
    } catch (error) {
      console.error("Detailed error:", error);
      throw new Error("Error fetching comments");
    }
  }

  async getOneCommentByProductId(productId, limit, offset) {
    try {
      const comment = await db.Comment.findAndCountAll({
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
            attributes: ["id", "fullname", "phone"],
          },
          {
            model: db.Comment,
            as: "replies",
            where: {
              commentId: { [Op.not]: null },
              isAdmin: true,
            },
          },
        ],
        limit: limit,
        offset: offset,
      });

      return {
        total: comment.count,
        comments: comment.rows,
        totalPages: Math.ceil(comment.count / limit),
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
        include: [
          {
            model: db.Product,
            as: "productData",
            where: {
              id: productId,
            },
            attributes: ["id", "name", "image"],
          },
          {
            model: db.User,
            as: "userData",
            attributes: ["id", "fullname", "phone"],
          },
        ],
      });

      if (!comment) {
        return { message: "Comment not found", id };
      }
      return comment;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new CommentsService();
