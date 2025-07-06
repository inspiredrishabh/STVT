const express = require('express');
const router = express.Router();
const MjiWController = require('../controllers/mjiWController');
const MjiWModel = require('../models/mjiw');

// Initialize model and controller
const mjiWModel = new MjiWModel();
const mjiWController = new MjiWController(mjiWModel);

// Main Routes - Using Ticket Number
router.post('/', (req, res) => {
    mjiWController.createScore(req, res);
});

router.get('/', (req, res) => {
    mjiWController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mjiWController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mjiWController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mjiWController.deleteScoreByTicketNumber(req, res);
});

// Scores with Candidate Details Routes
router.get('/details/all', (req, res) => {
    mjiWController.getScoresWithCandidateDetails(req, res);
});

router.get('/details/:ticketNumber', (req, res) => {
    mjiWController.getScoreWithCandidateDetails(req, res);
});

// Bulk Operations Routes
router.post('/bulk/upload', (req, res) => {
    mjiWController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mjiWController.upsertScore(req, res);
});

// Backward Compatibility Routes (Optional)
router.get('/legacy/:id', (req, res) => {
    mjiWController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mjiWController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mjiWController.deleteScore(req, res);
});

module.exports = router;