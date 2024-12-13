'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productVariants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productSlug: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "products",
          key: "slug"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      romId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "roms",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      colorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "colors",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('productVariants');
  }
};