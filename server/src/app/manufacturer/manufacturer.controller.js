const asyncWrapper = require("../../middleware/async");
const ManufacturerService = require("./manufacturer.service");
const { saveProductsToElasticsearch } = require("../../helpers/handleElastic");
const { removeVietnameseTones } = require("../../helpers/utils");

class ManufacturerController {
  //Find all manufacturers

  filteredManufacturer = asyncWrapper(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const category = req.query.category || "";
    const manufacturer = req.query.manufacturer || null;
    const search = req.query.search || "";
    const visible = req.query.visible  === "null" 


    const limit = size;
    const offSet = (page - 1) * size;
    const { count, rows } = await ManufacturerService.filteredManufacturer(limit, offSet, category, manufacturer, search,visible);

    if (!rows) {
      return res.status(400).json({ message: "Khong tim thay san pham" });
    }

    // Trả về danh sách sản phẩm cùng với tổng số sản phẩm
    return res.status(200).json({
      total: count, // tổng số sản phẩm
      rows // danh sách sản phẩm
    });
  });

  //Find all manufacturers
  findAll = asyncWrapper(async (req, res) => {
    const manufacturers = await ManufacturerService.findAll();

    if (!manufacturers) {
      return res.status(400).json({ message: "Khong tim thay san pham" });
    }

    // Trả về danh sách sản phẩm cùng với tổng số sản phẩm
    return res.status(200).json(manufacturers);
  });

  //Get all manufacturers

  getAllManufacturer = asyncWrapper(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    const limit = size;
    const offSet = (page - 1) * size;

    const { count, rows } = await ManufacturerService.getAllManufacturer(limit, offSet);

    if (!rows) {
      return res.status(400).json({ message: "Khong tim thay san pham" });
    }

    // Trả về danh sách sản phẩm cùng với tổng số sản phẩm
    return res.status(200).json({
      total: count, // tổng số sản phẩm
      rows // danh sách sản phẩm
    });
  });

  //Get one manufacturer by id

  getOneManufacturerById = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json("Invalid input: Id is required");
    }

    const getOneManufacturerById =
      await ManufacturerService.getOneManufacturerById(id);
    return res.status(200).json(getOneManufacturerById);
  });

  //Get all manufacturer by id

  getAllManufacturerById = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json("Invalid input: Id is required");
    }

    const getAllManufacturerById =
      await ManufacturerService.getAllManufacturerById(id);
    return res.status(200).json(getAllManufacturerById);
  });

  //Get one manufacturer by id category

  getManufacturerByCategory = asyncWrapper(async (req, res) => {
    const slug = req.params.slug;

    if (!slug) {
      return res.status(400).json("Invalid input: Slug is required");
    }

    const getManufacturerByCategory =
      await ManufacturerService.getManufacturerByCategory(slug);

    if (!getManufacturerByCategory) {
      return res.status(400).json("Invalid input: All fields are required");
    }

    return res.status(200).json(getManufacturerByCategory);
  });

  //Create manufacturer

  createManufacturer = asyncWrapper(async (req, res) => {
    const file = req.file.path;
    const { categoryId, name, slug } = req.body;

    const numberCategoryId = parseInt(categoryId);

    if (!categoryId || !name) {
      return res
        .status(400)
        .json("Invalid input: CategoryId and name are required");
    }

    const hashSlug = removeVietnameseTones(name)
      .toLowerCase()
      .replace(/\s+/g, "-");

    const createManufacturer = await ManufacturerService.createManufacturer(
      numberCategoryId,
      name,
      hashSlug,
      file
    );

    await saveProductsToElasticsearch(createManufacturer.dataValues);

    if (!createManufacturer) {
      return res.status(400).json("Invalid input: All fields are required");
    }

    return res.status(200).json(createManufacturer);
  });

  //Update manufacturer

  updateManufacturer = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const file = req.file ? req.file.path : null;
    const { categoryId, name, visible } = req.body;
    const numberCategoryId = parseInt(categoryId);

    const hashSlug = removeVietnameseTones(name)
      .toLowerCase()
      .replace(/\s+/g, "-");

    const updateManufacturer = await ManufacturerService.updateManufacturer(
      numberCategoryId,
      name,
      visible,
      hashSlug,
      id,
      file
    );

    if (!updateManufacturer) {
      return res.status(400).json("Invalid input: All fields are required");
    }

    return res.status(200).json(updateManufacturer);
  });

  //Delete manufacturer

  delManufacturer = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json("Invalid input: Id is required");
    }

    const delManufacturer = await ManufacturerService.delManufacturer(id);

    if (!delManufacturer) {
      return res.status(400).json("Invalid input: All fields are required");
    }

    return res.status(200).json(delManufacturer);
  });
  updateManufacturerByVisible = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(500).json({ error: "invalid id" });
    }
    const updateManufacturerByVisible = await ManufacturerService.updateManufacturerByVisible(id);
    return res.status(200).json(updateManufacturerByVisible);
  });

}

module.exports = new ManufacturerController();
