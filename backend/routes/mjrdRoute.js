const express = require('express');
const router = express.Router();
const MjrDController = require('../controllers/mjrDController');
const MjrDModel = require('../models/mjrd');

// Initialize model and controller
const mjrDModel = new MjrDModel();
const mjrDController = new MjrDController(mjrDModel);

// Main Routes - Using Ticket Number
router.post('/', (req, res) => {
    mjrDController.createScore(req, res);
});

router.get('/', (req, res) => {
    mjrDController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mjrDController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mjrDController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mjrDController.deleteScoreByTicketNumber(req, res);
});

// Scores with Candidate Details Routes
router.get('/details/all', (req, res) => {
    mjrDController.getScoresWithCandidateDetails(req, res);
});

router.get('/details/:ticketNumber', (req, res) => {
    mjrDController.getScoreWithCandidateDetails(req, res);
});

// Bulk Operations Routes
router.post('/bulk/upload', (req, res) => {
    mjrDController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mjrDController.upsertScore(req, res);
});

// Backward Compatibility Routes (Optional)
router.get('/legacy/:id', (req, res) => {
    mjrDController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mjrDController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mjrDController.deleteScore(req, res);
});

module.exports = router;