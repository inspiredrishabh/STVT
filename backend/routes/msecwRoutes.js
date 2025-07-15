const express = require('express');
const router = express.Router();
const MseCwController = require('../controllers/msecwController');
const MseCwModel = require('../models/msecw');
const StcModel = require('../models/stcModel');

// Initialize models and controller
const mseCwModel = new MseCwModel();
const stcModel = new StcModel();
const mseCwController = new MseCwController(mseCwModel, stcModel);

// Main CRUD Routes - Using Ticket Number
router.post('/', (req, res) => {
    mseCwController.createScore(req, res);
});

router.get('/', (req, res) => {
    mseCwController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mseCwController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mseCwController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mseCwController.deleteScoreByTicketNumber(req, res);
});

// Paper-specific Updates
router.put('/:ticketNumber/paper/:paperCode', (req, res) => {
    mseCwController.updatePaperMarks(req, res);
});

// Marks Summary and Details
router.get('/:ticketNumber/summary', (req, res) => {
    mseCwController.getMarksSummary(req, res);
});

router.get('/details/with-candidates', (req, res) => {
    mseCwController.getScoresWithCandidateDetails(req, res);
});

router.get('/:ticketNumber/details', (req, res) => {
    mseCwController.getScoreWithCandidateDetails(req, res);
});

// Session-wise Routes
router.get('/:ticketNumber/session/:session', (req, res) => {
    mseCwController.getSessionMarks(req, res);
});

router.get('/analysis/session/:session', (req, res) => {
    mseCwController.getSessionAnalysis(req, res);
});

router.get('/analysis/course/overview', (req, res) => {
    mseCwController.getCourseAnalysis(req, res);
});

// Bulk Operations
router.post('/bulk/upload', (req, res) => {
    mseCwController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mseCwController.upsertScore(req, res);
});

// Backward Compatibility Routes
router.get('/legacy/:id', (req, res) => {
    mseCwController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mseCwController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mseCwController.deleteScore(req, res);
});

module.exports = router;