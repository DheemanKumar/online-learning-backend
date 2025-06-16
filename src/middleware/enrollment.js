// Enrollment verification middleware
module.exports = (EnrollmentModel) => async (req, res, next) => {
  const userId = req.user.id;
  const courseId = req.params.courseId || req.body.courseId || req.params.id;
  const enrolled = await EnrollmentModel.findOne({ where: { userId, courseId } });
  if (!enrolled) return res.status(403).json({ success: false, message: "Not enrolled in course" });
  next();
};
