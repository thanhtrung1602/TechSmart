"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("uAddresses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      province: {
        type: Sequelize.JSONB,
      },
      ward: {
        type: Sequelize.STRING,
      },
      district: {
        type: Sequelize.JSONB,
      },
      street: {
        type: Sequelize.STRING,
      },
      userId: {
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
    await queryInterface.addIndex("uAddresses", ["userId"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("uAddresses");
  },
};
