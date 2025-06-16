const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonController");
const auth = require("../middleware/auth");

// GET /api/lessons/:id
router.get("/:id", auth, lessonController.getLessonById);

// POST /api/lessons/:id/progress
router.post("/:id/progress", auth, lessonController.updateLessonProgress);

// POST /api/lessons/:id/notes
router.post("/:id/notes", auth, lessonController.saveLessonNote);

// POST /api/lessons
router.post("/", auth, lessonController.createLesson);

// POST /api/courses/:id/lessons

module.exports = router;
