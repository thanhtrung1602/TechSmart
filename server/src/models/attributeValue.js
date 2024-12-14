"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AttributeValue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AttributeValue.belongsTo(models.Attribute, {
        foreignKey: "attributeId",
        targetKey: "id",
        as: "attributeData",

      });
      AttributeValue.belongsTo(models.Product, {
        foreignKey: "productId",
        targetKey: "id",
        as: "productData",

      });
      
    }
  }
  AttributeValue.init(
    {

      attributeId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      value: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AttributeValue",
      tableName: "attributevalue",
    }
  );
  return AttributeValue;
};
