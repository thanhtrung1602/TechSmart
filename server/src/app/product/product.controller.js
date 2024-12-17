const asyncWrapper = require("../../middleware/async");
const productService = require("./product.service");
const { getKey, setKey } = require("../../db/init.redis");
const { client } = require("../../db/init.elastic");
const socket = require("../../module/socket");
const {
  saveProductsToElasticsearch,
  deleteProductFromElasticsearch,
} = require("../../helpers/handleElastic");
const { removeVietnameseTones } = require("../../helpers/utils");
class ProductController {
  //search enter
  search = asyncWrapper(async (req, res) => {
    const query = req.query.s?.toString().trim().toLowerCase();

    console.log("query: ", query);

    if (!query) {
      return res.status(400).json({ message: "Query không được để trống." });
    }

    try {
      // Gọi service để lấy dữ liệu
      const results = await productService.searchAll(query);

      // Kiểm tra nếu không có kết quả
      if (
        !results.products.length &&
        !results.categories.length &&
        !results.manufacturers.length
      ) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy kết quả phù hợp." });
      }

      // Trả về kết quả
      return res.status(200).json({ success: true, data: results });
    } catch (error) {
      console.error("Error searching:", error);
      return res.status(500).json({ message: "Lỗi hệ thống khi tìm kiếm." });
    }
  });

  // end-enter

  searchProduct = asyncWrapper(async (req, res) => {
    const { q } = req.query;
    console.log("query: ", q);
    const products = await client.search({
      index: "products",
      size: 3,
      _source: ["img", "name", "slug", "price"],
      body: {
        query: {
          match_phrase_prefix: {
            name: q,
          },
        },
      },
    });

    return res.status(200).json(products.body.hits.hits);
  });

  //filteredProducts

  filteredProducts = asyncWrapper(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const category = req.query.category || null;
    const manufacturer = req.query.manufacturer || null;
    const search = req.query.search || "";
    const visible = req.query.visible || null;

    console.log("Visible: ", visible);

    const limit = size;
    const offSet = (page - 1) * size;

    const { count, rows } = await productService.filteredProducts(
      limit,
      offSet,
      category,
      manufacturer,
      search,
      visible
    );

    if (!rows) {
      return res.status(400).json({ message: "Khong tim thay san pham" });
    }

    // Trả về danh sách sản phẩm cùng với tổng số sản phẩm
    return res.status(200).json({
      total: count, // tổng số sản phẩm
      rows: rows, // danh sách sản phẩm
    });
  });

  //Get all products

  getAllProducts = asyncWrapper(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    const limit = size;
    const offSet = (page - 1) * size;

    const { count, rows } = await productService.getAllProducts(limit, offSet); // count là tổng số sản phẩm

    if (!rows) {
      return res.status(400).json({ message: "Khong tim thay san pham" });
    }

    // Trả về danh sách sản phẩm cùng với tổng số sản phẩm
    return res.status(200).json({
      total: count, // tổng số sản phẩm
      rows: rows, // danh sách sản phẩm
    });
  });

  //Get product by slug

  getSlugProduct = asyncWrapper(async (req, res) => {
    const slug = req.params.slug;

    if (!slug) {
      return res.status(500).json({ error: "invalid slug" });
    }
    const product = await productService.getSlugProduct(slug);

    return res.status(200).json(product);
  });

  //Get product by id

  getOneProductById = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(500).json({ error: "invalid id" });
    }

    const product = await productService.getProductById(id);
    return res.status(200).json(product);
  });

  //Get products by price

  getProductPrice = asyncWrapper(async (req, res) => {
    const { minPrice, maxPrice } = req.query;

    const min = parseInt(minPrice);
    const max = parseInt(maxPrice);

    if (min === null) {
      min = 0;
    }
    if (max === null) {
      max = 99999999;
    }

    const products = await productService.getProductPrice(min, max);

    if (!products) {
      return res.status(400).json({ message: "Không có sản phẩm" });
    }

    return res.status(200).json(products);
  });

  //Get products by visible

  getProductVisible = asyncWrapper(async (req, res) => {
    const { visible } = req.query;

    if (visible === null) {
      return res.status(400).json({ message: "Không tìm thấy" });
    }

    const products = await productService.getProductVisible(visible);

    if (!products) {
      return res.status(400).json({ message: "Không có sản phẩm" });
    }

    return res.status(200).json(products);
  });

  //Get products by manufacturer

  getProductByManufacturer = asyncWrapper(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const minPrice = parseInt(req.query.minPrice) || 1;
    const maxPrice = parseInt(req.query.maxPrice) || 999999999999999;

    const limit = size;
    const offSet = (page - 1) * size;
    const manufacturerId = parseInt(req.params.id);

    if (!manufacturerId) {
      return res.status(400).json({ message: "Không tìm thấy" });
    }

    const products = await productService.getProductByManufacturer(
      manufacturerId,
      limit,
      offSet,
      minPrice,
      maxPrice
    );

    if (!products) {
      return res.status(400).json({ message: "Không tìm thấy" });
    }
    return res.status(200).json(products);
  });

  //Get products maunfacturer and price

  getProductOfManufacturerCategoryAndPrice = asyncWrapper(async (req, res) => {
    const minPrice = parseInt(req.query.minPrice) || 1;
    const maxPrice = parseInt(req.query.maxPrice) || 999999999999999;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    const limit = size;
    const offSet = (page - 1) * size;

    const categorySlug = req.params.categorySlug;

    const manufacturerSlug = req.params.manufacturerSlug;

    console.log(categorySlug, manufacturerSlug);

    const { count, rows } =
      await productService.getProductOfManufacturerCategoryAndPrice(
        manufacturerSlug,
        categorySlug,
        limit,
        offSet,
        minPrice,
        maxPrice
      );

    if (!rows) {
      return res.status(400).json({ message: "Không tìm thấy" });
    }

    return res.status(200).json({
      total: count,
      rows: rows,
    });
  });

  //Get products hot

  getProductsHot = asyncWrapper(async (req, res) => {
    const products = await productService.getProductsHot();

    if (!products) {
      return res.status(400).json({ message: "Không tìm thấy" });
    }

    return res.status(200).json(products);
  });

  //Get products poor

  getProductsPoor = asyncWrapper(async (req, res) => {
    const products = await productService.getProductsPoor();

    if (!products) {
      return res.status(400).json({ message: "Không tìm thấy" });
    }

    return res.status(200).json(products);
  });

  //Suggest product

  suggestProduct = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const suggestProduct = await productService.suggestProduct(id);
    return res.status(200).json(suggestProduct);
  });

  //Get products by discount

  getProductByDiscount = asyncWrapper(async (req, res) => {
    const discount = parseInt(req.params.discount);

    if (!discount) {
      return res.status(400).json({ message: "Không tìm thấy ", discount });
    }

    const getProductByDiscount = await productService.getProductByDiscount(
      discount
    );

    if (!getProductByDiscount) {
      return res.status(400).json({ message: "Không tìm thấy " });
    }

    return res.status(200).json(getProductByDiscount.rows);
  });

  //Get products by discount and category

  getProductCategoryAndDiscount = asyncWrapper(async (req, res) => {
    const slug = req.params.slug;
    const discount = parseInt(req.params.discount);

    if (!discount) {
      return res.status(400).json({ message: "Không tìm thấy ", discount });
    }

    if (!slug) {
      return res.status(400).json({ message: "Không tìm thấy ", slug });
    }

    const getProductCategoryDiscount =
      await productService.getProductCategoryDiscount(discount, slug);

    if (!getProductCategoryDiscount) {
      return res.status(400).json({ message: "Không tìm thấy " });
    }

    return res.status(200).json(getProductCategoryDiscount.rows);
  });

  //Get products all category

  getProductAllCategory = asyncWrapper(async (req, res) => {
    const slug = req.params.slug;
    const minPrice = parseInt(req.query.minPrice) || 1;
    const maxPrice = parseInt(req.query.maxPrice) || 999999999999999;

    if (!slug) {
      return res.status(400).json({ message: "Không tìm thấy: ", slug });
    }

    const getProductAllCategory = await productService.getProductAllCategory(
      slug,
      minPrice,
      maxPrice
    );

    if (!getProductAllCategory) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy productsAllCategory" });
    }

    return res.status(200).json(getProductAllCategory);
  });

  //Get products all manufacturer

  getProductAllManufacturer = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const minPrice = parseInt(req.query.minPrice) || 1;
    const maxPrice = parseInt(req.query.maxPrice) || 999999999999999;

    if (!id) {
      return res.status(400).json({ message: "Không tìm thấy: ", id });
    }

    const getProductAllManufacturer =
      await productService.getProductAllManufacturer(id, minPrice, maxPrice);

    if (!getProductAllManufacturer) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy productsAllManufacturer" });
    }

    return res.status(200).json(getProductAllManufacturer);
  });

  //Get products category

  getProductByCategory = asyncWrapper(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const minPrice = parseInt(req.query.minPrice) || 1;
    const maxPrice = parseInt(req.query.maxPrice) || 999999999999999;

    const limit = size;
    const offSet = (page - 1) * size;

    const slug = req.params.slug;

    if (!slug) {
      return res.status(400).json({ message: "Không tìm thấy: ", slug });
    }

    const getProductByCategory = await productService.getProductByCategory(
      slug,
      minPrice,
      maxPrice,
      limit,
      offSet
    );

    if (!getProductByCategory) {
      return res.status(400).json({ message: "Không tìm thấy" });
    }

    return res.status(200).json(getProductByCategory);
  });

  //Create product

  createProduct = asyncWrapper(async (req, res) => {
    const file = req.file ? req.file.path : null;
    const {
      categoryId,
      manufacturerId,
      name,
      price,
      discount,
      stock,
      visible,
    } = req.body;

    console.log(req.body);

    if (!file || !manufacturerId || !name || !categoryId) {
      return res.status(400).json("invalid value");
    }
    const hashSlug = removeVietnameseTones(name)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const product = await productService.createProduct(
      req.body,
      file,
      hashSlug
    );

    // await saveProductsToElasticsearch(product);
    if (!product) {
      return res.status(400).json({ message: "Không có sản phẩm" });
    }

    return res.status(200).json(product);
  });

  //Update product

  updateProduct = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const file = req.file ? req.file.path : null;

    const {
      name,
      categoryId,
      manufacturerId,
      discount,
      visible,
    } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: "Không phải là số ", id });
    }

    const hashSlug = removeVietnameseTones(name)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const parseCategoryId = parseInt(categoryId);
    const parseManufacturerId = parseInt(manufacturerId);
    const parseDiscount = parseInt(discount);

    console.log(
      id,
      name,
      parseCategoryId,
      parseManufacturerId,
      parseDiscount,
      visible,
      file,
      hashSlug
    );

    const updatedProduct = await productService.updateProduct(
      id,
      name,
      parseCategoryId,
      parseManufacturerId,
      parseDiscount,
      visible,
      file,
      hashSlug
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Không thay đổi product" });
    }

    //Đồng bộ khi update
    const io = socket.getIo();
    io.emit("updateProduct", {
      updatedProduct,
    });

    return res.status(200).json(updatedProduct);
  });

  updateProductStock = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);

    const updatedProduct = await productService.updateProductStock(
      id,
      req.body
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Không thay đổi product" });
    }

    //Đồng bộ khi update
    const io = socket.getIo();
    io.emit("updateProduct", {
      updatedProduct,
    });

    return res.status(200).json(updatedProduct);
  });

  //Delete product

  deleteProduct = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "Không phải là số ", id });
    }
    await deleteProductFromElasticsearch(id);

    const deletedProduct = await productService.deleteProduct(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Không thay đổi product" });
    }
    return res.status(200).json({ message: "Xóa product", id });
  });

  findAll = asyncWrapper(async (req, res) => {
    const findAll = await productService.findAll();
    return res.status(200).json(findAll);
  });

  //Check stock

  checkStock = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "Không phải là số ", id });
    }

    const checkStock = await productService.checkStock(id);

    if (!checkStock) {
      return res.status(404).json({ message: "Không tìm thấy product" });
    }

    // Trả về thông tin stock của sản phẩm
    return res.json({ id, checkStock });
  });

  updateProductByVisible = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(500).json({ error: "invalid id" });
    }
    const updateProductByVisible = await productService.updateProductByVisible(
      id
    );
    return res.status(200).json(updateProductByVisible);
  });
}

module.exports = new ProductController();
