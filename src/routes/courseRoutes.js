const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const lessonController = require("../controllers/lessonController");
const testController = require("../controllers/testController");
const auth = require("../middleware/auth");

router.get("/", courseController.getCourses);
router.get("/:id", courseController.getCourseById);
router.post("/:id/enroll", auth, courseController.enrollInCourse);
router.post("/", courseController.createCourse);
router.post("/:id/classes", lessonController.addClassToCourse);
router.post("/:id/lessons", auth, lessonController.createLessonForCourse);
router.post("/:id/tests", auth, testController.createTestForCourse);
router.post("/:id/review", auth, courseController.reviewCourse);

module.exports = router;
