const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const StudyMaterial = sequelize.define("StudyMaterial", {
  title: { type: DataTypes.STRING },
  type: { type: DataTypes.ENUM("PDF", "Note", "Resource") },
  chapter: { type: DataTypes.STRING },
  url: { type: DataTypes.STRING },
  canDownload: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = StudyMaterial;
