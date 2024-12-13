"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: "categories",
          key: "id",
        },
      },
      manufacturerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "manufacturer",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      name: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      discount: {
        type: Sequelize.INTEGER,
      },
      img: {
        type: Sequelize.STRING,
      },
      stock: {
        type: Sequelize.INTEGER,
      },
      visible: {
        type: Sequelize.BOOLEAN,
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
      },
      hot: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex("products", ["id"]);
    await queryInterface.addIndex("products", ["categoryId"]);
    await queryInterface.addIndex("products", ["manufacturerId"]);
    await queryInterface.addIndex("products", ["price"]);
    await queryInterface.addIndex("products", ["discount"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("products");
  },
};
