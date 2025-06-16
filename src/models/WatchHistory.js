const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const WatchHistory = sequelize.define("WatchHistory", {
  lastWatchedAt: { type: DataTypes.DATE },
  progress: { type: DataTypes.FLOAT, defaultValue: 0 }, // percentage
  isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = WatchHistory;

