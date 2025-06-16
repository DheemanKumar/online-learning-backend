const { Test, Course, User, TestAttempt } = require("../models");

// GET /api/tests
exports.getTests = async (req, res) => {
  try {
    const { courseId, type, subject } = req.query;
    const where = {};
    if (courseId) where.courseId = courseId;
    if (type) where.type = type;
    if (subject) where.subject = subject;
    const tests = await Test.findAll({ where });
    const result = await Promise.all(tests.map(async t => {
      let questionCount = 0;
      if (t.questionBank && Array.isArray(t.questionBank)) questionCount = t.questionBank.length;
      else if (t.questionBank && typeof t.questionBank === 'string') {
        try {
          const qb = JSON.parse(t.questionBank);
          if (Array.isArray(qb)) questionCount = qb.length;
        } catch {}
      }
      let attemptedBy = 0;
      let avgScore = 0;
      const attempts = await TestAttempt.findAll({ where: { testId: t.id } });
      attemptedBy = attempts.length;
      if (attemptedBy > 0) {
        avgScore = Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attemptedBy);
      }
      return {
        id: t.id,
        title: t.title,
        type: t.type,
        questions: questionCount,
        duration: t.timeLimit || 180,
        maxMarks: t.maxMarks || 360,
        attemptedBy,
        avgScore,
        difficulty: t.difficulty || "moderate",
        courseId: t.courseId
      };
    }));
    res.json({ success: true, tests: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/tests/:id/start
exports.startTest = async (req, res) => {
  try {
    const testId = req.params.id;
    const test = await Test.findByPk(testId);
    if (!test) return res.status(404).json({ success: false, message: "Test not found" });
    // Parse questions from questionBank
    let questions = [];
    if (test.questionBank) {
      if (Array.isArray(test.questionBank)) questions = test.questionBank;
      else if (typeof test.questionBank === 'string') {
        try {
          questions = JSON.parse(test.questionBank);
        } catch {}
      }
    }
    // Optionally, randomize or select subset for the session
    // For now, return all
    const now = new Date();
    const end = new Date(now.getTime() + (test.timeLimit || 180) * 60 * 1000);
    res.json({
      success: true,
      testSession: {
        sessionId: `TEST_SESSION_${testId}_${now.getTime()}`,
        startTime: now.toISOString(),
        endTime: end.toISOString(),
        questions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/tests/:sessionId/submit
exports.submitTest = async (req, res) => {
  try {
    // In a real implementation, evaluate answers, calculate score, store attempt
    // For now, simulate result
    const { answers } = req.body;
    // TODO: Evaluate answers against correct answers in DB
    res.json({
      success: true,
      result: {
        score: 245, // placeholder
        maxScore: 360, // placeholder
        rank: 1250, // placeholder
        percentile: 85.5, // placeholder
        correct: 65, // placeholder
        incorrect: 20, // placeholder
        unattempted: 5, // placeholder
        analysis: {
          physics: {
            score: 85,
            accuracy: "71%"
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/courses/:id/tests
exports.createTestForCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, type, questionBank, timeLimit, maxMarks, difficulty } = req.body;
    // Validate course exists
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    const test = await Test.create({
      title,
      type,
      questionBank,
      timeLimit,
      maxMarks,
      difficulty,
      courseId
    });
    res.status(201).json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
