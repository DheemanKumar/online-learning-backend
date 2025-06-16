const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Subscription = sequelize.define("Subscription", {
  plan: { type: DataTypes.ENUM("Plus", "Iconic"), defaultValue: "Plus" },
  features: { type: DataTypes.TEXT },
  paymentHistory: { type: DataTypes.TEXT }, // can store payment JSON
  activeUntil: { type: DataTypes.DATE },
});

module.exports = Subscription;
