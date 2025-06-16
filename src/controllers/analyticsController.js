const { Enrollment, Course, Lesson, WatchHistory, LiveClass, Test, TestAttempt, Educator } = require("../models");
const { Op } = require("sequelize");

// GET /api/progress/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    // StreakDays: count unique days with watch history
    const watchHistories = await WatchHistory.findAll({ where: { userId } });
    const streakDays = new Set(watchHistories.map(w => w.lastWatchedAt && w.lastWatchedAt.toISOString().slice(0,10))).size;
    // Total watch time (sum progress * lesson duration)
    let totalWatchTime = 0;
    for (const wh of watchHistories) {
      if (wh.progress && wh.lessonId) {
        const lesson = await Lesson.findByPk(wh.lessonId);
        if (lesson && lesson.duration) {
          const duration = parseInt(lesson.duration) || 0;
          totalWatchTime += Math.round((wh.progress / 100) * duration);
        }
      }
    }
    // Courses enrolled
    const enrollments = await Enrollment.findAll({ where: { userId } });
    const coursesEnrolled = enrollments.length;
    // Courses completed (progress 100)
    const coursesCompleted = enrollments.filter(e => e.progress >= 100).length;
    // Upcoming classes (future live classes in enrolled courses)
    const now = new Date();
    let upcomingClasses = 0;
    for (const e of enrollments) {
      const count = await LiveClass.count({ where: { courseId: e.courseId, scheduledAt: { [Op.gt]: now } } });
      upcomingClasses += count;
    }
    // Pending tests (tests in enrolled courses not attempted)
    let pendingTests = 0;
    for (const e of enrollments) {
      const tests = await Test.findAll({ where: { courseId: e.courseId } });
      for (const t of tests) {
        const attempt = await TestAttempt.findOne({ where: { testId: t.id, userId } });
        if (!attempt) pendingTests++;
      }
    }
    // Weekly progress (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 6);
    const weeklyWatch = Array(7).fill(0);
    const weeklyLessons = Array(7).fill(0);
    for (const wh of watchHistories) {
      if (wh.lastWatchedAt) {
        const dayIdx = Math.floor((new Date(wh.lastWatchedAt) - weekAgo) / (1000*60*60*24));
        if (dayIdx >= 0 && dayIdx < 7) {
          weeklyWatch[dayIdx] += Math.round((wh.progress || 0));
          if (wh.isCompleted) weeklyLessons[dayIdx]++;
        }
      }
    }
    res.json({
      success: true,
      dashboard: {
        streakDays,
        totalWatchTime,
        coursesEnrolled,
        coursesCompleted,
        upcomingClasses,
        pendingTests,
        weeklyProgress: {
          watchTime: weeklyWatch,
          lessonsCompleted: weeklyLessons
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/progress/course/:courseId
exports.getCourseProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;
    const enrollment = await Enrollment.findOne({ where: { userId, courseId } });
    if (!enrollment) return res.status(404).json({ success: false, message: "Not enrolled in course" });
    const course = await Course.findByPk(courseId);
    // Lessons grouped by chapter
    const lessons = await Lesson.findAll({ where: { courseId } });
    const chapters = {};
    lessons.forEach(l => {
      if (!chapters[l.chapter]) chapters[l.chapter] = { name: l.chapter, completedLessons: 0, totalLessons: 0 };
      chapters[l.chapter].totalLessons++;
    });
    // Completed lessons
    const completedLessons = await WatchHistory.findAll({ where: { userId, lessonId: { [Op.in]: lessons.map(l => l.id) }, isCompleted: true } });
    completedLessons.forEach(cl => {
      const lesson = lessons.find(l => l.id === cl.lessonId);
      if (lesson && chapters[lesson.chapter]) chapters[lesson.chapter].completedLessons++;
    });
    // Tests attempted and avg score
    const tests = await Test.findAll({ where: { courseId } });
    const testIds = tests.map(t => t.id);
    const attempts = await TestAttempt.findAll({ where: { userId, testId: { [Op.in]: testIds } } });
    const testsAttempted = attempts.length;
    const avgTestScore = testsAttempted > 0 ? Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / testsAttempted) : 0;
    // Certificate eligibility: 100% progress and at least 1 test attempted
    const certificateEligible = enrollment.progress >= 100 && testsAttempted > 0;
    res.json({
      success: true,
      progress: {
        courseId: parseInt(courseId),
        enrolledOn: enrollment.purchaseDate ? enrollment.purchaseDate.toISOString().slice(0,10) : null,
        validity: enrollment.expiryDate ? enrollment.expiryDate.toISOString().slice(0,10) : null,
        overallProgress: enrollment.progress,
        chapters: Object.values(chapters),
        testsAttempted,
        avgTestScore,
        certificateEligible
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/search
exports.globalSearch = async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Missing search query (q)" });
    const like = { [Op.like]: `%${q}%` };
    let results = { courses: [], educators: [], lessons: [] };
    if (!type || type === "course") {
      results.courses = await Course.findAll({ where: { title: like } });
    }
    if (!type || type === "educator") {
      results.educators = await Educator.findAll({ where: { name: like } });
    }
    if (!type || type === "lesson") {
      results.lessons = await Lesson.findAll({ where: { title: like } });
    }
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
