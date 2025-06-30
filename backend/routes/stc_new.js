const express = require('express');
const { stcController } = require('../controllers/stcController');

const router = express.Router();

// GET /api/stc/trainees - Get all trainees with pagination
router.get('/trainees', async (req, res) => {
  await stcController.getAllTrainees(req, res);
});

// GET /api/stc/trainee/:traineeId - Get specific trainee by ID
router.get('/trainee/:traineeId', async (req, res) => {
  await stcController.getTraineeById(req, res);
});

// GET /api/stc/trainee/ticket/:ticketNo - Get trainee by ticket number
router.get('/trainee/ticket/:ticketNo', async (req, res) => {
  await stcController.getTraineeByTicket(req, res);
});

// GET /api/stc/trainees/search - Search trainees
router.get('/trainees/search', async (req, res) => {
  await stcController.searchTrainees(req, res);
});

// GET /api/stc/trainees/statistics - Get trainee statistics
router.get('/trainees/statistics', async (req, res) => {
  await stcController.getTraineeStatistics(req, res);
});

// GET /api/stc/health - Health check for STC service
router.get('/health', (req, res) => {
  stcController.healthCheck(req, res);
});

// POST /api/stc/register - Submit STC registration form (legacy endpoint)
router.post('/register', async (req, res) => {
  try {
    const formData = req.body;

    // Basic validation
    const requiredFields = ['name', 'email', 'phoneNumber', 'designation'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Log the received data (replace with database save)
    console.log('STC Registration Data:', {
      name: formData.name,
      email: formData.email,
      designation: formData.designation,
      phoneNumber: formData.phoneNumber,
      submittedAt: new Date().toISOString()
    });

    // Success response
    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully',
      data: {
        id: Date.now(),
        submittedAt: new Date().toISOString(),
        name: formData.name,
        email: formData.email
      }
    });

  } catch (error) {
    console.error('STC Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
