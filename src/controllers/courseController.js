const { Course, Educator, Enrollment, User, Lesson, Review } = require("../models");

exports.getCourses = async (req, res) => {
  const { exam, subject, language, type, educator, sort } = req.query;

  const where = {};
  if (exam) where.targetExam = exam;
  if (language) where.language = language;
  if (type) where.type = type;
  if (educator) where.educatorId = educator;

  const order = [];
  if (sort === "popular") order.push(["enrolledStudents", "DESC"]);
  if (sort === "price") order.push(["discountedPrice", "ASC"]);
  if (sort === "rating") order.push(["rating", "DESC"]);

  const courses = await Course.findAll({
    where,
    include: [{ model: Educator, attributes: ["id", "name", "rating"] }],
    order,
  });

  res.json({ success: true, courses });
};

exports.getCourseById = async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [
      {
        model: Educator,
        attributes: ["id", "name", "credentials", "yearsOfExperience", "rating"],
      },
      {
        model: Lesson,
        attributes: ["id", "title", "duration", "isFree", "chapter"],
      },
    ],
  });

  if (!course) return res.status(404).json({ success: false, message: "Course not found" });
  console.error("Course found:");

  console.log("Course:", course);
console.log("Lessons:", course.Lessons);

  // Transform syllabus
  const grouped = {};
  course.Lessons.forEach((l) => {
    if (!grouped[l.chapter]) grouped[l.chapter] = [];
    grouped[l.chapter].push(l);
  });

  const syllabus = Object.entries(grouped).map(([chapter, lessons]) => ({
    chapter,
    lessons,
  }));

  res.json({
    success: true,
    course: {
      ...course.toJSON(),
      syllabus,
    },
  });
};

exports.enrollInCourse = async (req, res) => {
  const userId = req.user.id;
  const courseId = req.params.id;

  // Use correct field names for Enrollment model
  const existing = await Enrollment.findOne({ where: { userId, courseId } });
  if (existing) return res.status(400).json({ success: false, message: "Already enrolled" });

  await Enrollment.create({ userId, courseId });

  await Course.increment("enrolledStudents", { where: { id: courseId } });

  res.json({ success: true, message: "Enrolled successfully" });
};


exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      educatorId,
      targetExam,
      duration,
      totalLessons,
      language,
      price,
      discountedPrice,
      rating,
      enrolledStudents,
      thumbnail,
      highlights,
      type
    } = req.body;

    const course = await Course.create({
      title,
      educatorId,
      targetExam,
      duration,
      totalLessons,
      language,
      price,
      discountedPrice,
      rating,
      enrolledStudents,
      thumbnail,
      highlights,
      type
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/courses/:id/review
exports.reviewCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;
    const { rating, review } = req.body;
    if (!rating) return res.status(400).json({ success: false, message: "Rating is required" });
    // Check enrollment
    const enrolled = await Enrollment.findOne({ where: { userId, courseId } });
    if (!enrolled) return res.status(403).json({ success: false, message: "Not enrolled in course" });
    // Prevent duplicate review
    const existing = await Review.findOne({ where: { userId, courseId } });
    if (existing) return res.status(400).json({ success: false, message: "Already reviewed" });
    const newReview = await Review.create({ userId, courseId, rating, review });
    // Optionally update course average rating
    const reviews = await Review.findAll({ where: { courseId } });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Course.update({ rating: avg }, { where: { id: courseId } });
    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
