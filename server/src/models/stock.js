"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    static associate(models) {
      Stock.belongsTo(models.Store, {
        foreignKey: "storeId",
        targetKey: "id",
        as: "storeData",
      });
      Stock.belongsTo(models.Product, {
        foreignKey: "productId",
        targetKey: "id",
        as: "productData",
      });
    }
  }
  Stock.init(
    {
      storeId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      stockProduct: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Stock",
      tableName: "stock",
    }
  );
  return Stock;
};
