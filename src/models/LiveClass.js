const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const LiveClass = sequelize.define("LiveClass", {
  title: { type: DataTypes.STRING },
  scheduledAt: { type: DataTypes.DATE },
  maxStudents: { type: DataTypes.INTEGER },
  isRecordingAvailable: { type: DataTypes.BOOLEAN, defaultValue: false },
  date: { type: DataTypes.STRING },
  startTime: { type: DataTypes.STRING },
  endTime: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  joinUrl: { type: DataTypes.STRING },
  token: { type: DataTypes.STRING },
  chatEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  pollsEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = LiveClass;
