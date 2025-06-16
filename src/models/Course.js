// models/Course.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Course = sequelize.define("Course", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  targetExam: { type: DataTypes.STRING },
  language: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT },
  discountedPrice: { type: DataTypes.FLOAT },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  enrolledStudents: { type: DataTypes.INTEGER, defaultValue: 0 },
  duration: { type: DataTypes.STRING },
  thumbnail: { type: DataTypes.STRING },
  highlights: { type: DataTypes.JSON },
  type: { type: DataTypes.ENUM("live", "recorded"), defaultValue: "recorded" },
  educatorId: { type: DataTypes.INTEGER, allowNull: false },
  totalLessons: { type: DataTypes.INTEGER },
});

module.exports = Course;
