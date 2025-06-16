const express = require("express");
const router = express.Router();
const liveClassController = require("../controllers/liveClassController");
const auth = require("../middleware/auth");

// GET /api/live-classes/schedule
router.get("/schedule", liveClassController.getLiveClassSchedule);

// POST /api/live-classes/:id/join
router.post("/:id/join", auth, liveClassController.joinLiveClass);

// POST /api/live-classes/:id/questions
router.post("/:id/questions", auth, liveClassController.askLiveClassQuestion);

module.exports = router;
