const db = require("../../models/index");

class VariantService {
    async getAllVariant() {
        try {
            const findAll = await db.Variant.findAll({
                include: [
                    {
                        model: db.Product,
                        as: "productData"
                    }
                ]
            });
            return findAll;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getVariantById(id) {
        try {
            const findOne = await db.Variant.findByPk(id);
            return findOne;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllVariantByProductId(id) {
        try {
            const findOne = await db.Variant.findAll({
                where: {
                    productId: id
                },
                include: [
                    {
                        model: db.Product,
                        as: "productData"
                    }
                ]
            });
            return findOne;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getOneVariantByProductId(id) {
        try {
            const findOne = await db.Variant.findOne({
                where: {
                    productId: id
                },
                include: [
                    {
                        model: db.Product,
                        as: "productData"
                    }
                ]
            });
            return findOne;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createVariant(productId, stock, price) {
        try {
            const create = await db.Variant.create({
                productId,
                stock,
                price
            });
            return create;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteVariant(id) {
        try {
            const del = await db.Variant.destroy({
                where: {
                    id
                }
            });
            return del;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateVariant(id, productId, stock, price) {
        try {
            const update = await db.Variant.update(
                { productId, stock, price },
                {
                    where: {
                        id
                    }
                }
            );
            return update;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProductVariant(id, productId, stock, price) {
        try {
            const variant = await db.Variant.findOne({
                where: {
                    id,
                    productId
                }
            })
            const update = await variant.update(
                { stock, price },
                {
                    where: {
                        id,
                        productId
                    }
                }
            );
            return update;
        } catch (error) {
            throw new Error(error.message);
        }
    }



    async updateStock(id, quantity) {
        try {
            const variant = await db.Variant.findOne({
                where: { id },
            });

            if (!variant) {
                return "Không tìm thấy sản phẩm";
            }

            if (variant.stock > 0 || quantity > 0) variant.stock -= quantity;

            await variant.save();
            return "Đã giảm số lượng trong kho";
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new VariantService();