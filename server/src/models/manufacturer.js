"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ManuFacturer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ManuFacturer.belongsTo(models.Categories, {
        foreignKey: "categoryId",
        targetKey: "id",
        as: "categoryData",
      });
    }
  }
  ManuFacturer.init(
    {
      categoryId: DataTypes.STRING,
      name: DataTypes.STRING,
      img: DataTypes.STRING,
      slug: DataTypes.STRING,
      visible: DataTypes.BOOLEAN,

    },
    {
      sequelize,
      modelName: "ManuFacturer",
      tableName: "manufacturer",
    }
  );
  return ManuFacturer;
};
