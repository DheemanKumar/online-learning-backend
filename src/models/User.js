const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  mobile: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },

  targetExam: {
    type: DataTypes.ENUM("UPSC", "NEET", "JEE", "Other"),
    defaultValue: "Other",
  },

  preferredLanguage: {
    type: DataTypes.STRING,
    defaultValue: "English",
  },

  preparationLevel: {
    type: DataTypes.ENUM("beginner", "intermediate", "advanced"),
    defaultValue: "beginner",
  },
}, {
  timestamps: true,
});

module.exports = User;
