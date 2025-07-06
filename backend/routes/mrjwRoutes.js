const express = require('express');
const router = express.Router();
const MjrWController = require('../controllers/mjrWController');
const MjrWModel = require('../models/mjrw');

// Initialize model and controller
const mjrWModel = new MjrWModel();
const mjrWController = new MjrWController(mjrWModel);

// Main Routes - Using Ticket Number
router.post('/', (req, res) => {
    mjrWController.createScore(req, res);
});

router.get('/', (req, res) => {
    mjrWController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mjrWController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mjrWController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mjrWController.deleteScoreByTicketNumber(req, res);
});

// Scores with Candidate Details Routes
router.get('/details/all', (req, res) => {
    mjrWController.getScoresWithCandidateDetails(req, res);
});

router.get('/details/:ticketNumber', (req, res) => {
    mjrWController.getScoreWithCandidateDetails(req, res);
});

// Bulk Operations Routes
router.post('/bulk/upload', (req, res) => {
    mjrWController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mjrWController.upsertScore(req, res);
});

// Backward Compatibility Routes (Optional)
router.get('/legacy/:id', (req, res) => {
    mjrWController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mjrWController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mjrWController.deleteScore(req, res);
});

module.exports = router;