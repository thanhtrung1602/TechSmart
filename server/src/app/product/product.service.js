const { Op } = require("sequelize");
const db = require("../../models/index");
const categoryService = require("../category/category.service");
const manufacturerService = require("../manufacturer/manufacturer.service");
class ProductService {
  async searchAll(query) {
    try {
      // Điều kiện tìm kiếm sản phẩm
      const searchCondition =
        query && query.trim() !== ""
          ? {
              [Op.or]: [
                { name: { [Op.iLike]: `%${query}%` } },
                { slug: { [Op.iLike]: `%${query}%` } },
              ],
            }
          : null;

      // Tìm kiếm sản phẩm
      const { count, rows } = await db.Product.findAndCountAll({
        where: searchCondition,
      });

      // Lấy danh sách categoryId và manufacturerId từ sản phẩm
      const categoryIds = [
        ...new Set(rows.map((product) => product.categoryId)),
      ];
      const manufacturerIds = [
        ...new Set(rows.map((product) => product.manufacturerId)),
      ];

      // Tìm kiếm danh mục
      const categories =
        categoryIds.length > 0
          ? await db.Categories.findAll({
              where: { id: { [Op.in]: categoryIds } },
            })
          : [];

      // Tìm kiếm hãng sản xuất
      const manufacturers =
        manufacturerIds.length > 0
          ? await db.ManuFacturer.findAll({
              where: { id: { [Op.in]: manufacturerIds } },
            })
          : [];

      // Gắn dữ liệu danh mục và hãng sản xuất vào sản phẩm
      const products = rows.map((product) => ({
        ...product.toJSON(),
        categoryData:
          categories.find((c) => c.id === product.categoryId) || null,
        manufacturerData:
          manufacturers.find((m) => m.id === product.manufacturerId) || null,
      }));

      // Trả về kết quả
      return {
        products,
        categories,
        manufacturers,
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
        visible === true || visible === false
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

      const categories = categorySlug
        ? await db.Categories.findAll({ where: { slug: category } })
        : [];
      const manufacturers = manufacturerData
        ? await db.ManuFacturer.findAll({ where: { id: manufacturer } })
        : [];

      const { count, rows } = await db.Product.findAndCountAll({
        where: whereCondition,
        limit,
        offset: offSet,
      });

      const result = {
        count,
        rows: rows.map((product) => ({
          ...product.toJSON(),
          categoryData: categories.find((c) => c.id === product.categoryId),
          manufacturerData: manufacturers.find(
            (m) => m.id === product.manufacturerId
          ),
        })),
      };

      if (!result) {
        return { error: "Not found" };
      }

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllProducts(limit, offSet) {
    try {
      // const products = await db.Product.findAll();

      const products = await db.Product.findAndCountAll({
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
        ],
        limit: limit,
        offset: offSet,
      });

      const categoryIds = [...new Set(products.map((p) => p.categoryId))];
      const manufacturerIds = [
        ...new Set(products.map((p) => p.manufacturerId)),
      ];

      const [categories, manufacturers] = await Promise.all([
        db.Categories.findAll({ where: { id: categoryIds } }),
        db.ManuFacturer.findAll({ where: { id: manufacturerIds } }),
      ]);

      const paginatedProducts = products.slice(offSet, offSet + limit);

      const result = {
        count: products.length,
        rows: paginatedProducts.map((product) => ({
          ...product.toJSON(),
          categoryData: categories.find((c) => c.id === product.categoryId),
          manufacturerData: manufacturers.find(
            (m) => m.id === product.manufacturerId
          ),
        })),
      };

      if (!result) {
        return { error: "Not found" };
      }

      return result;
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
        ],
      });

      const category = await categoryService.getCategoryById(
        product.categoryId
      );
      const manufacturer = await manufacturerService.getOneManufacturerById(
        product.manufacturerId
      );

      const result = {
        ...product.toJSON(),
        categoryData: category,
        manufacturerData: manufacturer,
      };

      if (!result) {
        return { error: "Not found" };
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Get product by slug

  async getSlugProduct(slug) {
    try {
      const product = await db.Product.findOne({
        where: { slug: slug },
      });

      const product = await db.Product.findOne({
        where: { id: id },
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
        ],
      });

      const category = await categoryService.getCategoryById(
        product.categoryId
      );
      const manufacturer = await manufacturerService.getOneManufacturerById(
        product.manufacturerId
      );

      const result = {
        ...product.toJSON(),
        categoryData: category,
        manufacturerData: manufacturer,
      };

      if (!result) {
        return { error: "Not found" };
      }
      return result;
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
      });

      const categoryIds = [...new Set(products.map((p) => p.categoryId))];
      const manufacturerIds = [
        ...new Set(products.map((p) => p.manufacturerId)),
      ];

      const [categories, manufacturers] = await Promise.all([
        db.Categories.findAll({ where: { id: categoryIds } }),
        db.ManuFacturer.findAll({ where: { id: manufacturerIds } }),
      ]);

      const result = products.map((product) => ({
        ...product.toJSON(),
        categoryData: categories.find((c) => c.id === product.categoryId),
        manufacturerData: manufacturers.find(
          (m) => m.id === product.manufacturerId
        ),
      }));

      if (!result) {
        return { error: "Not found" };
      }

      return result;
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
      });

      const categoryIds = [...new Set(products.map((p) => p.categoryId))];
      const manufacturerIds = [
        ...new Set(products.map((p) => p.manufacturerId)),
      ];

      const [categories, manufacturers] = await Promise.all([
        db.Categories.findAll({ where: { id: categoryIds } }),
        db.ManuFacturer.findAll({ where: { id: manufacturerIds } }),
      ]);

      const result = products.map((product) => ({
        ...product.toJSON(),
        categoryData: categories.find((c) => c.id === product.categoryId),
        manufacturerData: manufacturers.find(
          (m) => m.id === product.manufacturerId
        ),
      }));

      if (!result) {
        return { error: "Not found" };
      }

      return result;
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
      const products = await db.Product.findAll({
        where: {
          manufacturerId,
          price: {
            [Op.between]: [minPrice, maxPrice],
          },
        },
      });

      const products = await db.Product.findAndCountAll({
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
              id: manufacturerId,
            },
          },
        ],
        limit: limit,
        offset: offSet,
      });

      const categoryIds = [...new Set(products.map((p) => p.categoryId))];
      const manufacturerIds = [
        ...new Set(products.map((p) => p.manufacturerId)),
      ];

      const [categories, manufacturers] = await Promise.all([
        db.Categories.findAll({ where: { id: categoryIds } }),
        db.ManuFacturer.findAll({ where: { id: manufacturerIds } }),
      ]);

      const paginatedProducts = products.slice(offSet, offSet + limit);

      const result = {
        count: products.length,
        rows: paginatedProducts.map((product) => ({
          ...product.toJSON(),
          categoryData: categories.find((c) => c.id === product.categoryId),
          manufacturerData: manufacturers.find(
            (m) => m.id === product.manufacturerId
          ),
        })),
      };

      if (!result) {
        return { error: "Not found" };
      }

      return result;
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
      // Lấy tất cả sản phẩm theo mức giá
      const products = await db.Product.findAll({
        where: {
          price: {
            [Op.between]: [minPrice, maxPrice],
          },
        },
      });

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

      const category = await db.Categories.findOne({
        where: {
          slug: categorySlug,
        },
      });

      // Truy vấn manufacturer và category từ slug
      const manufacturer = await db.ManuFacturer.findOne({
        where: {
          slug: manufacturerSlug,
          categoryId: category.id,
        },
      });

      // Lọc các sản phẩm theo manufacturerId và categoryId
      const filteredProducts = products.filter(
        (product) =>
          product.manufacturerId === manufacturer.id &&
          product.categoryId === category.id
      );

      //Lấy thông tin của manu và cate
      const categoryIds = [
        ...new Set(filteredProducts.map((p) => p.categoryId)),
      ];
      const manufacturerIds = [
        ...new Set(filteredProducts.map((p) => p.manufacturerId)),
      ];

      const [categories, manufacturers] = await Promise.all([
        db.Categories.findAll({ where: { id: categoryIds } }),
        db.ManuFacturer.findAll({ where: { id: manufacturerIds } }),
      ]);

      //Phân trang
      const paginatedProducts = filteredProducts.slice(offSet, offSet + limit);

      const result = {
        count: filteredProducts.length,
        rows: paginatedProducts.map((product) => ({
          ...product.toJSON(),
          categoryData: categories.find((c) => c.id === product.categoryId),
          manufacturerData: manufacturers.find(
            (m) => m.id === product.manufacturerId
          ),
        })),
      };

      if (!result) {
        return { error: "Not found" };
      }

      return result;
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
      // Truy vấn các sản phẩm có discount
      const products = await db.Product.findAll({
        where: {
          discount: discount,
        },
      });

      const byDiscount = await db.Product.findAndCountAll({
        where: {
          discount: discount,
        },
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
        ],
      });

      // Truy vấn tất cả các category
      const categories = await db.Categories.findAll();
      const manufacturers = await db.ManuFacturer.findAll();

      // Lọc các sản phẩm theo categoryId nếu cần (có thể tùy chỉnh thêm nếu cần)
      const result = {
        count: products.length,
        rows: products.map((product) => {
          // Lấy category tương ứng từ danh sách categories
          const category = categories.find(
            (cat) => cat.id === product.categoryId
          );
          // Lấy manufacturer tương ứng từ danh sách manufacturers
          const manufacturer = manufacturers.find(
            (manu) => manu.id === product.manufacturerId
          );
          return {
            ...product.toJSON(),
            categoryData: category || null, // Lấy thông tin category nếu có
            manufacturerData: manufacturer || null, // Lấy thông tin manufacturer nếu có
          };
        }),
      };

      if (!result) {
        return { error: "Not found" };
      }

      return result;
    } catch (error) {
      console.error("Detailed error:", error);
      throw new Error("Error fetching products by discount");
    }
  }

  // Get products by discount and category
  async getProductCategoryDiscount(discount, slug) {
    try {
      // Truy vấn các sản phẩm có discount
      const products = await db.Product.findAll({
        where: {
          discount: discount,
        },
      });

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
        ],
      });
      // Truy vấn tất cả các category với slug
      const categories = await db.Categories.findAll({
        where: {
          slug: slug,
        },
      });

      // Lọc các sản phẩm thuộc về category
      const result = {
        count: products.length,
        rows: products
          .filter((product) => {
            return categories.some(
              (category) => category.id === product.categoryId
            );
          })
          .map((product) => {
            const category = categories.find(
              (cat) => cat.id === product.categoryId
            );
            return {
              ...product.toJSON(),
              categoryData: category, // Lấy thông tin category nếu có
            };
          }),
      };

      if (!result) {
        return { error: "Not found" };
      }

      return result;
    } catch (error) {
      console.error("Detailed error:", error);
      throw new Error("Error fetching products by discount and category");
    }
  }

  //Get products all category

  async getProductAllCategory(slug, minPrice, maxPrice) {
    try {
      // Lấy tất cả sản phẩm trong khoảng giá
      const products = await db.Product.findAll({
        where: {
          price: {
            [Op.between]: [minPrice, maxPrice],
          },
        },
      });

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
        ],
      });

      // Lấy thông tin category từ slug
      const category = await db.Categories.findOne({
        where: { slug: slug },
      });

      // Lọc các sản phẩm thuộc category đã tìm được
      const filteredProducts = products.filter(
        (product) => product.categoryId === category.id
      );

      // Lấy tất cả manufacturer mà các sản phẩm thuộc về
      const manufacturerIds = [
        ...new Set(filteredProducts.map((p) => p.manufacturerId)),
      ];
      const manufacturers = await db.ManuFacturer.findAll({
        where: { id: manufacturerIds },
      });

      // Thêm thông tin category và manufacturer vào từng sản phẩm
      const result = {
        count: filteredProducts.length,
        rows: filteredProducts.map((product) => ({
          ...product.toJSON(), // Convert product to plain object
          categoryData: category, // Thêm thông tin category vào mỗi product
          manufacturerData: manufacturers.find(
            (mfg) => mfg.id === product.manufacturerId
          ), // Thêm thông tin manufacturer vào mỗi product
        })),
      };

      if (!result) {
        return { error: "Not found" };
      }

      return result;
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
      });

      // Lấy thông tin manufacturer từ id
      const manufacturer = await db.ManuFacturer.findOne({
        where: { id: id },
      });

      //Thêm thống tin category vào từng san pham
      const categoryIds = [...new Set(products.map((p) => p.categoryId))];
      const categories = await db.Categories.findAll({
        where: { id: categoryIds },
      });

      const result = {
        count: products.length,
        rows: products.map((product) => ({
          ...product.toJSON(), // Convert product to plain object
          categoryData: categories.find((cat) => cat.id === product.categoryId), // Thêm thông tin category vào mỗi product
          manufacturerData: manufacturer, // Thêm thông tin manufacturer vào một product
        })),
      };

      if (!result) {
        return { error: "Not found" };
      }

      return result;
    } catch (error) {
      console.error("Detailed error:", error);
      throw new Error("Error fetching products by manufacturer");
    }
  }

  //Get products by category
  async getProductByCategory(slug, minPrice, maxPrice, limit, offSet) {
    try {
      // Lấy tất cả sản phẩm trong khoảng giá (không phân trang)
      const products = await db.Product.findAll({
        where: {
          price: {
            [Op.between]: [minPrice, maxPrice],
          },
        },
      });

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
        ],
      });

      // Lấy thông tin category từ slug
      const category = await db.Categories.findOne({
        where: { slug: slug },
      });

      // Lọc các sản phẩm thuộc category đã tìm được
      const filteredProducts = products.filter(
        (product) => product.categoryId === category.id
      );

      // Thực hiện phân trang sau khi đã lọc các sản phẩm
      const paginatedProducts = filteredProducts.slice(offSet, offSet + limit);

      // Lấy tất cả manufacturers liên quan đến các sản phẩm đã lọc
      const manufacturerIds = [
        ...new Set(filteredProducts.map((p) => p.manufacturerId)),
      ];
      const manufacturers = await db.ManuFacturer.findAll({
        where: { id: manufacturerIds },
      });

      // Thêm thông tin category và manufacturer vào từng sản phẩm
      const result = paginatedProducts.map((product) => ({
        ...product.toJSON(), // Chuyển product thành plain object
        categoryData: category, // Thêm thông tin category vào mỗi product
        manufacturerData: manufacturers.find(
          (mfg) => mfg.id === product.manufacturerId
        ), // Thêm thông tin manufacturer vào mỗi product
      }));

      if (!result) {
        return { error: "Not found" };
      }

      return { count: filteredProducts.length, rows: result };
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
      const [product, created] = await db.Product.findOrCreate({
        where: { name, slug },
        defaults: {
          categoryId,
          manufacturerId,
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
    price,
    discount,
    stock,
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
        price,
        discount,
        img: fileImg,
        stock,
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
      const getAll = await db.Product.findAll({});

      const getAll = await db.Product.findAll({
        include: [
          {
            model: db.Categories,
            as: "categoryData",
          },
        ],
      });

      const categoryIds = [...new Set(getAll.map((p) => p.categoryId))];
      const manufacturerIds = [...new Set(getAll.map((p) => p.manufacturerId))];

      const [categories, manufacturers] = await Promise.all([
        db.Categories.findAll({ where: { id: categoryIds } }),
        db.ManuFacturer.findAll({ where: { id: manufacturerIds } }),
      ]);

      const result = getAll.map((product) => ({
        ...product.toJSON(),
        categoryData: categories.find((c) => c.id === product.categoryId),
        manufacturerData: manufacturers.find(
          (m) => m.id === product.manufacturerId
        ),
      }));

      if (!result) {
        return "Không tìm thấy sản phẩm";
      }

      return result;
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
