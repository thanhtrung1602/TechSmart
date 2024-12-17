import Products from "./Products";

interface IVariants {
  id: number;
  productId: number;
  stock: number;
  price: number;
  productData: Products;
  createdAt: Date;
  updatedAt: Date;
}

class Variants implements IVariants {
  id: number;
  productId: number;
  stock: number;
  price: number;
  productData: Products;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    productId: number,
    stock: number,
    price: number,
    productData: Products,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.productId = productId;
    this.stock = stock;
    this.price = price;
    this.productData = productData;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default Variants;
