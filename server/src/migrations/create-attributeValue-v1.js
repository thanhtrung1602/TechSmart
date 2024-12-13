"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("attributevalue", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      attributeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "attribute",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      productSlug: {
        type: Sequelize.STRING,
        references: {
          model: "products",
          key: "slug",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      value: {
        type: Sequelize.STRING,
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

    await queryInterface.addIndex("attributevalue", ["id"]);
    await queryInterface.addIndex("attributevalue", ["attributeId"]);
    await queryInterface.addIndex("attributevalue", ["productSlug"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("attributevalue");
  },
};
