"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {

    static associate(models) {
      Product.belongsTo(models.Categories, {
        foreignKey: "categoryId",
        targetKey: "id",
        as: "categoryData",
      })
      Product.belongsTo(models.ManuFacturer, {
        foreignKey: "manufacturerId",
        targetKey: "id",
        as: "manufacturerData",
      })
    }
  }
  Product.init(
    {
      categoryId: DataTypes.INTEGER,
      manufacturerId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      price: DataTypes.INTEGER,
      discount: DataTypes.INTEGER,
      img: DataTypes.STRING,
      stock: DataTypes.INTEGER,
      visible: DataTypes.BOOLEAN,
      hot: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
    }
  );
  return Product;
};
