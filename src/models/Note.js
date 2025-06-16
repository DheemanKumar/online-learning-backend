const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Note = sequelize.define("Note", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  lessonId: { type: DataTypes.INTEGER, allowNull: false },
  timestamp: { type: DataTypes.INTEGER, allowNull: false },
  note: { type: DataTypes.TEXT, allowNull: false },
}, {
  timestamps: true,
});

module.exports = Note;
