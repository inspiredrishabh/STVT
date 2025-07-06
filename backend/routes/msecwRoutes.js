const express = require('express');
const router = express.Router();
const MseCwController = require('../controllers/mseCwController');
const MseCwModel = require('../models/msecw');

// Initialize model and controller
const mseCwModel = new MseCwModel();
const mseCwController = new MseCwController(mseCwModel);

// Main Routes - Using Ticket Number
router.post('/', (req, res) => {
    mseCwController.createScore(req, res);
});

router.get('/', (req, res) => {
    mseCwController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mseCwController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mseCwController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mseCwController.deleteScoreByTicketNumber(req, res);
});

// Scores with Candidate Details Routes
router.get('/details/all', (req, res) => {
    mseCwController.getScoresWithCandidateDetails(req, res);
});

router.get('/details/:ticketNumber', (req, res) => {
    mseCwController.getScoreWithCandidateDetails(req, res);
});

// Bulk Operations Routes
router.post('/bulk/upload', (req, res) => {
    mseCwController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mseCwController.upsertScore(req, res);
});

// Backward Compatibility Routes (Optional)
router.get('/legacy/:id', (req, res) => {
    mseCwController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mseCwController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mseCwController.deleteScore(req, res);
});

module.exports = router;