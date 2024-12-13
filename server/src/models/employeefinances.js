"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeFinance extends Model {
    static associate(models) {

    }
  }
  EmployeeFinance.init(
    {
      employee_id: DataTypes.INTEGER,
      salary: DataTypes.STRING,
      bonus: DataTypes.STRING,
      deductions: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "EmployeeFinance",
      tableName: "employee_finances",
    }
  );
  return EmployeeFinance;
};
