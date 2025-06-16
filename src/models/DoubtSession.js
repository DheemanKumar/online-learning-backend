const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const DoubtSession = sequelize.define("DoubtSession", {
  title: { type: DataTypes.STRING },
  question: { type: DataTypes.TEXT },
  response: { type: DataTypes.TEXT },
  resolved: { type: DataTypes.BOOLEAN, defaultValue: false },
  userId: { type: DataTypes.INTEGER },
  courseId: { type: DataTypes.INTEGER },
  lessonId: { type: DataTypes.INTEGER },
  attachments: { type: DataTypes.TEXT }, // JSON string
});

module.exports = DoubtSession;
