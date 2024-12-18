const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.POSTGRESQL);

try {
  await sequelize.authenticate();
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
