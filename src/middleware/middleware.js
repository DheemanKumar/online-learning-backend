const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Educator = require("../models/Educator");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Authentication middleware using JWT
exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Role-based access middleware
exports.requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ success: false, message: "Forbidden: Insufficient role" });
  }
  next();
};

// Enrollment verification middleware
exports.requireEnrollment = (CourseModel, EnrollmentModel) => async (req, res, next) => {
  const userId = req.user.id;
  const courseId = req.params.courseId || req.body.courseId || req.params.id;
  const enrolled = await EnrollmentModel.findOne({ where: { userId, courseId } });
  if (!enrolled) return res.status(403).json({ success: false, message: "Not enrolled in course" });
  next();
};

// Subscription check middleware
exports.requireSubscription = (SubscriptionModel) => async (req, res, next) => {
  const userId = req.user.id;
  const sub = await SubscriptionModel.findOne({ where: { userId } });
  if (!sub || new Date(sub.activeUntil) < new Date()) {
    return res.status(403).json({ success: false, message: "No active subscription" });
  }
  next();
};

// Request validation middleware (example for body fields)
exports.validateBody = (fields) => (req, res, next) => {
  for (const field of fields) {
    if (!req.body[field]) {
      return res.status(400).json({ success: false, message: `Missing field: ${field}` });
    }
  }
  next();
};

// Error handling middleware
exports.errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
};
