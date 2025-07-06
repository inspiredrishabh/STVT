const express = require('express');
const router = express.Router();
const MjiDController = require('../controllers/mjiDController');
const MjiDModel = require('../models/mjid');
const StcModel = require('../models/stcModel');

// Initialize models and controller
const mjiDModel = new MjiDModel();
const stcModel = new StcModel();
const mjiDController = new MjiDController(mjiDModel, stcModel);

// Main CRUD Routes - Using Ticket Number
router.post('/', (req, res) => {
    mjiDController.createScore(req, res);
});

router.get('/', (req, res) => {
    mjiDController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mjiDController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mjiDController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mjiDController.deleteScoreByTicketNumber(req, res);
});

// Paper-specific Updates
router.put('/:ticketNumber/paper/:paperCode', (req, res) => {
    mjiDController.updatePaperMarks(req, res);
});

// Marks Summary and Details
router.get('/:ticketNumber/summary', (req, res) => {
    mjiDController.getMarksSummary(req, res);
});

router.get('/details/with-candidates', (req, res) => {
    mjiDController.getScoresWithCandidateDetails(req, res);
});

router.get('/:ticketNumber/details', (req, res) => {
    mjiDController.getScoreWithCandidateDetails(req, res);
});

// Session-wise Routes
router.get('/:ticketNumber/session/:session', (req, res) => {
    mjiDController.getSessionMarks(req, res);
});

router.get('/analysis/session/:session', (req, res) => {
    mjiDController.getSessionAnalysis(req, res);
});

router.get('/analysis/course/overview', (req, res) => {
    mjiDController.getCourseAnalysis(req, res);
});

// Bulk Operations
router.post('/bulk/upload', (req, res) => {
    mjiDController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mjiDController.upsertScore(req, res);
});

// Backward Compatibility Routes
router.get('/legacy/:id', (req, res) => {
    mjiDController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mjiDController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mjiDController.deleteScore(req, res);
});

module.exports = router;