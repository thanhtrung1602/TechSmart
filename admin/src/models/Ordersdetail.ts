import Address from "./Address";
import Orders from "./Orders";
import Variants from "./Variants";

interface IOrdersDetail {
  id: number;
  variantId: number;
  orderId: number;
  quantity: number;
  total: number;
  color: string;
  size: string;
  createdAt: Date;
  updatedAt: Date;
  variantData: Variants;
  orderData: Orders;
  addressData: Address;
}

export default class OrdersDetail implements IOrdersDetail {
  id: number;
  variantId: number;
  orderId: number;
  quantity: number;
  total: number;
  color: string;
  size: string;
  createdAt: Date;
  updatedAt: Date;
  variantData: Variants;
  orderData: Orders;
  addressData: Address;

  constructor(
    id: number,
    variantId: number,
    orderId: number,
    total: number,
    quantity: number,
    color: string,
    size: string,
    createdAt: Date,
    updatedAt: Date,
    variantData: Variants,
    orderData: Orders,
    addressData: Address
  ) {
    this.id = id;
    this.variantId = variantId;
    this.orderId = orderId;
    this.total = total;
    this.quantity = quantity;
    this.color = color;
    this.size = size;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.variantData = variantData;
    this.orderData = orderData;
    this.addressData = addressData;
  }
}
