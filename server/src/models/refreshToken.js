"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RefreshToken.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
        as: "userData",
      });
    }
  }
  RefreshToken.init(
    {
      userId: DataTypes.INTEGER,
      role: DataTypes.STRING,
      token: DataTypes.STRING,
      expiresIn: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "RefreshToken",
      tableName: "refreshtoken",
    }
  );
  return RefreshToken;
};
