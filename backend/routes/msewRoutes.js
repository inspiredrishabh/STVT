const express = require('express');
const router = express.Router();
const MseWController = require('../controllers/mseWController');
const MseWModel = require('../models/msew');
const StcModel = require('../models/stcModel');

// Initialize models and controller
const mseWModel = new MseWModel();
const stcModel = new StcModel();
const mseWController = new MseWController(mseWModel, stcModel);

// Main CRUD Routes - Using Ticket Number
router.post('/', (req, res) => {
    mseWController.createScore(req, res);
});

router.get('/', (req, res) => {
    mseWController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mseWController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mseWController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mseWController.deleteScoreByTicketNumber(req, res);
});

// Paper-specific Updates
router.put('/:ticketNumber/paper/:paperCode', (req, res) => {
    mseWController.updatePaperMarks(req, res);
});

// Marks Summary and Details
router.get('/:ticketNumber/summary', (req, res) => {
    mseWController.getMarksSummary(req, res);
});

router.get('/details/with-candidates', (req, res) => {
    mseWController.getScoresWithCandidateDetails(req, res);
});

router.get('/:ticketNumber/details', (req, res) => {
    mseWController.getScoreWithCandidateDetails(req, res);
});

// Session-wise Routes
router.get('/:ticketNumber/session/:session', (req, res) => {
    mseWController.getSessionMarks(req, res);
});

router.get('/analysis/session/:session', (req, res) => {
    mseWController.getSessionAnalysis(req, res);
});

router.get('/analysis/course/overview', (req, res) => {
    mseWController.getCourseAnalysis(req, res);
});

// Bulk Operations
router.post('/bulk/upload', (req, res) => {
    mseWController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mseWController.upsertScore(req, res);
});

// Backward Compatibility Routes
router.get('/legacy/:id', (req, res) => {
    mseWController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mseWController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mseWController.deleteScore(req, res);
});

module.exports = router;