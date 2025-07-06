const express = require('express');
const router = express.Router();
const MjpCwController = require('../controllers/mjpcwController');
const MjpCwModel = require('../models/mjpcw');

// Initialize model and controller
const mjpCwModel = new MjpCwModel();
const mjpCwController = new MjpCwController(mjpCwModel);

// Main Routes - Using Ticket Number
router.post('/', (req, res) => {
    mjpCwController.createScore(req, res);
});

router.get('/', (req, res) => {
    mjpCwController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mjpCwController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mjpCwController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mjpCwController.deleteScoreByTicketNumber(req, res);
});

// Scores with Candidate Details Routes
router.get('/details/all', (req, res) => {
    mjpCwController.getScoresWithCandidateDetails(req, res);
});

router.get('/details/:ticketNumber', (req, res) => {
    mjpCwController.getScoreWithCandidateDetails(req, res);
});

// Bulk Operations Routes
router.post('/bulk/upload', (req, res) => {
    mjpCwController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mjpCwController.upsertScore(req, res);
});

// Backward Compatibility Routes (Optional)
router.get('/legacy/:id', (req, res) => {
    mjpCwController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mjpCwController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mjpCwController.deleteScore(req, res);
});

module.exports = router; 