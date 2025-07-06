const express = require('express');
const router = express.Router();
const MseWController = require('../controllers/mseWController');
const MseWModel = require('../models/msew');

// Initialize model and controller
const mseWModel = new MseWModel();
const mseWController = new MseWController(mseWModel);

// Main Routes - Using Ticket Number
router.post('/', (req, res) => {
    mseWController.createScore(req, res);
});

router.get('/', (req, res) => {
    mseWController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mseWController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mseWController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mseWController.deleteScoreByTicketNumber(req, res);
});

// Scores with Candidate Details Routes
router.get('/details/all', (req, res) => {
    mseWController.getScoresWithCandidateDetails(req, res);
});

router.get('/details/:ticketNumber', (req, res) => {
    mseWController.getScoreWithCandidateDetails(req, res);
});

// Bulk Operations Routes
router.post('/bulk/upload', (req, res) => {
    mseWController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mseWController.upsertScore(req, res);
});

// Backward Compatibility Routes (Optional)
router.get('/legacy/:id', (req, res) => {
    mseWController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mseWController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mseWController.deleteScore(req, res);
});

module.exports = router;