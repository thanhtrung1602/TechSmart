const db = require("../../models/index");
class AttributeService {
  async createAttribute({ name }) {
    try {
      const [attribute, created] = await db.Attribute.findOrCreate({
        where: { name },
      });
      if (!created) {
        return "Thuộc tính đã tồn tại";
      }
      return attribute;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllAttribute() {
    try {
      const attribute = await db.Attribute.findAll();
      return attribute;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getOneAttribute(id) {
    try {
      const attribute = await db.Attribute.findOne({
        where: { id },
      });

      if (!attribute) {
        return "Thuộc tính không có trong store";
      }

      return attribute;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAllAttribute(id) {
    try {
      const attribute = await db.Attribute.findAll({
        where: { id },
      });

      if (!attribute) {
        return "Thuộc tính không có trong store";
      }

      return attribute;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateAttribute(id, { name }) {
    try {
      const attribute = await db.Attribute.findOne({
        where: { id },
      });

      const updateAttribute = await attribute.update(
        { name },
        { where: { id } }
      );
      if (updateAttribute) {
        return { message: "update attribute successfully!" };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteAttribute(id) {
    try {
      const attribute = await db.Attribute.findOne({
        where: { id },
      });
      if (!attribute) {
        return "Thuộc tính không có trong store";
      }
      const deletedAttribute = await db.Attribute.destroy({
        where: { id },
      });
      return deletedAttribute;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new AttributeService();
