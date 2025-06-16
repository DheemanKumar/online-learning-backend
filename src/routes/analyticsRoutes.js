const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const auth = require("../middleware/auth");

// GET /api/progress/dashboard
router.get("/dashboard", auth, analyticsController.getDashboard);

// GET /api/progress/course/:courseId
router.get("/course/:courseId", auth, analyticsController.getCourseProgress);

// GET /api/search
router.get("/search", analyticsController.globalSearch);

module.exports = router;
