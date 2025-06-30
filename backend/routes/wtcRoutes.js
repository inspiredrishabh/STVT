const express = require('express');
const { wtcController, upload } = require('../controllers/wtcController');

const router = express.Router();

// POST /api/wtc/submit - Submit WTC registration form
router.post('/submit', upload.single('picture'), async (req, res) => {
  await wtcController.submitRegistration(req, res);
});

// GET /api/wtc/registration/:registrationId - Get specific registration
router.get('/registration/:registrationId', async (req, res) => {
  await wtcController.getRegistration(req, res);
});

// GET /api/wtc/registrations - Get all registrations with pagination
router.get('/registrations', async (req, res) => {
  await wtcController.getAllRegistrations(req, res);
});

// PUT /api/wtc/registration/:registrationId/status - Update registration status
router.put('/registration/:registrationId/status', async (req, res) => {
  await wtcController.updateRegistrationStatus(req, res);
});

// GET /api/wtc/search - Search registrations
router.get('/search', async (req, res) => {
  await wtcController.searchRegistrations(req, res);
});

// GET /api/wtc/statistics - Get registration statistics
router.get('/statistics', async (req, res) => {
  await wtcController.getStatistics(req, res);
});

// GET /api/wtc/health - Health check for WTC service
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'WTC Registration API',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/wtc/submit',
      'GET /api/wtc/registration/:id',
      'GET /api/wtc/registrations',
      'PUT /api/wtc/registration/:id/status',
      'GET /api/wtc/search',
      'GET /api/wtc/statistics',
      'GET /api/wtc/health'
    ]
  });
});

module.exports = router;
