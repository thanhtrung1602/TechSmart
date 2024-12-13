import Address from "./Address";
import PaymentMethods from "./PaymentMethods";
import Status from "./Status";
import Store from "./Store";
import Users from "./Users";

interface IOrders {
  id: number;
  userId: number;
  addressId: number;
  storeId: number;
  phone: number;
  total: number;
  statusId: number;
  paymentMethodId: number;
  createdAt: Date;
  updatedAt: Date;
  paymentMethods: PaymentMethods;
  statusData: Status;
  userData: Users;
  order_code: string;
  addressData: Address;
  transactionCode: number;
  tracking_order: string;
  delivery_method: string;
  storeData: Store;
  statusPayId: number;
  deliveryDate: Date;
  statusPayData: Status;
}

class Orders implements IOrders {
  id: number;
  userId: number;
  addressId: number;
  storeId: number;
  phone: number;
  total: number;
  statusId: number;
  paymentMethodId: number;
  createdAt: Date;
  updatedAt: Date;
  paymentMethods: PaymentMethods;
  statusData: Status;
  userData: Users;
  order_code: string;
  addressData: Address;
  transactionCode: number;
  tracking_order: string;
  delivery_method: string;
  storeData: Store;
  statusPayId: number;
  deliveryDate: Date;
  statusPayData: Status;

  constructor(
    id: number,
    userId: number,
    addressId: number,
    storeId: number,
    phone: number,
    total: number,
    statusId: number,
    paymentMethodId: number,
    createdAt: Date,
    updatedAt: Date,
    paymentMethods: PaymentMethods,
    statusData: Status,
    userData: Users,
    addressData: Address,
    transactionCode: number,
    tracking_order: string,
    order_code: string,
    delivery_method: string,
    storeData: Store,
    statusPayId: number,
    deliveryDate: Date,
    statusPayData: Status
  ) {
    this.id = id;
    this.userId = userId;
    this.addressId = addressId;
    this.storeId = storeId;
    this.phone = phone;
    this.total = total;
    this.statusId = statusId;
    this.paymentMethodId = paymentMethodId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.paymentMethods = paymentMethods;
    this.statusData = statusData;
    this.userData = userData;
    this.addressData = addressData;
    this.tracking_order = tracking_order;
    this.order_code = order_code;
    this.transactionCode = transactionCode;
    this.delivery_method = delivery_method;
    this.storeData = storeData;
    this.statusPayId = statusPayId;
    this.deliveryDate = deliveryDate;
    this.statusPayData = statusPayData;
  }
}

export default Orders;
