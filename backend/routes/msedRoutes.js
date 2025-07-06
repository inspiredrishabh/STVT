const express = require('express');
const router = express.Router();
const MseDController = require('../controllers/mseDController');
const MseDModel = require('../models/msed');

// Initialize model and controller
const mseDModel = new MseDModel();
const mseDController = new MseDController(mseDModel);

// Main Routes - Using Ticket Number
router.post('/', (req, res) => {
    mseDController.createScore(req, res);
});

router.get('/', (req, res) => {
    mseDController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mseDController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mseDController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mseDController.deleteScoreByTicketNumber(req, res);
});

// Scores with Candidate Details Routes
router.get('/details/all', (req, res) => {
    mseDController.getScoresWithCandidateDetails(req, res);
});

router.get('/details/:ticketNumber', (req, res) => {
    mseDController.getScoreWithCandidateDetails(req, res);
});

// Bulk Operations Routes
router.post('/bulk/upload', (req, res) => {
    mseDController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mseDController.upsertScore(req, res);
});

// Backward Compatibility Routes (Optional)
router.get('/legacy/:id', (req, res) => {
    mseDController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mseDController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mseDController.deleteScore(req, res);
});

module.exports = router;