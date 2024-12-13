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

class Store implements IStore {
  id: number;
  province: {
    [x: string]: string | undefined;
    code: string;
    name: string;
  };
  district: {
    [x: string]: string | undefined;
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
