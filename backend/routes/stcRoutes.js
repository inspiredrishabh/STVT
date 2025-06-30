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

module.exports = router;
