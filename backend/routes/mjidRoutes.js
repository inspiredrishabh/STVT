const express = require('express');
const router = express.Router();
const MjiDController = require('../controllers/mjiDController');
const MjiDModel = require('../models/mjid');

// Initialize model and controller
const mjiDModel = new MjiDModel();
const mjiDController = new MjiDController(mjiDModel);

// Main Routes - Using Ticket Number
router.post('/', (req, res) => {
    mjiDController.createScore(req, res);
});

router.get('/', (req, res) => {
    mjiDController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mjiDController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mjiDController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mjiDController.deleteScoreByTicketNumber(req, res);
});

// Scores with Candidate Details Routes
router.get('/details/all', (req, res) => {
    mjiDController.getScoresWithCandidateDetails(req, res);
});

router.get('/details/:ticketNumber', (req, res) => {
    mjiDController.getScoreWithCandidateDetails(req, res);
});

// Bulk Operations Routes
router.post('/bulk/upload', (req, res) => {
    mjiDController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mjiDController.upsertScore(req, res);
});

// Backward Compatibility Routes (Optional)
router.get('/legacy/:id', (req, res) => {
    mjiDController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mjiDController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mjiDController.deleteScore(req, res);
});

module.exports = router;