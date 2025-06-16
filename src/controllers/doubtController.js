const { DoubtSession, User, Lesson, Course } = require("../models");

// POST /api/doubts
exports.postDoubt = async (req, res) => {
  try {
    const { courseId, lessonId, question, attachments } = req.body;
    const userId = req.user.id;
    if (!courseId || !lessonId || !question) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const doubt = await DoubtSession.create({
      userId,
      courseId,
      lessonId,
      question,
      attachments: attachments ? JSON.stringify(attachments) : null,
      resolved: false
    });
    res.status(201).json({ success: true, doubt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/doubts/my
exports.getMyDoubts = async (req, res) => {
  try {
    const userId = req.user.id;
    const doubts = await DoubtSession.findAll({ where: { userId } });
    res.json({ success: true, doubts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/doubts/:id/answer
exports.answerDoubt = async (req, res) => {
  try {
    const doubtId = req.params.id;
    const { answer } = req.body;
    // Educator authentication assumed (req.user.id is educator)
    const doubt = await DoubtSession.findByPk(doubtId);
    if (!doubt) return res.status(404).json({ success: false, message: "Doubt not found" });
    doubt.response = answer;
    doubt.resolved = true;
    await doubt.save();
    res.json({ success: true, doubt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
