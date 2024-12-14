const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Variant extends Model {
        static associate(models) {
            Variant.belongsTo(models.Product, {
                foreignKey: "productId",
                targetKey: "id",
                as: "productData",
            });
        }
    }
    Variant.init(
        {
            productId: DataTypes.INTEGER,
            stock: DataTypes.INTEGER,
            price: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Variant",
            tableName: "variants",
        }
    );
    return Variant;
};