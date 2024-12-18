const { getKey, setKey } = require("../../db/init.redis");
const asyncWrapper = require("../../middleware/async");
const ProductImgService = require("./productImg.service");
class ProductImgController {
  //Created
  createProductImg = asyncWrapper(async (req, res) => {
    const files = req.files || req.files;
    if (!files) {
      return res.status(500).json({ error: "invalid files" });
    }
    const productImgs = await ProductImgService.createProductImg(
      req.body,
      files
    );
    return res.status(200).json(productImgs);
  });

  //Get all img
  getAllProductImg = asyncWrapper(async (req, res) => {
    const productimgs = await ProductImgService.getAllProductImg();
    return res.status(200).json(productimgs);
  });

  //Get one img
  getOneProductImgById = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(500).json({ error: "invalid id" });
    }

    const productimg = await ProductImgService.getOneProductImgById(id);

    return res.status(200).json(productimg);
  });

  //Get all product img by product
  getAllProductImgByProduct = asyncWrapper(async (req, res) => {
    const productId = parseInt(req.params.id);
    if (!productId) {
      return res.status(500).json({ error: "invalid id" });
    }
    const productimg = await ProductImgService.getAllProductImgByProduct(
      productId
    );
    return res.status(200).json(productimg);
  });

  //Update
  updateProductImg = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const file = req.files;
    if (!id) {
      return res.status(500).json({ error: "invalid id" });
    }
    const productimg = await ProductImgService.updateProductImg(
      id,
      req.body,
      file
    );
    return res.status(200).json(productimg);
  });

  //Delete
  deleteProductImg = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(500).json({ error: "invalid id" });
    }
    const deletedProductImg = await ProductImgService.deleteProductImg(id);
    res.status(200).json(deletedProductImg);
  });
}
module.exports = new ProductImgController();
