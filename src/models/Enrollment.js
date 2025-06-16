const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Enrollment = sequelize.define("Enrollment", {
  purchaseDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  expiryDate: { type: DataTypes.DATE },
  progress: { type: DataTypes.FLOAT, defaultValue: 0 }, // 0 to 100
});

module.exports = Enrollment;

