const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const stcRoutes = require('./routes/stcRoutes');
const wtcRoutes = require('./routes/wtcRoutes');
const mjiCwRoutes = require('./routes/mjicwRoutes');
const mjpCwRoutes = require('./routes/mjpcwRoutes');
const nonRailwayRoutes = require('./routes/nonRailwayRoutes');
const {  initializeDatabase } = require('./config/db');
const app = express();

// Initialize the database
initializeDatabase();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stc', stcRoutes);
app.use('/api/wtc', wtcRoutes);
app.use('/api/nonrailway', nonRailwayRoutes);
app.use('/api/mjicw', mjiCwRoutes)
app.use('/api/mjpcw', mjpCwRoutes )

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Trainee Management System API is running',
    timestamp: new Date().toISOString()
  });
});


// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 API Documentation:`);
  console.log(`   STC: http://localhost:${PORT}/api/stc`);
  console.log(`   WTC: http://localhost:${PORT}/api/wtc`);
  console.log(`   NonRailway: http://localhost:${PORT}/api/nonrailway`);
});

module.exports = app;