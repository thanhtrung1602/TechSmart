import Products from "./Products";

// Interface defining the additional properties for a cart
export interface ICarts {
  id: number;
  userId: number;
  quantity: number;
  rom: string;
  color: string;
  imgCart: string;
  productData: Products;
  createdAt: Date;
  updatedAt: Date;
  total: number;
}

// Carts class extends Products and implements ICarts
class Carts extends Products implements ICarts {
  id: number;
  userId: number;
  quantity: number;
  rom: string;
  color: string;
  imgCart: string;
  productData: Products;
  createdAt: Date;
  updatedAt: Date;
  total: number;
  constructor(
    id: number,
    userId: number,
    quantity: number, // add field for cart
    rom: string,
    color: string,
    imgCart: string,
    productData: Products,
    total: number
  ) {
    super(
      productData.id,
      productData.categoryId,
      productData.manufacturerId,
      productData.name,
      productData.slug,
      productData.price,
      productData.discount,
      productData.img,
      productData.stock,
      productData.visible,
      productData.hot,
      productData.createdAt,
      productData.updatedAt,
      productData.categoryData,
      productData.manufacturerData
    );

    this.id = id;
    this.userId = userId;
    this.quantity = quantity;
    this.rom = rom;
    this.color = color;
    this.imgCart = imgCart;
    this.productData = productData;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.total = total;
  }
}

export default Carts;
