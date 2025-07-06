const express = require('express');
const router = express.Router();
const MjrCwController = require('../controllers/mjrCwController');
const MjrCwModel = require('../models/mjrcw');

// Initialize model and controller
const mjrCwModel = new MjrCwModel();
const mjrCwController = new MjrCwController(mjrCwModel);

// Main Routes - Using Ticket Number
router.post('/', (req, res) => {
    mjrCwController.createScore(req, res);
});

router.get('/', (req, res) => {
    mjrCwController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mjrCwController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mjrCwController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mjrCwController.deleteScoreByTicketNumber(req, res);
});

// Scores with Candidate Details Routes
router.get('/details/all', (req, res) => {
    mjrCwController.getScoresWithCandidateDetails(req, res);
});

router.get('/details/:ticketNumber', (req, res) => {
    mjrCwController.getScoreWithCandidateDetails(req, res);
});

// Bulk Operations Routes
router.post('/bulk/upload', (req, res) => {
    mjrCwController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mjrCwController.upsertScore(req, res);
});

// Backward Compatibility Routes (Optional)
router.get('/legacy/:id', (req, res) => {
    mjrCwController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mjrCwController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mjrCwController.deleteScore(req, res);
});

module.exports = router;

