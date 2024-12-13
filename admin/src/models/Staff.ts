interface IStaff {
  id: number;
  fullName: string;
  date_of_birth: string | null; // Ngày sinh, có thể null
  gender: string; // Giới tính
  phone: string; // Số điện thoại
  email: string; // Email
  position: string; // Chức vụ
  hire_date: string; // Ngày vào làm
  salary: string; // Lương cơ bản
  createdAt: Date; // Ngày tạo
  updatedAt: Date; // Ngày cập nhật
}

class Staffs implements IStaff {
  id: number;
  fullName: string;
  date_of_birth: string | null;
  gender: string;
  phone: string;
  email: string;
  position: string;
  hire_date: string;
  salary: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    fullName: string,
    date_of_birth: string | null,
    gender: string,
    phone: string,
    email: string,
    position: string,
    hire_date: string,
    salary: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.fullName = fullName;
    this.date_of_birth = date_of_birth;
    this.gender = gender;
    this.phone = phone;
    this.email = email;
    this.position = position;
    this.hire_date = hire_date;
    this.salary = salary;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default Staffs;
