const db = require("../../models/index");
class ValueAttributeService {
  async getAllValueAttribute() {
    try {
      const getAllValueAttribute = await db.AttributeValue.findAll({
        order: [["id", "DESC"]],
      });
      return getAllValueAttribute;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getOneValueAttributeById(productId) {
    try {
      const getOneValueAttributeBySlug = await db.AttributeValue.findAll({
        where: {
          productId: productId,
        },
        include: [
          {
            model: db.Product,
            as: "productData",
          },
          {
            model: db.Attribute,
            as: "attributeData",
          },
          {
            model: db.Variant,
            as: "variantData",
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      if (!getOneValueAttributeBySlug) {
        return {
          error: `Không tìm thấy getOneValueAttributeBySlug by slug ${productId}`,
        };
      }

      return getOneValueAttributeBySlug;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getOneValueAttributeByProductId(productId) {
    try {
      const getOneValueAttributeBySlug = await db.AttributeValue.findOne({
        where: {
          productId: productId,
        },
        include: [
          {
            model: db.Product,
            as: "productData",
          },
          {
            model: db.Attribute,
            as: "attributeData",
          },
          {
            model: db.Variant,
            as: "variantData",
          },
        ],
        order: [["id", "DESC"]],
      });

      if (!getOneValueAttributeBySlug) {
        return {
          error: `Không tìm thấy getOneValueAttributeBySlug by slug ${productId}`,
        };
      }

      return getOneValueAttributeBySlug;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAttributeValueByVariant(variantId) {
    try {
      const getOneValueAttributeBySlug = await db.AttributeValue.findAll({
        where: {
          variantId: variantId,
        },
        include: [
          {
            model: db.Product,
            as: "productData",
          },
          {
            model: db.Attribute,
            as: "attributeData",
          },
          {
            model: db.Variant,
            as: "variantData",
          },
        ],
        order: [["id", "DESC"]],
      });

      if (!getOneValueAttributeBySlug) {
        return {
          error: `Không tìm thấy getOneValueAttributeBySlug by slug ${productId}`,
        };
      }

      return getOneValueAttributeBySlug;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createValueAttribute({ attributeId, productId, variantId, value }) {
    try {
      console.log("Service created:", productId, attributeId, variantId, value);
      const getOneValueAttributeById = await db.AttributeValue.findOne({
        where: {
          attributeId,
          productId,
          variantId,
          value,
        },
        include: [
          {
            model: db.Product,
            as: "productData",
          },
          {
            model: db.Attribute,
            as: "attributeData",
          },
          {
            model: db.Variant,
            as: "variantData",
          },
        ],
      });

      if (!getOneValueAttributeById) {
        const createValueAttribute = await db.AttributeValue.create({
          attributeId,
          productId,
          variantId,
          value,
        });

        if (createValueAttribute) {
          return createValueAttribute;
        }
      } else {
        console.log(
          "Value attribute already exists:",
          getOneValueAttributeById
        );
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateOrCreateProductValueAttribute({
    productId,
    attributeId,
    variantId,
    value,
    id,
  }) {
    try {
      // Tìm giá trị thuộc tính theo attributeId
      const getOneValueAttributeById = await db.AttributeValue.findOne({
        where: {
          attributeId: attributeId,
        },
        include: [
          {
            model: db.Product,
            as: "productData",
          },
          {
            model: db.Attribute,
            as: "attributeData",
          },
        ],
      });

      if (!getOneValueAttributeById) {
        return {
          error: `Không tìm thấy giá trị thuộc tính với id ${attributeId}`,
        };
      }

      // Cập nhật giá trị thuộc tính
      const updateValueAttribute = await db.AttributeValue.update(
        { productId, variantId, value },
        {
          where: {
            productId,
            attributeId,
            variantId,
            id,
          },
        }
      );

      if (updateValueAttribute[0] > 0) {
        return { message: "Cập nhật thành công!" };
      } else {
        return { message: "Không có thay đổi nào được thực hiện" };
      }
    } catch (error) {
      console.error("Error:", error.message);
      throw new Error(error.message);
    }
  }

  async updateValueAttribute(attributeId, productId, variantId, value, id) {
    try {
      const getOneValueAttributeById = await db.AttributeValue.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: db.Product,
            as: "productData",
          },
          {
            model: db.Attribute,
            as: "attributeData",
          },
        ],
      });

      if (!getOneValueAttributeById) {
        return {
          error: `Không tìm thấy getOneValueAttributeById by id ${id}`,
        };
      }

      const updateValueAttribute = await db.AttributeValue.update(
        { attributeId, productId, variantId, value },
        {
          where: {
            id,
          },
        }
      );

      if (updateValueAttribute) {
        return { message: "update successfully!" };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delValueAttribute(numberId) {
    try {
      const getOneValueAttributeById = await db.AttributeValue.findOne({
        where: {
          id: numberId,
        },
      });

      if (!getOneValueAttributeById) {
        return {
          error: `Không tìm thấy getOneValueAttributeById by id ${numberId}`,
        };
      }

      const delValueAttribute = await db.AttributeValue.destroy({
        where: {
          id: numberId,
        },
        order: [["id", "DESC"]],
      });

      if (delValueAttribute) {
        return { message: "delete successfully!" };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delValueAttributeByVariant(numberId) {
    try {
      const getOneValueAttributeById = await db.AttributeValue.findOne({
        where: {
          variantId: numberId,
        },
      });

      if (!getOneValueAttributeById) {
        return {
          error: `Không tìm thấy getOneValueAttributeById by id ${numberId}`,
        };
      }

      const delValueAttributeByVariant = await db.AttributeValue.destroy({
        where: {
          variantId: numberId,
        },
        order: [["id", "DESC"]],
      });

      if (delValueAttributeByVariant) {
        return { message: "delete successfully!" };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new ValueAttributeService();