import Variants from "./Variants";

// Interface defining the additional properties for a cart
export interface ICarts {
  id: number;
  userId: number;
  quantity: number;
  rom: string;
  color: string;
  variantId: number;
  variantData: Variants;
  createdAt: Date;
  updatedAt: Date;
  total: number;
}

// Carts class extends Products and implements ICarts
class Carts implements ICarts {
  id: number;
  userId: number;
  quantity: number;
  rom: string;
  color: string;
  variantId: number;
  variantData: Variants;
  createdAt: Date;
  updatedAt: Date;
  total: number;
  constructor(
    id: number,
    userId: number,
    quantity: number, // add field for cart
    rom: string,
    color: string,
    variantId: number,
    variantData: Variants,
    total: number
  ) {
    this.id = id;
    this.userId = userId;
    this.quantity = quantity;
    this.rom = rom;
    this.color = color;
    this.variantId = variantId;
    this.variantData = variantData;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.total = total;
  }
}

export default Carts;
