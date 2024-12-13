"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cart.init(
    {
      productId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
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
      rom: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Cart",
      tableName: "cart",
    }
  );
  return Cart;
};