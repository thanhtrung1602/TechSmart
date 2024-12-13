"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Addresses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Addresses.init(
    {
      province: DataTypes.JSON,
      ward: DataTypes.STRING,
      district: DataTypes.JSON,
      street: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      phone: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Addresses",
      tableName: "addresses",
    }
  );
  return Addresses;
};
