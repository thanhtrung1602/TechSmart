interface IUsers {
  id: number;
  fullname: string;
  password: string;
  email: string;
  phone: string;
  bom?: number;
  ban?: boolean;
  role?: string;
}

class Users implements IUsers {
  id: number;
  fullname: string;
  password: string;
  email: string;
  phone: string;
  bom?: number;
  ban?: boolean;
  role?: string;
  createdAt?: Date;

  constructor(
    id: number,
    fullname: string,
    password: string,
    email: string,
    phone: string,
    bom?: number,
    ban?: boolean,
    role?: string,
    createdAt?: Date
  ) {
    this.id = id;
    this.fullname = fullname;
    this.password = password;
    this.email = email;
    this.phone = phone;
    this.bom = bom;
    this.ban = ban;
    this.role = role;
    this.createdAt = createdAt;
  }
}

export default Users;
