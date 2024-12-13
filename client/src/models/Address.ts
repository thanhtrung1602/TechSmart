export interface IAddress {
  id: number;
  userId: number;
  province: {
    code: string | number | undefined;
    name: string | undefined;
  };
  district: {
    code: string | number | undefined;
    name: string | undefined;
  };
  ward: string;
  street: string;
  name: string;
  phone: number;
}

class Address implements IAddress {
  id: number;
  userId: number;
  province: {
    code: string | number | undefined;
    name: string | undefined;
  };
  district: {
    code: string | number | undefined;
    name: string | undefined;
  };
  ward: string;
  street: string;
  name: string;
  phone: number;
  constructor(
    id: number,
    userId: number,
    province: {
      code: string | number | undefined;
      name: string | undefined;
    },
    district: {
      code: string | number | undefined;
      name: string | undefined;
    },
    ward: string,
    street: string,
    name: string,
    phone: number
  ) {
    (this.id = id),
      (this.userId = userId),
      (this.province = province),
      (this.district = district),
      (this.ward = ward),
      (this.street = street),
      (this.name = name),
      (this.phone = phone);
  }
}

export default Address;
