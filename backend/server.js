const express = require("express");
const cors = require("cors");
const path = require("path");
const { initializeDatabase } = require("./config/db");
// TEST COMMIT to back safe commit before major changes

// Import routes
const authRoutes = require("./routes/authRoutes");
const stcRoutes = require("./routes/stcRoutes");
const wtcRoutes = require("./routes/wtcRoutes");
const nonRailwayRoutes = require("./routes/nonRailwayRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const lineTrainingRoutes = require("./routes/lineTrainingRoutes");

const exportRoutes = require('./routes/exportRoutes');
// Course‐specific routes (12 total)
const mjiCwRoutes = require("./routes/mjicwRoutes");
const mjidRoutes = require("./routes/mjidRoutes");
const mjiwRoutes = require("./routes/mjiwRoutes");
const mjpCwRoutes = require("./routes/mjpcwRoutes");
const mjpdRoutes = require("./routes/mjpdRoutes");
const mjpwRoutes = require("./routes/mjpwRoute");
const mjrCwRoutes = require("./routes/mjrcwRoute");
const mjrdRoutes = require("./routes/mjrdRoute");
const mjrwRoutes = require("./routes/mrjwRoutes");
const mseCwRoutes = require("./routes/msecwRoutes");
const msedRoutes = require("./routes/msedRoutes");
const msewRoutes = require("./routes/msewRoutes");

const app = express();

// Initialize the database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/stc", stcRoutes);
app.use("/api/wtc", wtcRoutes);
app.use("/api/nonrailway", nonRailwayRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use('/api/export-database', exportRoutes);

// Line‐Training
app.use("/api/line-trainings", lineTrainingRoutes);

// Course‐specific
app.use("/api/mse-c&w", mseCwRoutes);
app.use("/api/mse-d", msedRoutes);
app.use("/api/mse-w", msewRoutes);
app.use("/api/mjr-c&w", mjrCwRoutes);
app.use("/api/mjr-d", mjrdRoutes);
app.use("/api/mjr-w", mjrwRoutes);
app.use("/api/mji-c&w", mjiCwRoutes);
app.use("/api/mji-d", mjidRoutes);
app.use("/api/mji-w", mjiwRoutes);
app.use("/api/mjp-c&w", mjpCwRoutes);
app.use("/api/mjp-d", mjpdRoutes);
app.use("/api/mjp-w", mjpwRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Trainee Management System API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler (must come after all app.use('/api/...'))
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 API Documentation:`);
  console.log(`126*27 : ${126 * 27}`);
  console.log(`   Local: http://localhost:${PORT}/api`);
  console.log(`   Network: http://192.168.29.89:${PORT}/api`);
  console.log(`   STC: http://192.168.29.89:${PORT}/api/stc`);
  console.log(`   WTC: http://192.168.29.89:${PORT}/api/wtc`);
  console.log(`   NonRailway: http://192.168.29.89:${PORT}/api/nonrailway`);
});
