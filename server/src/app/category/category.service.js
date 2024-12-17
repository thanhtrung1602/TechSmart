const db = require("../../models/index");
const { Op } = require("sequelize");

class CategoriesService {
  async createCategories({ name, visible }, file, slug) {
    try {
      const [categories, created] = await db.Categories.findOrCreate({
        where: {
          name,
          slug,
          visible,
        },
        defaults: {
          img: file,
        },
      });

      if (!created) {
        return { error: "Category already exists in the database" };
      }
      return categories;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async filteredCategories(limit, offSet, search, filter, visible) {
    try {
      // Check if search or filter are valid before applying them to the query
      const searchCondition = search && search.trim() !== "" && search !== "null"
        ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { slug: { [Op.iLike]: `%${search}%` } },
          ]
        }
        : null;

      const filterCondition = filter && filter.trim() !== "" && filter !== "null"
        ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${filter}%` } },
            { slug: { [Op.iLike]: `%${filter}%` } },
          ]
        }
        : null;
        const visibleCondition =
        visible && visible !== "null"
          ? { visible: visible } // Filter by visible status (true or false)
          : null;

      // Combine search and filter conditions, removing any null values
      const whereCondition = {
        [Op.and]: [
          searchCondition,
          filterCondition,
          visibleCondition
        ].filter(Boolean), // Remove null conditions
      };

      // If no search or filter condition is applied, return all records
      const allCategories = await db.Categories.findAndCountAll({
        where: whereCondition || {}, // If no conditions, return all
        limit: limit,                 // Pagination: number of records per page
        offset: offSet,               // Pagination: offset for current page
        order: [["createdAt", "DESC"]], // Order by creation date descending
      });

      return allCategories;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllCategories() {
    try {
      const allCategories = await db.Categories.findAll({
        order: [["id", "ASC"]],
      });
      return allCategories;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getCategoryById(id) {
    try {
      const categories = await db.Categories.findByPk(id);
      return categories;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAllCategoryById(id) {
    try {
      const categories = await db.Categories.findAll({
        where: {
          id,
        },
      });
      return categories;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getCategorySlug(slug) {
    try {
      const categories = await db.Categories.findOne({ where: { slug } });
      return categories;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateCategories(id, { name, visible }, file, slug) {
    try {
      const category = await db.Categories.findByPk(id);

      if (!category) {
        return { error: "Category không tồn tại" };
      }

      const fileImg = file ? file : category.img;

      const [updated] = await db.Categories.update(
        {
          name,
          slug,
          visible,
          img: fileImg,
        },
        {
          where: { id },
          returning: true,
        }
      );

      if (updated) {
        return { message: "Update category thành công" };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteCategories(id) {
    try {
      const category = await db.Categories.findByPk(id);

      if (!category) {
        return { error: "Category không tồn tại" };
      }
      const deleted = await db.Categories.destroy({
        where: { id },
      });

      if (deleted) {
        return { message: "Category deleted successfully" };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }


  async updateCategoriesByVisible(id) {
    try {
      // Tìm đối tượng theo ID
      const checkCategory = await db.Categories.findOne({
        where: {
          id,
        },
      });

      // Kiểm tra nếu đối tượng không tồn tại
      if (!checkCategory) {
        return { error: "Đối tượng không tồn tại" };
      }

      const category = checkCategory.dataValues;

      if (category.visible === false) {
        const updateCategories = await db.Categories.update(
          { visible: true },
          {
            where: {
              id,
            },
          }
        );

        if (updateCategories[0] > 0) {
          return { message: "Update visible thành công" };
        } else {
          return { error: "Update visible thất bại" };
        }
      } else if (category.visible === true) {
        const updateCategories = await db.Categories.update(
          { visible: false },
          {
            where: {
              id,
            },
          }
        );
        if (updateCategories[0] > 0) {
          return { message: "Update visible thành công" };
        } else {
          return { error: "Update visible thất bại" };
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

}

module.exports = new CategoriesService();
