const db = require("../../models/index");
const { Op } = require("sequelize");
const attributeService = require("../attribute/attribute.service");
const categoryService = require("../category/category.service");

class CategoryAttributeService {
  // Get all
  async getAll() {
    try {
      const categoryAttributes = await db.CategoryAttribute.findAll({
        include: [
          {
            model: db.Category,
            as: "categoryData",
          },
          {
            model: db.Attribute,
            as: "attributeData",
          },
        ],
      });
      return categoryAttributes;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get by id
  async getById(id) {
    try {
      const categoryAttribute = await db.CategoryAttribute.findOne({
        where: { id },
        include: [
          {
            model: db.Category,
            as: "categoryData",
          },
          {
            model: db.Attribute,
            as: "attributeData",
          },
        ],
      });
      return categoryAttribute;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get by category
  async getByCategory(categoryId) {
    try {
      const categoryAttributes = await db.CategoryAttribute.findAll({
        where: { categoryId },
        include: [
          {
            model: db.Category,
            as: "categoryData",
          },
          {
            model: db.Attribute,
            as: "attributeData",
          },
        ],
      });
      return categoryAttributes;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get by attribute
  async getByAttribute(attributeId) {
    try {
      const categoryAttributes = await db.CategoryAttribute.findAll({
        where: { attributeId },
        include: [
          {
            model: db.Category,
            as: "categoryData",
          },
          {
            model: db.Attribute,
            as: "attributeData",
          },
        ],
      });
      return categoryAttributes;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Create
  async create(data) {
    try {
      const categoryAttribute = await db.CategoryAttribute.create(data);
      return categoryAttribute;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update
  async update(id, data) {
    try {
      const categoryAttribute = await db.CategoryAttribute.update(data, {
        where: { id },
      });
      return categoryAttribute;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Delete
  async delete(id) {
    try {
      const categoryAttribute = await db.CategoryAttribute.destroy({
        where: { id },
      });
      return categoryAttribute;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new CategoryAttributeService();
