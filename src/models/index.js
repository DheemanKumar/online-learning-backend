const { sequelize } = require("../config/database");

// Import all models
const User = require("./User");
const Educator = require("./Educator");
const Course = require("./Course");
const Lesson = require("./Lesson");
const LiveClass = require("./LiveClass");
const Enrollment = require("./Enrollment");
const WatchHistory = require("./WatchHistory");
const Test = require("./Test");
const TestAttempt = require("./TestAttempt");
const Subscription = require("./Subscription");
const DoubtSession = require("./DoubtSession");
const StudyMaterial = require("./StudyMaterial");
const Note = require("./Note");
const Resource = require("./Resource");
const StudentInstructorFollow = require("./StudentInstructorFollow");
const Review = require("./Review");

// -----------------------------------
// Define Relationships
// -----------------------------------

// User - Enrollment
User.hasMany(Enrollment, { foreignKey: "userId" });
Enrollment.belongsTo(User, { foreignKey: "userId" });

// Course - Enrollment
Course.hasMany(Enrollment, { foreignKey: "courseId" });
Enrollment.belongsTo(Course, { foreignKey: "courseId" });

// Educator - Course
Educator.hasMany(Course, { foreignKey: "educatorId" });
Course.belongsTo(Educator, { foreignKey: "educatorId" });

// Course - Lesson
Course.hasMany(Lesson, { foreignKey: "courseId" });
Lesson.belongsTo(Course, { foreignKey: "courseId" });

// Course - LiveClass
Course.hasMany(LiveClass, { foreignKey: "courseId" });
LiveClass.belongsTo(Course, { foreignKey: "courseId" });

// Educator - LiveClass
Educator.hasMany(LiveClass, { foreignKey: "educatorId" });
LiveClass.belongsTo(Educator, { foreignKey: "educatorId" });

// User - WatchHistory
User.hasMany(WatchHistory, { foreignKey: "userId" });
WatchHistory.belongsTo(User, { foreignKey: "userId" });

// Lesson - WatchHistory
Lesson.hasMany(WatchHistory, { foreignKey: "lessonId" });
WatchHistory.belongsTo(Lesson, { foreignKey: "lessonId" });

// Course - Test
Course.hasMany(Test, { foreignKey: "courseId" });
Test.belongsTo(Course, { foreignKey: "courseId" });

// Test - TestAttempt
Test.hasMany(TestAttempt, { foreignKey: "testId" });
TestAttempt.belongsTo(Test, { foreignKey: "testId" });

// User - TestAttempt
User.hasMany(TestAttempt, { foreignKey: "userId" });
TestAttempt.belongsTo(User, { foreignKey: "userId" });

// User - Subscription
User.hasOne(Subscription, { foreignKey: "userId" });
Subscription.belongsTo(User, { foreignKey: "userId" });

// Course - StudyMaterial
Course.hasMany(StudyMaterial, { foreignKey: "courseId" });
StudyMaterial.belongsTo(Course, { foreignKey: "courseId" });

// User - DoubtSession
User.hasMany(DoubtSession, { foreignKey: "userId" });
DoubtSession.belongsTo(User, { foreignKey: "userId" });

// Educator - DoubtSession
Educator.hasMany(DoubtSession, { foreignKey: "educatorId" });
DoubtSession.belongsTo(Educator, { foreignKey: "educatorId" });

// User - Note
User.hasMany(Note, { foreignKey: "userId" });
Note.belongsTo(User, { foreignKey: "userId" });

// Lesson - Note
Lesson.hasMany(Note, { foreignKey: "lessonId" });
Note.belongsTo(Lesson, { foreignKey: "lessonId" });

// Lesson - Resource
Lesson.hasMany(Resource, { foreignKey: "lessonId", as: "resources" });
Resource.belongsTo(Lesson, { foreignKey: "lessonId" });

// Associations for StudentInstructorFollow
User.belongsToMany(Educator, {
  through: StudentInstructorFollow,
  as: "followedInstructors",
  foreignKey: "studentId",
  otherKey: "instructorId"
});
Educator.belongsToMany(User, {
  through: StudentInstructorFollow,
  as: "followers",
  foreignKey: "instructorId",
  otherKey: "studentId"
});

// Associations for Review
Course.hasMany(Review, { foreignKey: "courseId" });
Review.belongsTo(Course, { foreignKey: "courseId" });
User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });

// -----------------------------------
// Export all models + sequelize instance
// -----------------------------------
module.exports = {
  sequelize,
  User,
  Educator,
  Course,
  Lesson,
  LiveClass,
  Enrollment,
  WatchHistory,
  Test,
  TestAttempt,
  Subscription,
  DoubtSession,
  StudyMaterial,
  Note,
  Resource,
  StudentInstructorFollow,
  Review,
};
