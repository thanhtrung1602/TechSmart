import Address from "./Address";
import Orders from "./Orders";
import Products from "./Products";

interface IOrdersDetail {
  id: number;
  productId: number;
  orderId: number;
  quantity: number;
  total: number;
  color: string;
  size: string;
  createdAt: Date;
  updatedAt: Date;
  productData: Products;
  orderData: Orders;
  addressData: Address;
}

export default class OrdersDetail implements IOrdersDetail {
  id: number;
  productId: number;
  orderId: number;
  quantity: number;
  total: number;
  color: string;
  size: string;
  createdAt: Date;
  updatedAt: Date;
  productData: Products;
  orderData: Orders;
  addressData: Address;

  constructor(
    id: number,
    productId: number,
    orderId: number,
    total: number,
    color: string,
    size: string,
    quantity: number,
    createdAt: Date,
    updatedAt: Date,
    productData: Products,
    orderData: Orders,
    addressData: Address
  ) {
    this.id = id;
    this.productId = productId;
    this.orderId = orderId;
    this.total = total;
    this.color = color;
    this.size = size;
    this.quantity = quantity;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.productData = productData;
    this.orderData = orderData;
    this.addressData = addressData;
  }
}
