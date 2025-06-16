const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Educator = require("../models/Educator");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not set in environment variables!");


exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile, targetExam, preferredLanguage } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ success: false, message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, mobile, targetExam, preferredLanguage });

    const token = jwt.sign({ id: user.id, role: "user" }, JWT_SECRET);
    res.json({ success: true, message: "Registration successful", userId: user.id, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.registerEducator = async (req, res) => {
  try {
    const { name, email, password, mobile, subjects, qualification, experience, bio } = req.body;

    const existing = await Educator.findOne({ where: { email } });
    if (existing) return res.status(400).json({ success: false, message: "Educator already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const educator = await Educator.create({
      name,
      email,
      password: hashed,
      mobile,
      subjectsExpertise: subjects.join(", "),
      credentials: qualification,
      yearsOfExperience: experience,
      profile: bio,
    });

    const token = jwt.sign({ id: educator.id, role: "educator" }, JWT_SECRET);
    res.json({ success: true, message: "Registration successful", educatorId: educator.id, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  const Model = role === "educator" ? Educator : User;
  const user = await Model.findOne({ where: { email } });

  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ success: false, message: "Invalid password" });

  const token = jwt.sign({ id: user.id, role }, JWT_SECRET);
  res.json({ success: true, message: "Login successful", token });
};
