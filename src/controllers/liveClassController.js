const { LiveClass, Course, Educator } = require("../models");

// GET /api/live-classes/schedule
exports.getLiveClassSchedule = async (req, res) => {
  try {
    const { courseId, date, upcoming } = req.query;
    const where = {};
    if (courseId) where.courseId = courseId;
    if (date) where.scheduledAt = date;
    if (upcoming === "true") where.scheduledAt = { $gte: new Date().toISOString().slice(0, 10) };
    // Find all live classes, include educator name
    const classes = await LiveClass.findAll({
      where,
      include: [{ model: Educator, attributes: ["name"] }],
      order: [["scheduledAt", "ASC"]],
    });
    const liveClasses = classes.map(cls => ({
      id: cls.id,
      title: cls.title,
      educator: cls.Educator ? cls.Educator.name : null,
      scheduledAt: cls.scheduledAt,
      duration: cls.duration || 90,
      courseId: cls.courseId,
      maxStudents: cls.maxStudents || 500,
      enrolled: cls.enrolled || 0, // You may want to fetch actual enrolled count if available
      status: cls.status || "scheduled",
      joinUrl: cls.joinUrl || null
    }));
    res.json({ success: true, liveClasses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/live-classes/:id/join
exports.joinLiveClass = async (req, res) => {
  try {
    const classId = req.params.id;
    // Find class with educator and course info
    const liveClass = await LiveClass.findByPk(classId, {
      include: [
        { model: Educator, attributes: ["id", "name"] },
        { model: Course, attributes: ["id", "title"] }
      ]
    });
    if (!liveClass) return res.status(404).json({ success: false, message: "Live class not found" });
    res.json({
      success: true,
      liveClass: {
        id: liveClass.id,
        title: liveClass.title,
        scheduledAt: liveClass.scheduledAt,
        maxStudents: liveClass.maxStudents,
        isRecordingAvailable: liveClass.isRecordingAvailable,
        course: liveClass.Course ? { id: liveClass.Course.id, title: liveClass.Course.title } : null,
        educator: liveClass.Educator ? { id: liveClass.Educator.id, name: liveClass.Educator.name } : null,
        joinUrl: `https://live.example.com/class/${classId}`,
        token: "access_token",
        chatEnabled: true,
        pollsEnabled: true
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/live-classes/:id/questions
exports.askLiveClassQuestion = async (req, res) => {
  try {
    const classId = req.params.id;
    const { question, timestamp } = req.body;
    // what to do with the question is not specified, assuming we just log it
    if (!question || !timestamp) {
      return res.status(400).json({ success: false, message: "Question and timestamp are required" });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
