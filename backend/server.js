const express = require("express");
const cors = require("cors");
const path = require("path");
const { initializeDatabase } = require("./config/db");
const fs = require("fs");
const os = require("os");

// this code is for progamatically scheduling backups at 3 AM daily and system startup backup
// Uncomment the following lines to enable automatic backups


// const cron = require('node-cron');
// const { createBackup } = require('./scripts/backupDatabase');


// Create a backup when the server starts
// console.log('Creating startup backup...');
// const startupBackupResult = createBackup();
// if (startupBackupResult.success) {
//   console.log('Startup backup completed successfully');
// } else {
//   console.error(`Startup backup failed: ${startupBackupResult.error}`);
// }


// Schedule backup daily at 3 AM
// cron.schedule('0 3 * * *', () => {
//   console.log('Running scheduled database backup...');
//   const result = createBackup();
//   if (result.success) {
//     console.log('Scheduled backup completed successfully');
//   } else {
//     console.error(`Scheduled backup failed: ${result.error}`);
//   }
// });

// You can also add an endpoint to trigger manual backups
// app.post('/api/admin/backup', (req, res) => {
//   const result = createBackup();
//   if (result.success) {
//     res.status(200).json({ message: 'Backup completed successfully' });
//   } else {
//     res.status(500).json({ error: result.error });
//   }
// });

// Import routes
const authRoutes = require("./routes/authRoutes");
const stcRoutes = require("./routes/stcRoutes");
const wtcRoutes = require("./routes/wtcRoutes");
const nonRailwayRoutes = require("./routes/nonRailwayRoutes");
const monthlyAttendanceRoutes = require("./routes/monthlyAttendanceRoutes");
const lineTrainingRoutes = require("./routes/lineTrainingRoutes");
// for exporting database tables to excel or csv
const exportRoutes = require("./routes/exportRoutes");
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
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/stc", stcRoutes);
app.use("/api/wtc", wtcRoutes);
app.use("/api/nonrailway", nonRailwayRoutes);
app.use("/api/monthly-attendance", monthlyAttendanceRoutes);
app.use("/api/export-database", exportRoutes);

// Line‐Training
app.use("/api/line-trainings", lineTrainingRoutes);

//12 Course‐specific
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

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

function updateFrontendEnv(ip) {
  const envPath = path.join(__dirname, "../frontend/.env");
  let envContent = fs.readFileSync(envPath, "utf-8");
  envContent = envContent.replace(
    /VITE_BACKEND_IP=.*/g,
    `VITE_BACKEND_IP=${ip}`
  );
  fs.writeFileSync(envPath, envContent, "utf-8");
}

const PORT = process.env.PORT || 5000;
const localIP = getLocalIP();
updateFrontendEnv(localIP);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}/api`);
  console.log(`Network: http://${localIP}:${PORT}/api`);
});
