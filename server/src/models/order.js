"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
        as: "userData",
      });
      Order.belongsTo(models.Addresses, {
        foreignKey: "addressId",
        targetKey: "id",
        as: "addressData",
      })
      Order.belongsTo(models.StatusOrder, {
        foreignKey: "statusId",
        targetKey: "id",
        as: "statusData",
      })
      Order.belongsTo(models.StatusPayment, {
        foreignKey: "statusPayId",
        targetKey: "id",
        as: "statusPayData",
      })
      Order.belongsTo(models.PaymentMethod, {
        foreignKey: "paymentMethodId",
        targetKey: "id",
        as: "paymentMethodData",
      })
      Order.belongsTo(models.Store, {
        foreignKey: "storeId",
        targetKey: "id",
        as: "storeData",
      })
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
