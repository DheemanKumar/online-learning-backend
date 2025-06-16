const { User, Educator, StudentInstructorFollow } = require("../models");

// POST /api/students/:id/follow
exports.followInstructor = async (req, res) => {
  try {
    const studentId = req.user.id; // assuming auth middleware sets req.user
    const instructorId = parseInt(req.params.id);
    if (!instructorId) return res.status(400).json({ success: false, message: "Instructor ID required" });
    // Check if instructor exists
    const educator = await Educator.findByPk(instructorId);
    if (!educator) return res.status(404).json({ success: false, message: "Instructor not found" });
    // Prevent duplicate follows
    const [follow, created] = await StudentInstructorFollow.findOrCreate({
      where: { studentId, instructorId }
    });
    if (!created) {
      return res.json({ success: true, message: "Already following this instructor" });
    }
    res.json({ success: true, message: "Now following instructor" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
