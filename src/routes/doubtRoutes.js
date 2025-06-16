const express = require("express");
const router = express.Router();
const doubtController = require("../controllers/doubtController");
const auth = require("../middleware/auth");

// POST /api/doubts
router.post("/", auth, doubtController.postDoubt);

// GET /api/doubts/my
router.get("/my", auth, doubtController.getMyDoubts);

// POST /api/doubts/:id/answer (educator auth required)
router.post("/:id/answer", auth, doubtController.answerDoubt);

module.exports = router;
