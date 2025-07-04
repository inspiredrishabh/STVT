const express = require('express');
const cors = require('cors');
const path = require('path');
const upload = require('./middleware/upload');
const StcController = require('./controllers/stcController');
const StcModel = require('./models/stcModel');

const stcModel = new StcModel();
const stcController = new StcController(stcModel);

// Import routes
const authRoutes = require('./routes/authRoutes');
const stcRoutes = require('./routes/stcRoutes');
const wtcRoutes = require('./routes/wtcRoutes');
const mjiCwRoutes = require('./routes/mjiCwRoutes');
const nonRailwayRoutes = require('./routes/nonRailwayRoutes');
const { initializeDatabase } = require('./config/db');
const MjiCwController = require('./controllers/mjiCwController');
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
/* app.use('/api/stc', stcRoutes); */  //no need now , i am hardcoding every route , no need for stcRoutes file , no extra file no extra hochpoch
app.use('/api/wtc', wtcRoutes);
app.use('/api/nonrailway', nonRailwayRoutes);
app.use('/api/mji-cw', mjiCwRoutes)

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Trainee Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// To add stc_candidate 
app.post('/api/stc', upload.single('image'), (req, res) => {
    stcController.createCandidate(req, res);
});

//to show the stc_candidates data on frontend 
app.get('/api/stc', (req, res) => {
    stcController.getCandidates(req, res);
});

app.get('/api/stc/:ticketNumber', (req, res) => {
    stcController.getCandidateByTicketNumber(req, res);
});


app.get('/test', (req,res) =>{
  res.send("Heey ready to see stc candidates  ");
})


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