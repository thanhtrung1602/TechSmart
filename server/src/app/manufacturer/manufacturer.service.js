const db = require("../../models/index");
const { Op } = require("sequelize");
const categoryService = require("../category/category.service");
class ManufacturerService {
  //filteredManufacturer

  async filteredManufacturer(
    limit,
    offSet,
    category,
    manufacturer,
    search,
    visible
  ) {
    try {
      // Nếu category hợp lệ, lấy categorySlug, ngược lại không thực hiện gì
      const categorySlug =
        category && category !== "null"
          ? await categoryService.getCategorySlug(category)
          : null;

      // Tạo điều kiện tìm kiếm
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
        visible === true || visible === false
          ? { visible: visible } // Filter by visible status (true or false)
          : null;
      // Điều kiện lọc theo category nếu categorySlug hợp lệ
      const categoryCondition =
        categorySlug && categorySlug.id
          ? { categoryId: categorySlug.id }
          : null;

      // Điều kiện lọc theo manufacturer
      const manufacturerCondition =
        manufacturer && manufacturer !== "null" ? { id: manufacturer } : null;

      // Kết hợp các điều kiện lại với nhau
      const whereCondition = {
        [Op.and]: [
          searchCondition,
          categoryCondition,
          manufacturerCondition,
          visibleCondition,
        ].filter(Boolean), // Loại bỏ các điều kiện null
      };

      // Lấy tất cả các category nếu categorySlug hợp lệ
      const categories = categorySlug
        ? await categoryService.findAllCategoryById(categorySlug.id)
        : [];

      // Lấy dữ liệu manufacturer với phân trang
      const { count, rows } = await db.ManuFacturer.findAndCountAll({
        where: whereCondition ? whereCondition : {},
        limit: limit,
        offset: offSet,
      });

      // Map kết quả để thêm dữ liệu category vào manufacturer
      const result = rows?.map((item) => ({
        ...item.toJSON(),
        categoryData:
          categories.find((cat) => cat.id === item.categoryId) || null,
      }));

      console.log("Rows: ", rows);

      // Trả về tổng số lượng và các manufacturer đã lọc
      return { count, rows: result };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  //Find all manufacturers

  async findAll() {
    try {
      const getAllManufacturer = await db.ManuFacturer.findAll();

      const categoryIds = [
        ...new Set(getAllManufacturer.map((item) => item.categoryId)),
      ];

      const categories = await categoryService.findAllCategoryById(categoryIds);

      const result = getAllManufacturer.map((item) => ({
        ...item.toJSON(),
        categoryData:
          categories.find((cat) => cat.id === item.categoryId)?.toJSON() ||
          null,
      }));

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Get all manufacturers

  async getAllManufacturer(limit, offSet) {
    try {
      const { count, rows } = await db.ManuFacturer.findAndCountAll({
        limit: limit,
        offset: offSet,
      });

      const categoryIds = [...new Set(rows?.map((item) => item.categoryId))];

      const categories = await categoryService.findAllCategoryById(categoryIds);

      const result = rows?.map((item) => ({
        ...item.toJSON(),
        categoryData:
          categories.find((cat) => cat.id === item.categoryId)?.toJSON() ||
          null,
      }));

      return { count, rows: result };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Get one manufacturer by id

  async getOneManufacturerById(numberId) {
    try {
      const getOneManufacturerById = await db.ManuFacturer.findOne({
        where: {
          id: numberId,
        },
      });

      if (!getOneManufacturerById) {
        return { error: `Không tìm thấy Manufacturer by id ${numberId}` };
      }

      return getOneManufacturerById;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Get all manufacturer by id

  async getAllManufacturerById(numberId) {
    try {
      const getAllManufacturerById = await db.ManuFacturer.findAll({
        where: {
          id: numberId,
        },
      });

      if (!getAllManufacturerById) {
        return { error: `Không tìm thấy Manufacturer by id ${numberId}` };
      }

      return getAllManufacturerById;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Get one manufacturer by id category

  async getManufacturerByCategory(slug) {
    try {
      const category = await categoryService.getCategorySlug(slug);

      const getManufacturerByCategory = await db.ManuFacturer.findAll({
        include: [
          {
            model: db.Categories,
            as: "categoryData",
            where: {
              slug: slug,
            },
          },
        ],
      });

      const getManufacturerByCategory = category
        ? await db.ManuFacturer.findAll({
            where: {
              categoryId: category.id,
            },
          })
        : [];

      const result = getManufacturerByCategory.map((manufacturer) => ({
        ...manufacturer.toJSON(),
        categoryData: category.toJSON(), // Gắn thêm dữ liệu của category
      }));

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Create manufacturer

  async createManufacturer(categoryId, name, slug, file, visible) {
    try {
      const createManufacturer = await db.ManuFacturer.create({
        name,
        slug,
        categoryId,
        img: file,
        visible,
      });

      return createManufacturer;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Update manufacturer

  async updateManufacturer(categoryId, name, slug, id, file, visible) {
    console.log(categoryId, name, slug, id, file, visible);
    try {
      const getOneManufacturerById = await db.ManuFacturer.findOne({
        where: {
          id: id,
        },
      });

      if (!getOneManufacturerById) {
        return { error: `Không tìm thấy Manufacturer by id ${id}` };
      }

      const fileImg = file ? file : getOneManufacturerById.img;

      console.log(fileImg);

      const updateManufacturer = await db.ManuFacturer.update(
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

      if (updateManufacturer) {
        return { message: "update successfully!" };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Delete manufacturer

  async delManufacturer(id) {
    try {
      const getOneManufacturerById = await db.ManuFacturer.findOne({
        where: {
          id: id,
        },
      });

      if (!getOneManufacturerById) {
        return { error: `Không tìm thấy Manufacturer by id ${numberId}` };
      }

      const delManufacturer = await db.ManuFacturer.destroy({
        where: {
          id: id,
        },
      });

      if (delManufacturer) {
        return { message: "update successfully!" };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateManufacturerByVisible(id) {
    try {
      // Tìm đối tượng theo ID
      const checkManuFacturer = await db.ManuFacturer.findOne({
        where: {
          id,
        },
      });

      // Kiểm tra nếu đối tượng không tồn tại
      if (!checkManuFacturer) {
        return { error: "Đối tượng không tồn tại" };
      }

      const manuFacturer = checkManuFacturer.dataValues;

      if (manuFacturer.visible === false) {
        const updateManufacturer = await db.ManuFacturer.update(
          { visible: true },
          {
            where: {
              id,
            },
          }
        );

        if (updateManufacturer[0] > 0) {
          return { message: "Update visible thành công" };
        } else {
          return { error: "Update visible thất bại" };
        }
      } else if (manuFacturer.visible === true) {
        const updateManufacturer = await db.ManuFacturer.update(
          { visible: false },
          {
            where: {
              id,
            },
          }
        );
        if (updateManufacturer[0] > 0) {
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

module.exports = new ManufacturerService();
