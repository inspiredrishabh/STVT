const express = require('express');
const router = express.Router();
const MjpCwController = require('../controllers/mjpCwController');
const MjpCwModel = require('../models/mjpcw');
const StcModel = require('../models/stcModel');

// Initialize models and controller
const mjpCwModel = new MjpCwModel();
const stcModel = new StcModel();
const mjpCwController = new MjpCwController(mjpCwModel, stcModel);

// Main CRUD Routes - Using Ticket Number
router.post('/', (req, res) => {
    mjpCwController.createScore(req, res);
});

router.get('/', (req, res) => {
    mjpCwController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mjpCwController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mjpCwController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mjpCwController.deleteScoreByTicketNumber(req, res);
});

// Paper-specific Updates
router.put('/:ticketNumber/paper/:paperCode', (req, res) => {
    mjpCwController.updatePaperMarks(req, res);
});

// Marks Summary and Details
router.get('/:ticketNumber/summary', (req, res) => {
    mjpCwController.getMarksSummary(req, res);
});

router.get('/details/with-candidates', (req, res) => {
    mjpCwController.getScoresWithCandidateDetails(req, res);
});

router.get('/:ticketNumber/details', (req, res) => {
    mjpCwController.getScoreWithCandidateDetails(req, res);
});

// Session-wise Routes
router.get('/:ticketNumber/session/:session', (req, res) => {
    mjpCwController.getSessionMarks(req, res);
});

router.get('/analysis/session/:session', (req, res) => {
    mjpCwController.getSessionAnalysis(req, res);
});

router.get('/analysis/course/overview', (req, res) => {
    mjpCwController.getCourseAnalysis(req, res);
});

// Bulk Operations
router.post('/bulk/upload', (req, res) => {
    mjpCwController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mjpCwController.upsertScore(req, res);
});

// Backward Compatibility Routes
router.get('/legacy/:id', (req, res) => {
    mjpCwController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mjpCwController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mjpCwController.deleteScore(req, res);
});

module.exports = router;