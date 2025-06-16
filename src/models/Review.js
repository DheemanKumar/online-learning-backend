const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Review = sequelize.define("Review", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  courseId: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  review: { type: DataTypes.TEXT },
}, {
  timestamps: true
});

module.exports = Review;
