require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./src/models"); // includes sequelize and all models

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/courses", require("./src/routes/courseRoutes"));
app.use("/api/lessons", require("./src/routes/lessonRoutes")); // Registering lesson routes
app.use("/api/live-classes", require("./src/routes/liveClassRoutes")); // Registering live class routes
app.use("/api/tests", require("./src/routes/testRoutes")); // Registering test routes
app.use("/api/educators", require("./src/routes/educatorRoutes")); // Registering educator routes
app.use("/api/students", require("./src/routes/studentRoutes")); // Registering student routes
app.use("/api/progress", require("./src/routes/analyticsRoutes")); // Registering analytics/progress routes
app.use("/api/subscriptions", require("./src/routes/subscriptionRoutes")); // Registering subscription routes
app.use("/api/doubts", require("./src/routes/doubtRoutes")); // Registering doubt routes
app.use("/api/materials", require("./src/routes/materialRoutes")); // Registering material routes

// Start server with error handling
(async () => {
  try {
    // Clean up any lingering Educators_backup table (Sequelize/SQLite bug workaround)
    await db.sequelize.query('DROP TABLE IF EXISTS Educators_backup;');
    // Only sync schema, do not alter on every restart (prevents backup/constraint errors)
    await db.sequelize.sync();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
