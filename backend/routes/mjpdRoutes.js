const express = require('express');
const router = express.Router();
const MjpDController = require('../controllers/mjpDController');
const MjpDModel = require('../models/mjpd');
const StcModel = require('../models/stcModel');

// Initialize models and controller
const mjpDModel = new MjpDModel();
const stcModel = new StcModel();
const mjpDController = new MjpDController(mjpDModel, stcModel);

// Main CRUD Routes - Using Ticket Number
router.post('/', (req, res) => {
    mjpDController.createScore(req, res);
});

router.get('/', (req, res) => {
    mjpDController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mjpDController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mjpDController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mjpDController.deleteScoreByTicketNumber(req, res);
});

// Paper-specific Updates
router.put('/:ticketNumber/paper/:paperCode', (req, res) => {
    mjpDController.updatePaperMarks(req, res);
});

// Marks Summary and Details
router.get('/:ticketNumber/summary', (req, res) => {
    mjpDController.getMarksSummary(req, res);
});

router.get('/details/with-candidates', (req, res) => {
    mjpDController.getScoresWithCandidateDetails(req, res);
});

router.get('/:ticketNumber/details', (req, res) => {
    mjpDController.getScoreWithCandidateDetails(req, res);
});

// Session-wise Routes
router.get('/:ticketNumber/session/:session', (req, res) => {
    mjpDController.getSessionMarks(req, res);
});

router.get('/analysis/session/:session', (req, res) => {
    mjpDController.getSessionAnalysis(req, res);
});

router.get('/analysis/course/overview', (req, res) => {
    mjpDController.getCourseAnalysis(req, res);
});

// Bulk Operations
router.post('/bulk/upload', (req, res) => {
    mjpDController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mjpDController.upsertScore(req, res);
});

// Backward Compatibility Routes
router.get('/legacy/:id', (req, res) => {
    mjpDController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mjpDController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mjpDController.deleteScore(req, res);
});

module.exports = router;