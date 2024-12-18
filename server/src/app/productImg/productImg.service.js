const db = require("../../models/index");
class ProductImgService {
  //Get all img
  async getAllProductImg() {
    try {
      const productimg = await db.ProductImg.findAll();
      return productimg;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Get one img
  async getOneProductImgById(productId) {
    try {
      const productimg = await db.ProductImg.findAll({
        where: {
          id: productId,
        },
      });
      return productimg;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Get all product img by product
  async getAllProductImgByProduct(productId) {
    try {
      const productimg = await db.ProductImg.findAll({
        where: {
          productId,
        },
      });
      return productimg;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Created
  async createProductImg({ productId }, files) {
    console.log(files);
    try {
      if (files && files.length > 0) {
        const productImgs = await Promise.all(
          files.map(async (file) => {
            if (!file.path) {
              throw new Error("File path is missing!");
            }

            console.log("Saving file: ", file.path);

            const productImg = await db.ProductImg.create({
              productId,
              img: file.path,
            });

            return productImg;
          })
        );
        return productImgs;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Update
  async updateProductImg(id, { productId }, files) {
    try {
      const productImg = await db.ProductImg.findOne({
        where: {
          productId: id,
        },
      });
      if (!productImg) {
        return "Sản phẩm không có trong store";
      }
      if (files && files.length > 0) {
        const updatedProductImgs = await Promise.all(
          files.map(async (file) => {
            const updateImg = await db.ProductImg.update(
              {
                productId,
                img: file.path,
              },
              {
                where: {
                  productId: id,
                },
              }
            );
            return updateImg;
          })
        );
        return updatedProductImgs;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Delete
  async deleteProductImg(productId) {
    try {
      const productimg = await db.ProductImg.destroy({
        where: { productId },
      });
      return productimg;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
module.exports = new ProductImgService();
