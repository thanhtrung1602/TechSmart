const { Op } = require("sequelize");
const db = require("../../models/index");
const categoryService = require("../category/category.service");
const manufacturerService = require("../manufacturer/manufacturer.service");
class ProductService {
  async searchAll(query) {
    try {
      const searchCondition =
        query && query.trim() !== ""
          ? {
              [Op.or]: [
                { name: { [Op.iLike]: `%${query}%` } },
                { slug: { [Op.iLike]: `%${query}%` } },
              ],
            }
          : null;
  
      // Tìm kiếm sản phẩm với các liên kết đúng
      const { count, rows } = await db.Product.findAndCountAll({
        where: searchCondition,
        include: [
          {
            model: db.Categories,
            as: "categoryData", // Khớp với alias
          },
          {
            model: db.ManuFacturer,
            as: "manufacturerData", // Khớp với alias
          },
        ],
      });
  
      return {
        products: rows,
        categories: [...new Set(rows.map((product) => product.categoryData))],
        manufacturers: [...new Set(rows.map((product) => product.manufacturerData))],
      };
    } catch (error) {
      console.error("Error in searchAll:", error);
      throw new Error("Lỗi khi tìm kiếm dữ liệu.");
    }
  }
  

  async filteredProducts(
    limit,
    offSet,
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

      const manufacturerData =
        manufacturer && manufacturer !== "null"
          ? await manufacturerService.getOneManufacturerById(manufacturer)
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
        category && categorySlug && categorySlug.id
          ? { categoryId: categorySlug.id }
          : null;

      const manufacturerCondition =
        manufacturer && manufacturer !== "null"
          ? { manufacturerId: manufacturer }
          : null;

      const whereCondition = {
        [Op.and]: [
          categoryCondition,
          manufacturerCondition,
          searchCondition,
          visibleCondition,
        ].filter(Boolean),
      };

      const { count, rows } = await db.Product.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
          {
            model: db.ManuFacturer,
            as: "manufacturerData",
          },
        ],
        limit,
        offset: offSet,
      });

      return {
        count,
        rows,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllProducts(limit, offSet) {
    try {
      const products = await db.Product.findAndCountAll({
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
          {
            model: db.ManuFacturer,
            as: "manufacturerData",
          },
        ],
        limit: limit,
        offset: offSet,
      });

      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAllProductsById(id) {
    try {
      const products = await db.Product.findAll({
        where: {
          id,
        },
      });
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Get product by id

  async getProductById(id) {
    try {
      const product = await db.Product.findOne({
        where: { id: id },
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
          {
            model: db.ManuFacturer,
            as: "manufacturerData",
          },
        ],
      });

      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Get product by slug

  async getSlugProduct(slug) {
    try {
      const product = await db.Product.findOne({
        where: { slug: slug },
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
          {
            model: db.ManuFacturer,
            as: "manufacturerData",
          },
        ],
      });

      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Get products by price

  // sửa
  async getProductPrice(minPrice, maxPrice) {
    try {
      const products = await db.Product.findAll({
        where: {
          price: {
            [Op.between]: [minPrice, maxPrice],
          },
        },
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
          {
            model: db.ManuFacturer,
            as: "manufacturerData",
          },
        ],
      });

      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Get products by visible
  // sửa
  async getProductVisible(visible) {
    try {
      const products = await db.Product.findAll({
        where: {
          visible,
        },
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
          {
            model: db.ManuFacturer,
            as: "manufacturerData",
          },
        ],
      });

      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Get products by manufacturer

  //sửa
  async getProductByManufacturer(
    manufacturerId,
    limit,
    offSet,
    minPrice,
    maxPrice
  ) {
    try {
      const products = await db.Product.findAndCountAll({
        where: {
          price: {
            [Op.between]: [minPrice, maxPrice],
          },
        },
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
          {
            model: db.ManuFacturer,
            as: "manufacturerData",
            where: {
              id: manufacturerId,
            },
          },
        ],
        limit: limit,
        offset: offSet,
      });

      return products;
    } catch (error) {
      throw new Error(error);
    }
  }

  //Get products all manufacturers
  async getProductOfManufacturerCategoryAndPrice(
    manufacturerSlug,
    categorySlug,
    limit,
    offSet,
    minPrice,
    maxPrice
  ) {
    try {
      const productOfManufacturerCategoryAndPrice =
        await db.Product.findAndCountAll({
          where: {
            price: {
              [Op.between]: [minPrice, maxPrice],
            },
          },
          include: [
            {
              model: db.ManuFacturer,
              as: "manufacturerData",
              where: {
                slug: manufacturerSlug,
              },
              include: [
                {
                  model: db.Categories,
                  as: "categoryData",
                  where: {
                    slug: categorySlug,
                  },
                },
              ],
            },
            {
              model: db.Categories,
              as: "categoryData",
            },
          ],
          limit: limit,
          offset: offSet,
        });

      return productOfManufacturerCategoryAndPrice;
    } catch (error) {
      console.error("Detailed error:", error);
      throw new Error("Error fetching products");
    }
  }

  //Get products hot

  async getProductsHot() {
    try {
      const products = await db.Product.findAll({
        where: {
          hot: {
            [Op.gte]: 50,
          },
        },
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
          {
            model: db.ManuFacturer,
            as: "manufacturerData",
          },
        ],
        order: [["hot", "DESC"]],
      });
      return products;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProductsPoor() {
    try {
      const products = await db.Product.findAll({
        where: {
          hot: {
            [Op.lte]: 10,
          },
        },
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
          {
            model: db.ManuFacturer,
            as: "manufacturerData",
          },
        ],
        order: [["hot", "ASC"]],
      });
      return products;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Get products by discount
  async getProductByDiscount(discount) {
    try {
      const byDiscount = await db.Product.findAndCountAll({
        where: {
          discount: discount,
        },
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
          {
            model: db.ManuFacturer,
            as: "manufacturerData",
          },
        ],
      });

      return byDiscount;
    } catch (error) {
      console.error("Detailed error:", error);
      throw new Error("Error fetching products by discount");
    }
  }

  // Get products by discount and category
  async getProductCategoryDiscount(discount, slug) {
    try {
      const byDiscount = await db.Product.findAndCountAll({
        where: {
          discount: discount,
        },
        include: [
          {
            model: db.Categories,
            as: "categoryData",
            where: {
              slug: slug,
            },
          },
          {
            model: db.ManuFacturer,
            as: "manufacturerData",
          },
        ],
      });

      return byDiscount;
    } catch (error) {
      console.error("Detailed error:", error);
      throw new Error("Error fetching products by discount and category");
    }
  }

  //Get products all category

  async getProductAllCategory(slug, minPrice, maxPrice) {
    try {
      const productAllCategory = await db.Product.findAndCountAll({
        where: {
          price: {
            [Op.between]: [minPrice, maxPrice],
          },
        },
        include: [
          {
            model: db.Categories,
            as: "categoryData",
            where: {
              slug: slug,
            },
          },
          {
            model: db.ManuFacturer,
            as: "manufacturerData",
          },
        ],
      });

      return productAllCategory;
    } catch (error) {
      console.error("Detailed error:", error);
      throw new Error("Error fetching products by category");
    }
  }

  //Get products all manufacturer

  async getProductAllManufacturer(id, minPrice, maxPrice) {
    try {
      // Lấy tất cả sản phẩm trong khoảng giá
      const products = await db.Product.findAll({
        where: {
          price: {
            [Op.between]: [minPrice, maxPrice],
          },
          manufacturerId: id,
        },
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
          {
            model: db.ManuFacturer,
            as: "manufacturerData",
          },
        ],
      });

      return products;
    } catch (error) {
      console.error("Detailed error:", error);
      throw new Error("Error fetching products by manufacturer");
    }
  }

  //Get products by category
  async getProductByCategory(slug, minPrice, maxPrice, limit, offSet) {
    try {
      const { count, rows } = await db.Product.findAndCountAll({
        where: {
          price: {
            [Op.between]: [minPrice, maxPrice],
          },
        },
        include: [
          {
            model: db.Categories,
            as: "categoryData",
            where: {
              slug: slug,
            },
          },
          {
            model: db.ManuFacturer,
            as: "manufacturerData",
          },
        ],
      });

      return { count, rows };
    } catch (error) {
      console.error("Detailed error:", error);
      throw new Error("Error fetching products by category");
    }
  }

  //Cập nhật số lướng stock trong database

  async updateStock(id, quantity) {
    try {
      const product = await db.Product.findOne({
        where: { id },
      });

      if (!product) {
        return "Không tìm thấy sản phẩm";
      }

      if (product.stock > 0 || quantity > 0) product.stock -= quantity;

      await product.save();
      return "Đã giảm số lượng trong kho";
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Thêm số lượng hot

  async increaseHot(id, quantity) {
    try {
      const product = await db.Product.findOne({
        where: { id },
      });

      if (!product) {
        return "Không tìm thấy sản phẩm";
      }

      if (product.hot > 0 || quantity > 0) product.hot += quantity;

      await product.save();
      return "Đã tăng số lượng hot";
    } catch (error) {
      throw Error(error);
    }
  }

  //Thêm sản phẩm trong database

  async createProduct(
    { categoryId, manufacturerId, name, price, discount, stock, visible },
    file,
    slug
  ) {
    try {

      const categoryNumberId = parseInt(categoryId);
      const manufacturerNumberId = parseInt(manufacturerId);

      const [product, created] = await db.Product.findOrCreate({
        where: { name, slug },
        defaults: {
          categoryId: categoryNumberId,
          manufacturerId: manufacturerNumberId,
          price,
          discount,
          img: file,
          stock,
          visible,
        },
      });

      if (!created) {
        return { error: "Sản phẩm này đã có trong store" };
      }

      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Cập nhật sản phẩm trong database

  async updateProduct(
    id,
    name,
    categoryId,
    manufacturerId,
    discount,
    visible,
    file,
    slug
  ) {
    try {
      const product = await db.Product.findByPk(id);

      if (!product) {
        return { error: "Sản phẩm không có trong store" };
      }

      const fileImg = file ? file : product.img;

      const updatedProduct = await product.update({
        categoryId,
        manufacturerId,
        name,
        slug,
        discount,
        img: fileImg,
        visible,
      });
      if (updatedProduct) {
        return updatedProduct;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Xóa sản phẩm trong database

  async deleteProduct(id) {
    try {
      const product = await db.Product.findByPk(id);

      if (!product) {
        return { error: "Sản phẩm không có trong store" };
      }

      const deletedProduct = await db.Product.destroy({
        where: { id },
      });

      if (deletedProduct) {
        return { message: "Xoa thanh cong" };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Find all

  async findAll() {
    try {
      const getAll = await db.Product.findAll({
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
          {
            model: db.ManuFacturer,
            as: "manufacturerData",
          },
        ],
      });

      return getAll;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Check stock

  async checkStock(id) {
    try {
      const product = await db.Product.findByPk(id);

      if (!product) {
        return "Không tìm thấy sản phẩm";
      }

      return product.stock;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateProductByVisible(id) {
    try {
      // Tìm đối tượng theo ID
      const checkProduct = await db.Product.findOne({
        where: {
          id,
        },
      });

      // Kiểm tra nếu đối tượng không tồn tại
      if (!checkProduct) {
        return { error: "Đối tượng không tồn tại" };
      }

      const product = checkProduct.dataValues;

      if (product.visible === false) {
        const updateProduct = await db.Product.update(
          { visible: true },
          {
            where: {
              id,
            },
          }
        );

        if (updateProduct[0] > 0) {
          return { message: "Update visible thành công" };
        } else {
          return { error: "Update visible thất bại" };
        }
      } else if (product.visible === true) {
        const updateProduct = await db.Product.update(
          { visible: false },
          {
            where: {
              id,
            },
          }
        );
        if (updateProduct[0] > 0) {
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

module.exports = new ProductService();
