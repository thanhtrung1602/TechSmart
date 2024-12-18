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
      const getOneValueAttributeById = await db.AttributeValue.findAll({
        include: [
          {
            model: db.Product,
            as: "productData",
            where: {
              id: productId,
            },
          },
          {
            model: db.Attribute,
            as: "attributeData",
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return getOneValueAttributeById;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createValueAttribute({ attributeId, productId, value }) {
    try {
      const getOneValueAttributeById = await db.AttributeValue.findOne({
        where: {
          attributeId,
          value,
          productId,
        },
        order: [["id", "DESC"]],
      });

      if (!getOneValueAttributeById) {
        const createValueAttribute = await db.AttributeValue.create(
          {
            attributeId,
            productId,
            value,
          },
          {
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
          }
        );
        if (createValueAttribute) {
          return createValueAttribute;
        }
      }

    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateOrCreateProductValueAttribute({
    productId,
    attributeId,
    value,
    id,
  }) {
    try {
      // Tìm giá trị thuộc tính theo attributeId
      const getOneValueAttributeById = await db.AttributeValue.findOne({
        where: {
          attributeId: attributeId,
        },
      });

      if (!getOneValueAttributeById) {
        return {
          error: `Không tìm thấy giá trị thuộc tính với id ${attributeId}`,
        };
      }

      // Cập nhật giá trị thuộc tính
      const updateValueAttribute = await db.AttributeValue.update(
        { productId, value },
        {
          where: {
            attributeId,
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

  async updateValueAttribute(attributeId, productId, value, id) {
    try {
      const getOneValueAttributeById = await db.AttributeValue.findOne({
        where: {
          id: id,
        },
      });

      if (!getOneValueAttributeById) {
        return {
          error: `Không tìm thấy getOneValueAttributeById by id ${id}`,
        };
      }

      const updateValueAttribute = await db.AttributeValue.update(
        { attributeId, productId, value },
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
}

module.exports = new ValueAttributeService();
