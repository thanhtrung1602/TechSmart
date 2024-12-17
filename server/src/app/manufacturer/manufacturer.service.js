const db = require("../../models/index");
const { Op } = require("sequelize");
const categoryService = require("../category/category.service");

class ManufacturerService {
  async filteredManufacturer(
    limit,
    offset,
    category,
    manufacturer,
    search,
    visible
  ) {
    try {
      const categorySlug =
        category && category !== "null"
          ? await categoryService.getCategorySlug(category)
          : null;

      const searchCondition =
        search && search.trim() !== "" && search !== "null"
          ? {
            [Op.or]: [
              { name: { [Op.iLike]: `%${search}%` } },
              { slug: { [Op.iLike]: `%${search}%` } },
            ],
          }
          : null;

      const visibleCondition =
        visible && visible !== "null"
          ? { visible: visible } // Filter by visible status (true or false)
          : null;

      const categoryCondition =
        categorySlug && categorySlug.id
          ? { categoryId: categorySlug.id }
          : null;

      const manufacturerCondition =
        manufacturer && manufacturer !== "null" ? { id: manufacturer } : null;

      const whereCondition = {
        [Op.and]: [
          searchCondition,
          categoryCondition,
          manufacturerCondition,
          visibleCondition,
        ].filter(Boolean),
      };

      const { count, rows } = await db.ManuFacturer.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
        ],
      });

      return { count, rows };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async findAll() {
    try {
      const manufacturers = await db.ManuFacturer.findAll({
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
        ],
      });

      return manufacturers;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllManufacturer(limit, offset) {
    try {
      const { count, rows } = await db.ManuFacturer.findAndCountAll({
        limit,
        offset,
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
        ],
      });

      return { count, rows };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getOneManufacturerById(numberId) {
    try {
      const manufacturer = await db.ManuFacturer.findOne({
        where: {
          id: numberId,
        },
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
        ],
      });

      if (!manufacturer) {
        return { error: `Không tìm thấy Manufacturer by id ${numberId}` };
      }

      return manufacturer;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getManufacturerByCategory(slug) {
    try {
      const category = await categoryService.getCategorySlug(slug);

      const manufacturers = category
        ? await db.ManuFacturer.findAll({
          where: {
            categoryId: category.id,
          },
          include: [
            {
              model: db.Categories,
              as: "categoryData",
            },
          ],
        })
        : [];

      return manufacturers;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createManufacturer(categoryId, name, slug, file, visible) {
    try {
      const manufacturer = await db.ManuFacturer.create({
        name,
        slug,
        categoryId,
        img: file,
        visible,
      });

      return manufacturer;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateManufacturer(categoryId, name, slug, id, file, visible) {
    try {
      const manufacturer = await db.ManuFacturer.findOne({
        where: {
          id,
        },
      });

      if (!manufacturer) {
        return { error: `Không tìm thấy Manufacturer by id ${id}` };
      }

      const fileImg = file || manufacturer.img;

      const updated = await db.ManuFacturer.update(
        {
          categoryId,
          name,
          slug,
          img: fileImg,
          visible,
        },
        {
          where: {
            id,
          },
        }
      );

      return updated[0] > 0
        ? { message: "Update successfully!" }
        : { error: "Update failed!" };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delManufacturer(id) {
    try {
      const manufacturer = await db.ManuFacturer.findOne({
        where: {
          id,
        },
      });

      if (!manufacturer) {
        return { error: `Không tìm thấy Manufacturer by id ${id}` };
      }

      const deleted = await db.ManuFacturer.destroy({
        where: {
          id,
        },
      });

      return deleted > 0
        ? { message: "Deleted successfully!" }
        : { error: "Delete failed!" };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateManufacturerByVisible(id) {
    try {
      const manufacturer = await db.ManuFacturer.findOne({
        where: {
          id,
        },
      });

      if (!manufacturer) {
        return { error: "Đối tượng không tồn tại" };
      }

      const updated = await db.ManuFacturer.update(
        { visible: !manufacturer.visible },
        {
          where: {
            id,
          },
        }
      );

      return updated[0] > 0
        ? { message: "Update visible thành công" }
        : { error: "Update visible thất bại" };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new ManufacturerService();
