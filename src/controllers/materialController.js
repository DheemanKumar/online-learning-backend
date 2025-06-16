const { StudyMaterial, Enrollment } = require("../models");

// GET /api/materials/course/:courseId
exports.getCourseMaterials = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;
    // Check enrollment
    const enrolled = await Enrollment.findOne({ where: { userId, courseId } });
    if (!enrolled) return res.status(403).json({ success: false, message: "Not enrolled in course" });
    const materials = await StudyMaterial.findAll({ where: { courseId } });
    // Add dummy size and downloadUrl for demo
    const result = materials.map(m => ({
      id: m.id,
      title: m.title,
      type: m.type,
      chapter: m.chapter,
      size: m.size || "2.5 MB",
      downloadUrl: `/api/materials/${m.id}/download` // or generate a secure URL
    }));
    res.json({ success: true, materials: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/materials
exports.addMaterial = async (req, res) => {
  try {
    const { title, type, chapter, url, courseId, canDownload } = req.body;
    if (!title || !type || !url || !courseId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const material = await StudyMaterial.create({
      title,
      type,
      chapter,
      url,
      courseId,
      canDownload: canDownload !== undefined ? canDownload : true
    });
    res.status(201).json({ success: true, material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/materials/:id/download
exports.trackDownload = async (req, res) => {
  try {
    // download logic
    res.json({ success: true, message: "Download tracked" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
