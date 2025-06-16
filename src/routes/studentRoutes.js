const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const auth = require("../middleware/auth");

// POST /api/students/:id/follow (follow an instructor)
router.post("/:id/follow", auth, studentController.followInstructor);

module.exports = router;
