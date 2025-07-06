const express = require('express');
const router = express.Router();
const MjpDController = require('../controllers/mjpdController');
const MjpDModel = require('../models/mjpd');

// Initialize model and controller
const mjpDModel = new MjpDModel();
const mjpDController = new MjpDController(mjpDModel);

// Main Routes - Using Ticket Number
router.post('/', (req, res) => {
    mjpDController.createScore(req, res);
});

router.get('/', (req, res) => {
    mjpDController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mjpDController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mjpDController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mjpDController.deleteScoreByTicketNumber(req, res);
});

// Scores with Candidate Details Routes
router.get('/details/all', (req, res) => {
    mjpDController.getScoresWithCandidateDetails(req, res);
});

router.get('/details/:ticketNumber', (req, res) => {
    mjpDController.getScoreWithCandidateDetails(req, res);
});

// Bulk Operations Routes
router.post('/bulk/upload', (req, res) => {
    mjpDController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mjpDController.upsertScore(req, res);
});

// Backward Compatibility Routes (Optional)
router.get('/legacy/:id', (req, res) => {
    mjpDController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mjpDController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mjpDController.deleteScore(req, res);
});

module.exports = router;