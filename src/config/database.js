// config/db.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_STORAGE || "./database.sqlite",
});

module.exports = { sequelize };
