"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
    }
  }
  Order.init(
    {
      userId: DataTypes.INTEGER,
      addressId: DataTypes.INTEGER,
      phone: DataTypes.INTEGER,
      total: {
        type: DataTypes.BIGINT,
        get() {
          const value = this.getDataValue("total");
          return value ? parseInt(value, 10) : null;
        },
      },
      statusId: DataTypes.INTEGER,
      statusPayId: DataTypes.INTEGER,
      order_code: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      paymentMethodId: DataTypes.INTEGER,
      transactionCode: DataTypes.INTEGER,
      tracking_order: DataTypes.STRING,
      reason: DataTypes.STRING,
      storeId: DataTypes.INTEGER,
      delivery_method: DataTypes.STRING,
      deliveryDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "order",
      timestamps: false,
    }
  );
  return Order;
};
