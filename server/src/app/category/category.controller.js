const asyncWrapper = require("../../middleware/async");
const { removeVietnameseTones } = require("../../helpers/utils");
const categoriesService = require("./category.service");

class CategoriesController {
  createCategories = asyncWrapper(async (req, res) => {
    const file = req.file.path;
    const { name } = req.body;

    console.log("file: ", file);


    if (!name || !file) {
      return res.status(400).json("Invalid input: Name and img are required");
    }

    const hashSlug = removeVietnameseTones(name)
      .toLowerCase()
      .replace(/\s+/g, "-");

    const createCategories = await categoriesService.createCategories(
      req.body,
      file,
      hashSlug
    );
    return res.status(200).json(createCategories);
  });


  filteredCategories = asyncWrapper(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const search = req.query.search || "";
    const filter = req.query.filter || "";
    const visible = req.query.visible  === "null" 

    const limit = size;
    const offSet = (page - 1) * size;

    const filteredCategories = await categoriesService.filteredCategories(
      limit,
      offSet,
      search,
      filter,
      visible
    );
    return res.status(200).json(filteredCategories);
  });

  getAllCategories = asyncWrapper(async (req, res) => {
    const getAllCategories = await categoriesService.getAllCategories();
    return res.status(200).json(getAllCategories);
  });

  getCategoryById = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "invalid id" });
    }
    const categories = await categoriesService.getCategoryById(id);
    return res.status(200).json(categories);
  });

  getCategorySlug = asyncWrapper(async (req, res) => {
    const slug = req.params.slug;
    if (!slug) {
      return res.status(400).json({ error: "Không tìm thấy" });
    }
    const categories = await categoriesService.getCategorySlug(slug);
    return res.status(200).json(categories);
  });

  updateCategories = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const file = req.file ? req.file.path : null;
    const { name,visible } = req.body;
    const hashSlug = removeVietnameseTones(name)
      .toLowerCase()
      .replace(/\s+/g, "-");
    const updatedCategory = await categoriesService.updateCategories(
      id,
      req.body,
      file,
      hashSlug
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ message: "Update category thành công" });
  });

  deleteCategories = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "invalid id" });
    }
    const result = await categoriesService.deleteCategories(id);
    return res.status(200).json(result);
  });
  updateCategoriesByVisible = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(500).json({ error: "invalid id" });
    }
    const updateCategoriesByVisible = await categoriesService.updateCategoriesByVisible(id);
    return res.status(200).json(updateCategoriesByVisible);
  });
}
module.exports = new CategoriesController();
