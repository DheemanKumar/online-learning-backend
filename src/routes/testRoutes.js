const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");
const auth = require("../middleware/auth");

// GET /api/tests
router.get("/", testController.getTests);

// POST /api/tests/:id/start
router.post("/:id/start", auth, testController.startTest);

// POST /api/tests/:sessionId/submit
router.post("/:sessionId/submit", auth, testController.submitTest);

module.exports = router;
