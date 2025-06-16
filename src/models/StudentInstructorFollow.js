const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const StudentInstructorFollow = sequelize.define("StudentInstructorFollow", {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  instructorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
}, {
  timestamps: true,
  tableName: "StudentInstructorFollows"
});

module.exports = StudentInstructorFollow;
