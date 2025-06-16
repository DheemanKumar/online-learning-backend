const express = require("express");
const router = express.Router();
const educatorController = require("../controllers/educatorController");
const auth = require("../middleware/auth");

// GET /api/educators
router.get("/", educatorController.getEducators);

// GET /api/educators/:id
router.get("/:id", educatorController.getEducatorProfile);

module.exports = router;
