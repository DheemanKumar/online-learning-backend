const { Lesson, Course, Enrollment, WatchHistory, User, Note } = require("../models");

// GET /api/lessons/:id
exports.getLessonById = async (req, res) => {
  const userId = req.user.id;
  const lessonId = req.params.id;

  // Find lesson
  const lesson = await Lesson.findByPk(lessonId, { include: ["resources"] });
  if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });

  // Check enrollment
  const enrollment = await Enrollment.findOne({
    where: { userId, courseId: lesson.courseId },
  });
  if (!enrollment) return res.status(403).json({ success: false, message: "Not enrolled in course" });

  // Find next lesson
  const nextLesson = await Lesson.findOne({
    where: { courseId: lesson.courseId, id: { $gt: lesson.id } },
    order: [["id", "ASC"]],
    attributes: ["id", "title"],
  });

  res.json({
    success: true,
    lesson: {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      resources: lesson.resources || [],
      nextLesson: nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null,
    },
  });
};

// POST /api/lessons/:id/progress
exports.updateLessonProgress = async (req, res) => {
  const userId = req.user.id;
  const lessonId = req.params.id;
  const { watchedDuration, totalDuration, completed } = req.body;

  // Upsert watch history
  await WatchHistory.upsert({
    userId,
    lessonId,
    watchedDuration,
    totalDuration,
    completed,
  });

  res.json({ success: true });
};

// POST /api/lessons/:id/notes
exports.saveLessonNote = async (req, res) => {
  const userId = req.user.id;
  const lessonId = req.params.id;
  const { timestamp, note } = req.body;

  await Note.create({ userId, lessonId, timestamp, note });
  res.json({ success: true });
};

// POST /api/courses/:id/classes
exports.addClassToCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, date, startTime, endTime, description } = req.body;

    // Validate course exists
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    // Create LiveClass
    const liveClass = await require("../models").LiveClass.create({
      courseId,
      title,
      date,
      startTime,
      endTime,
      description,
      joinUrl: req.body.joinUrl,
      token: req.body.token,
      chatEnabled: req.body.chatEnabled,
      pollsEnabled: req.body.pollsEnabled
    });

    res.status(201).json({ success: true, class: liveClass });
  } catch (error) {
    console.error("Error adding class:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/lessons
exports.createLesson = async (req, res) => {
  try {
    const { title, videoUrl, duration, order, chapter, isFree, courseId } = req.body;
    const lesson = await Lesson.create({
      title,
      videoUrl,
      duration,
      order,
      chapter,
      isFree,
      courseId
    });
    res.status(201).json({ success: true, lesson });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/courses/:id/lessons
exports.createLessonForCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, videoUrl, duration, order, chapter, isFree } = req.body;
    // Validate course exists
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    const lesson = await Lesson.create({
      title,
      videoUrl,
      duration,
      order,
      chapter,
      isFree,
      courseId
    });
    res.status(201).json({ success: true, lesson });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
