"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StatusOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  StatusOrder.init(
    {
        status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "StatusOrder",
      tableName: "statusOrder",
    }
  );
  return StatusOrder;
};
