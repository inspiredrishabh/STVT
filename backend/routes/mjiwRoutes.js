const express = require('express');
const router = express.Router();
const MjiWController = require('../controllers/mjiWController');
const MjiWModel = require('../models/mjiw');
const StcModel = require('../models/stcModel');

// Initialize models and controller
const mjiWModel = new MjiWModel();
const stcModel = new StcModel();
const mjiWController = new MjiWController(mjiWModel, stcModel);

// Main CRUD Routes - Using Ticket Number
router.post('/', (req, res) => {
    mjiWController.createScore(req, res);
});

router.get('/', (req, res) => {
    mjiWController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mjiWController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mjiWController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mjiWController.deleteScoreByTicketNumber(req, res);
});

// Paper-specific Updates
router.put('/:ticketNumber/paper/:paperCode', (req, res) => {
    mjiWController.updatePaperMarks(req, res);
});

// Marks Summary and Details
router.get('/:ticketNumber/summary', (req, res) => {
    mjiWController.getMarksSummary(req, res);
});

router.get('/details/with-candidates', (req, res) => {
    mjiWController.getScoresWithCandidateDetails(req, res);
});

router.get('/:ticketNumber/details', (req, res) => {
    mjiWController.getScoreWithCandidateDetails(req, res);
});

// Session-wise Routes
router.get('/:ticketNumber/session/:session', (req, res) => {
    mjiWController.getSessionMarks(req, res);
});

router.get('/analysis/session/:session', (req, res) => {
    mjiWController.getSessionAnalysis(req, res);
});

router.get('/analysis/course/overview', (req, res) => {
    mjiWController.getCourseAnalysis(req, res);
});

// Bulk Operations
router.post('/bulk/upload', (req, res) => {
    mjiWController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mjiWController.upsertScore(req, res);
});

// Backward Compatibility Routes
router.get('/legacy/:id', (req, res) => {
    mjiWController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mjiWController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mjiWController.deleteScore(req, res);
});

module.exports = router;