"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Store.init(
    {
      province: DataTypes.JSON,
      district: DataTypes.JSON,
      ward: DataTypes.STRING,
      street: DataTypes.STRING,
      phone: DataTypes.STRING,
      codeStore: DataTypes.STRING,
      visible: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Store",
      tableName: "store",
    }
  );
  return Store;
};
