const express = require('express');
const router = express.Router();
const MjrDController = require('../controllers/mjrDController');
const MjrDModel = require('../models/mjrd');
const StcModel = require('../models/stcModel');

// Initialize models and controller
const mjrDModel = new MjrDModel();
const stcModel = new StcModel();
const mjrDController = new MjrDController(mjrDModel, stcModel);

// Main CRUD Routes - Using Ticket Number
router.post('/', (req, res) => {
    mjrDController.createScore(req, res);
});

router.get('/', (req, res) => {
    mjrDController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mjrDController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mjrDController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mjrDController.deleteScoreByTicketNumber(req, res);
});

// Paper-specific Updates
router.put('/:ticketNumber/paper/:paperCode', (req, res) => {
    mjrDController.updatePaperMarks(req, res);
});

// Marks Summary and Details
router.get('/:ticketNumber/summary', (req, res) => {
    mjrDController.getMarksSummary(req, res);
});

router.get('/details/with-candidates', (req, res) => {
    mjrDController.getScoresWithCandidateDetails(req, res);
});

router.get('/:ticketNumber/details', (req, res) => {
    mjrDController.getScoreWithCandidateDetails(req, res);
});

// Session-wise Routes
router.get('/:ticketNumber/session/:session', (req, res) => {
    mjrDController.getSessionMarks(req, res);
});

router.get('/analysis/session/:session', (req, res) => {
    mjrDController.getSessionAnalysis(req, res);
});

router.get('/analysis/course/overview', (req, res) => {
    mjrDController.getCourseAnalysis(req, res);
});

// Bulk Operations
router.post('/bulk/upload', (req, res) => {
    mjrDController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mjrDController.upsertScore(req, res);
});

// Backward Compatibility Routes
router.get('/legacy/:id', (req, res) => {
    mjrDController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mjrDController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mjrDController.deleteScore(req, res);
});

module.exports = router;