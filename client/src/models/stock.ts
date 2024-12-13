import Products from "./Products";
import Store from "./Store";

interface IStock {
  id: number;
  storeId: number;
  productId: number;
  stockProduct: number;
  productData: Products;
  storeData: Store;
}

class Stock implements IStock {
  id: number;
  storeId: number;
  productId: number;
  stockProduct: number;
  productData: Products;
  storeData: Store;

  constructor(
    id: number,
    storeId: number,
    productId: number,
    stockProduct: number,
    productData: Products,
    storeData: Store
  ) {
    this.id = id;
    this.storeId = storeId;
    this.productId = productId;
    this.stockProduct = stockProduct;
    this.productData = productData;
    this.storeData = storeData;
  }
}

export default Stock;
