interface IUsers {
  id: number;
  fullname: string;
  email: string;
  phone: number;
  bom: number;
  ban: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

class Users implements IUsers {
  id: number;
  fullname: string;
  email: string;
  phone: number;
  bom: number;
  ban: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    fullname: string,
    email: string,
    phone: number,
    bom: number,
    ban: boolean,
    role: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.fullname = fullname;
    this.email = email;
    this.phone = phone;
    this.bom = bom;
    this.ban = ban;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default Users;
