interface IStore {
  id: number;
  province: {
    code: string;
    name: string;
  };
  district: {
    code: string;
    name: string;
  };
  ward: string;
  street: string;
  phone: number;
  codeStore: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStore2 {
  id: number;
  province: {
    code: string;
    name: string;
  };
  district: {
    id: string;
    name: string;
  };
  ward: string;
  street: string;
  phone: number;
  codeStore: string;
  createdAt: Date;
  updatedAt: Date;
}

class Store implements IStore {
  id: number;
  province: {
    code: string;
    name: string;
  };
  district: {
    code: string;
    name: string;
  };
  ward: string;
  street: string;
  phone: number;
  codeStore: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    province: { code: string; name: string },
    district: { code: string; name: string },
    ward: string,
    street: string,
    phone: number,
    codeStore: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.province = province;
    this.district = district;
    this.ward = ward;
    this.street = street;
    this.phone = phone;
    this.codeStore = codeStore;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default Store;
