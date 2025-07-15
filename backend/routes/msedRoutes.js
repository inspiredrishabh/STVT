const express = require('express');
const router = express.Router();
const MseDController = require('../controllers/msedController');
const MseDModel = require('../models/msed');
const StcModel = require('../models/stcModel');

// Initialize models and controller
const mseDModel = new MseDModel();
const stcModel = new StcModel();
const mseDController = new MseDController(mseDModel, stcModel);

// Main CRUD Routes - Using Ticket Number
router.post('/', (req, res) => {
    mseDController.createScore(req, res);
});

router.get('/', (req, res) => {
    mseDController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mseDController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mseDController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mseDController.deleteScoreByTicketNumber(req, res);
});

// Paper-specific Updates
router.put('/:ticketNumber/paper/:paperCode', (req, res) => {
    mseDController.updatePaperMarks(req, res);
});

// Marks Summary and Details
router.get('/:ticketNumber/summary', (req, res) => {
    mseDController.getMarksSummary(req, res);
});

router.get('/details/with-candidates', (req, res) => {
    mseDController.getScoresWithCandidateDetails(req, res);
});

router.get('/:ticketNumber/details', (req, res) => {
    mseDController.getScoreWithCandidateDetails(req, res);
});

// Session-wise Routes
router.get('/:ticketNumber/session/:session', (req, res) => {
    mseDController.getSessionMarks(req, res);
});

router.get('/analysis/session/:session', (req, res) => {
    mseDController.getSessionAnalysis(req, res);
});

router.get('/analysis/course/overview', (req, res) => {
    mseDController.getCourseAnalysis(req, res);
});

// Bulk Operations
router.post('/bulk/upload', (req, res) => {
    mseDController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mseDController.upsertScore(req, res);
});

// Backward Compatibility Routes
router.get('/legacy/:id', (req, res) => {
    mseDController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mseDController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mseDController.deleteScore(req, res);
});

module.exports = router;