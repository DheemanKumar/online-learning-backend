const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Test = sequelize.define("Test", {
  title: { type: DataTypes.STRING },
  type: { type: DataTypes.ENUM("practice", "mock"), defaultValue: "practice" },
  questionBank: { type: DataTypes.TEXT }, // can store JSON string
  timeLimit: { type: DataTypes.INTEGER }, // in minutes
});

module.exports = Test;
