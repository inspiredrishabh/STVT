const express = require('express');
const router = express.Router();
const MjiCwController = require('../controllers/mjicwController');
const MjiCwModel = require('../models/mjicw');

// router.use(express.json({limit:'2mb'}));

// Initialize model and controller
const mjiCwModel = new MjiCwModel();
const mjiCwController = new MjiCwController(mjiCwModel);

// Main Routes - Using Ticket Number
router.post('/', (req, res) => {
    mjiCwController.createScore(req, res);
});

router.get('/', (req, res) => {
    mjiCwController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mjiCwController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mjiCwController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mjiCwController.deleteScoreByTicketNumber(req, res);
});

// Scores with Candidate Details Routes
router.get('/details/all', (req, res) => {
    mjiCwController.getScoresWithCandidateDetails(req, res);
});

router.get('/details/:ticketNumber', (req, res) => {
    mjiCwController.getScoreWithCandidateDetails(req, res);
});

// Bulk Operations Routes
router.post('/bulk/upload', (req, res) => {
    mjiCwController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mjiCwController.upsertScore(req, res);
});

// Backward Compatibility Routes (Optional)
router.get('/legacy/:id', (req, res) => {
    mjiCwController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mjiCwController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mjiCwController.deleteScore(req, res);
});

module.exports = router;