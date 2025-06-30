const express = require("express");
const cors = require("cors");
const stcRoutes = require("./routes/stc");
const wtcRoutes = require("./routes/wtcRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/stc", stcRoutes);
app.use("/api/wtc", wtcRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 STC API endpoint: http://localhost:${PORT}/api/stc`);
  console.log(`📡 WTC API endpoint: http://localhost:${PORT}/api/wtc`);
});

module.exports = app;
module.exports = app;
