"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderDetail.belongsTo(models.Product, {
        foreignKey: "productId",
        targetKey: "id",
        as: "productData",
      })
      OrderDetail.belongsTo(models.Order, {
        foreignKey: "orderId",
        targetKey: "id",
        as: "orderData",
      })
    }
  }
  OrderDetail.init(
    {
      productId: DataTypes.INTEGER,
      orderId: DataTypes.INTEGER,
      quantity: {
        type: DataTypes.BIGINT,
        get() {
          const value = this.getDataValue("quantity");
          return value ? parseInt(value, 10) : null;
        },
      },
      total: {
        type: DataTypes.BIGINT,
        get() {
          const value = this.getDataValue("total");
          return value ? parseInt(value, 10) : null;
        },
      },
      color: DataTypes.STRING,
      size: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "OrderDetail",
      tableName: "orderdetail",
    }
  );
  return OrderDetail;
};
