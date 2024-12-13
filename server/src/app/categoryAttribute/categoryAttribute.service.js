const db = require("../../models/index");
const { Op } = require("sequelize");
const attributeService = require("../attribute/attribute.service");
const categoryService = require("../category/category.service");

class CategoryAttributeService {
  //Get all
  async getAll() {
    try {
      const categoryAttributes = await db.CategoryAttribute.findAll();

      const attributeIds = [
        ...new Set(categoryAttributes?.map((item) => item.attributeId)),
      ];
      const categoryIds = [
        ...new Set(categoryAttributes?.map((item) => item.categoryId)),
      ];

      const attributes = await attributeService.findAllAttribute(attributeIds);
      const categories = await categoryService.findAllCategoryById(categoryIds);

      const result = categoryAttributes?.map((item) => ({
        ...item.toJSON(),
        attributeData:
          attributes.find((attr) => attr.id === item.attributeId)?.toJSON() ||
          null,
        categoryData:
          categories.find((cat) => cat.id === item.categoryId)?.toJSON() ||
          null,
      }));

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Get by id
  async getById(id) {
    try {
      const categoryAttribute = await db.CategoryAttribute.findOne({
        where: { id },
      });

      const attribute = await attributeService.getOneAttribute(
        categoryAttribute.attributeId
      );
      const category = await categoryService.getCategoryById(
        categoryAttribute.categoryId
      );

      const result = categoryAttributes?.map((item) => ({
        ...item.toJSON(),
        attributeData: attribute,
        categoryData: category,
      }));

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Get by category
  async getByCategory(categoryId) {
    try {
      const categoryAttributes = await db.CategoryAttribute.findAll({
        where: { categoryId },
      });

      const attributeIds = [
        ...new Set(categoryAttributes?.map((item) => item.attributeId)),
      ];
      const categoryIds = [
        ...new Set(categoryAttributes?.map((item) => item.categoryId)),
      ];

      const attributes = await attributeService.findAllAttribute(attributeIds);
      const categories = await categoryService.findAllCategoryById(categoryIds);

      const result = categoryAttributes?.map((item) => ({
        ...item.toJSON(),
        attributeData:
          attributes.find((attr) => attr.id === item.attributeId)?.toJSON() ||
          null,
        categoryData:
          categories.find((cat) => cat.id === item.categoryId)?.toJSON() ||
          null,
      }));

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Get by attribute
  async getByAttribute(attributeId) {
    const categoryAttributes = await db.CategoryAttribute.findAll({
      where: { attributeId },
    });

    const attributeIds = [
      ...new Set(categoryAttributes?.map((item) => item.attributeId)),
    ];
    const categoryIds = [
      ...new Set(categoryAttributes?.map((item) => item.categoryId)),
    ];

    const attributes = await attributeService.findAllAttribute(attributeIds);
    const categories = await categoryService.findAllCategoryById(categoryIds);

    const result = categoryAttributes?.map((item) => ({
      ...item.toJSON(),
      attributeData:
        attributes.find((attr) => attr.id === item.attributeId)?.toJSON() ||
        null,
      categoryData:
        categories.find((cat) => cat.id === item.categoryId)?.toJSON() || null,
    }));

    return result;
  }

  //Created
  async create(data) {
    const categoryAttribute = await db.CategoryAttribute.create(data);
    return categoryAttribute;
  }

  //Update
  async update(id, data) {
    const categoryAttribute = await db.CategoryAttribute.update(data, {
      where: { id },
    });
    return categoryAttribute;
  }

  //Delete
  async delete(id) {
    const categoryAttribute = await db.CategoryAttribute.destroy({
      where: { id },
    });
    return categoryAttribute;
  }
}

module.exports = new CategoryAttributeService();
