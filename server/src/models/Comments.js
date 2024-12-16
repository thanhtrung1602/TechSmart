"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
        as: "userData",
      })
      Comment.belongsTo(models.Product, {
        foreignKey: "productId",
        targetKey: "id",
        as: "productData",
      })
      // Quan hệ cha-con giữa các Comment
      Comment.hasMany(models.Comment, {
        as: "replies", // alias cho mối quan hệ replies
        foreignKey: "commentId", // foreignKey chỉ ra mối quan hệ cha-con
      });
    }
  }
  Comment.init(
    {
      userId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      comment: DataTypes.STRING,
      commentId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "comments",
    }
  );
  return Comment;
};
