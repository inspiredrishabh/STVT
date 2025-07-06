const express = require('express');
const router = express.Router();
const MjpWController = require('../controllers/mjpWController');
const MjpWModel = require('../models/mjpw');

// Initialize model and controller
const mjpWModel = new MjpWModel();
const mjpWController = new MjpWController(mjpWModel);

// Main Routes - Using Ticket Number
router.post('/', (req, res) => {
    mjpWController.createScore(req, res);
});

router.get('/', (req, res) => {
    mjpWController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mjpWController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mjpWController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mjpWController.deleteScoreByTicketNumber(req, res);
});

// Scores with Candidate Details Routes
router.get('/details/all', (req, res) => {
    mjpWController.getScoresWithCandidateDetails(req, res);
});

router.get('/details/:ticketNumber', (req, res) => {
    mjpWController.getScoreWithCandidateDetails(req, res);
});

// Bulk Operations Routes
router.post('/bulk/upload', (req, res) => {
    mjpWController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mjpWController.upsertScore(req, res);
});

// Backward Compatibility Routes (Optional)
router.get('/legacy/:id', (req, res) => {
    mjpWController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mjpWController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mjpWController.deleteScore(req, res);
});

module.exports = router;