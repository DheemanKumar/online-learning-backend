const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Educator = sequelize.define("Educator", {
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

  profile: {
    type: DataTypes.TEXT,
  },

  credentials: {
    type: DataTypes.TEXT, // Degree, institution, etc.
  },

  subjectsExpertise: {
    type: DataTypes.JSON, // Store as array: ["Math", "Physics"]
  },

  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },

  reviewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  yearsOfExperience: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  bio: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
});

module.exports = Educator;
