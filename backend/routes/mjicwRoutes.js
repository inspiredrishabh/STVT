const express = require('express');
const router = express.Router();
const MjiCwController = require('../controllers/mjicwController');
const MjiCwModel = require('../models/mjicw');
const StcModel = require('../models/stcModel');

// Initialize models and controller
const mjiCwModel = new MjiCwModel();
const stcModel = new StcModel();
const mjiCwController = new MjiCwController(mjiCwModel, stcModel);

// Main CRUD Routes - Using Ticket Number
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

// Paper-specific Updates
router.put('/:ticketNumber/paper/:paperCode', (req, res) => {
    mjiCwController.updatePaperMarks(req, res);
});

// Marks Summary and Details
router.get('/:ticketNumber/summary', (req, res) => {
    mjiCwController.getMarksSummary(req, res);
});

router.get('/details/with-candidates', (req, res) => {
    mjiCwController.getScoresWithCandidateDetails(req, res);
});

router.get('/:ticketNumber/details', (req, res) => {
    mjiCwController.getScoreWithCandidateDetails(req, res);
});

// Session-wise Routes
router.get('/:ticketNumber/session/:session', (req, res) => {
    mjiCwController.getSessionMarks(req, res);
});

router.get('/analysis/session/:session', (req, res) => {
    mjiCwController.getSessionAnalysis(req, res);
});

router.get('/analysis/course/overview', (req, res) => {
    mjiCwController.getCourseAnalysis(req, res);
});

// Bulk Operations
router.post('/bulk/upload', (req, res) => {
    mjiCwController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mjiCwController.upsertScore(req, res);
});

// Backward Compatibility Routes
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