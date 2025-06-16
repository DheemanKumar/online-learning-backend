const { Educator, Course } = require("../models");
const { Op } = require("sequelize");

// GET /api/educators
exports.getEducators = async (req, res) => {
  try {
    const { subject, exam, rating } = req.query;
    const where = {};
    if (subject) {
      where.subjectsExpertise = { [Op.contains]: [subject] };
    }
    if (rating) {
      where.rating = { [Op.gte]: parseFloat(rating) };
    }
    // TODO: exam filter if educator has exam specialties
    const educators = await Educator.findAll({ where });
    // For each educator, get total students and courses
    const result = await Promise.all(educators.map(async (e) => {
      // Count courses and students if Course model has educatorId
      let courses = 0;
      let totalStudents = 0;
      if (Course) {
        const courseList = await Course.findAll({ where: { educatorId: e.id } });
        courses = courseList.length;
        totalStudents = courseList.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);
      }
      return {
        id: e.id,
        name: e.name,
        subjects: e.subjectsExpertise || [],
        experience: e.yearsOfExperience ? `${e.yearsOfExperience} years` : undefined,
        rating: e.rating,
        totalStudents,
        courses,
        image: e.image || null,
        isVerified: e.isVerified || false
      };
    }));
    res.json({ success: true, educators: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/educators/:id
exports.getEducatorProfile = async (req, res) => {
  try {
    const educator = await Educator.findByPk(req.params.id);
    if (!educator) return res.status(404).json({ success: false, message: "Educator not found" });
    res.json({ success: true, educator });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
