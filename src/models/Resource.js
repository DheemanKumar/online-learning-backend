const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Resource = sequelize.define("Resource", {
  lessonId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false }, // e.g., 'pdf', 'video', etc.
  title: { type: DataTypes.STRING, allowNull: false },
  url: { type: DataTypes.STRING, allowNull: false },
}, {
  timestamps: true,
});

module.exports = Resource;
