"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    static associate(models) {}
  }
  Staff.init(
    {
      fullName: DataTypes.STRING,
      date_of_birth: DataTypes.JSON,
      gender: DataTypes.STRING, //giới tính
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      position: DataTypes.STRING, //chức vụ
      hire_date: DataTypes.STRING, //ngày vào làm
      salary: DataTypes.STRING, //lương cơ bản
    },
    {
      sequelize,
      modelName: "Staff",
      tableName: "staff",
    }
  );
  return Staff;
};
