const express = require('express');
const router = express.Router();
const MjpWController = require('../controllers/mjpwController');
const MjpWModel = require('../models/mjpw');
const StcModel = require('../models/stcModel');

// Initialize models and controller
const mjpWModel = new MjpWModel();
const stcModel = new StcModel();
const mjpWController = new MjpWController(mjpWModel, stcModel);

// Main CRUD Routes - Using Ticket Number
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

// Paper-specific Updates
router.put('/:ticketNumber/paper/:paperCode', (req, res) => {
    mjpWController.updatePaperMarks(req, res);
});

// Marks Summary and Details
router.get('/:ticketNumber/summary', (req, res) => {
    mjpWController.getMarksSummary(req, res);
});

router.get('/details/with-candidates', (req, res) => {
    mjpWController.getScoresWithCandidateDetails(req, res);
});

router.get('/:ticketNumber/details', (req, res) => {
    mjpWController.getScoreWithCandidateDetails(req, res);
});

// Session-wise Routes
router.get('/:ticketNumber/session/:session', (req, res) => {
    mjpWController.getSessionMarks(req, res);
});

router.get('/analysis/session/:session', (req, res) => {
    mjpWController.getSessionAnalysis(req, res);
});

router.get('/analysis/course/overview', (req, res) => {
    mjpWController.getCourseAnalysis(req, res);
});

// Bulk Operations
router.post('/bulk/upload', (req, res) => {
    mjpWController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mjpWController.upsertScore(req, res);
});

// Backward Compatibility Routes
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