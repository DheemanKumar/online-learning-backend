const express = require("express");
const router = express.Router();
const materialController = require("../controllers/materialController");
const auth = require("../middleware/auth");

// GET /api/materials/course/:courseId
router.get("/course/:courseId", auth, materialController.getCourseMaterials);

// POST /api/materials/:id/download
router.post("/:id/download", auth, materialController.trackDownload);

// POST /api/materials (add new material)
router.post("/", auth, materialController.addMaterial);

module.exports = router;
