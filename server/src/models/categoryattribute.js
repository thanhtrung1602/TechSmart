"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CategoryAttribute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CategoryAttribute.belongsTo(models.Categories, {
        foreignKey: "categoryId",
        targetKey: "id",
        as: "categoryData",
      });
      CategoryAttribute.belongsTo(models.Attribute, {
        foreignKey: "attributeId",
        targetKey: "id",
        as: "attributeData",
      });
    }
  }
  CategoryAttribute.init(
    {
      categoryId: DataTypes.INTEGER,
      attributeId: DataTypes.INTEGER,
    },
    {  
      sequelize,
      modelName: "CategoryAttribute",
      tableName: "categoryattributes",
    }
  );
  return CategoryAttribute;
};
