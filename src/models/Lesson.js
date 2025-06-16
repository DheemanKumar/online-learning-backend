// models/Lesson.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Lesson = sequelize.define("Lesson", {
  title: { type: DataTypes.STRING, allowNull: false },
  videoUrl: { type: DataTypes.STRING },
  duration: { type: DataTypes.STRING },
  order: { type: DataTypes.INTEGER },
  chapter: { type: DataTypes.STRING },
  isFree: { type: DataTypes.BOOLEAN, defaultValue: false }, 
  courseId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Lesson;
