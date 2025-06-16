const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const TestAttempt = sequelize.define("TestAttempt", {
  score: { type: DataTypes.FLOAT },
  timeTaken: { type: DataTypes.INTEGER }, // in minutes
  answerSheet: { type: DataTypes.TEXT }, // JSON string
});

module.exports = TestAttempt;

