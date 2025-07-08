const express = require('express');
const router = express.Router();
const MjrWController = require('../controllers/mrjwController');
const MjrWModel = require('../models/mjrw');
const StcModel = require('../models/stcModel');

// Initialize models and controller
const mjrWModel = new MjrWModel();
const stcModel = new StcModel();
const mjrWController = new MjrWController(mjrWModel, stcModel);

// Main CRUD Routes - Using Ticket Number
router.post('/', (req, res) => {
    mjrWController.createScore(req, res);
});

router.get('/', (req, res) => {
    mjrWController.getScores(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    mjrWController.getScoreByTicketNumber(req, res);
});

router.put('/:ticketNumber', (req, res) => {
    mjrWController.updateScoreByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    mjrWController.deleteScoreByTicketNumber(req, res);
});

// Paper-specific Updates
router.put('/:ticketNumber/paper/:paperCode', (req, res) => {
    mjrWController.updatePaperMarks(req, res);
});

// Marks Summary and Details
router.get('/:ticketNumber/summary', (req, res) => {
    mjrWController.getMarksSummary(req, res);
});

router.get('/details/with-candidates', (req, res) => {
    mjrWController.getScoresWithCandidateDetails(req, res);
});

router.get('/:ticketNumber/details', (req, res) => {
    mjrWController.getScoreWithCandidateDetails(req, res);
});

// Session-wise Routes
router.get('/:ticketNumber/session/:session', (req, res) => {
    mjrWController.getSessionMarks(req, res);
});

router.get('/analysis/session/:session', (req, res) => {
    mjrWController.getSessionAnalysis(req, res);
});

router.get('/analysis/course/overview', (req, res) => {
    mjrWController.getCourseAnalysis(req, res);
});

// Bulk Operations
router.post('/bulk/upload', (req, res) => {
    mjrWController.bulkUploadScores(req, res);
});

router.post('/upsert', (req, res) => {
    mjrWController.upsertScore(req, res);
});

// Backward Compatibility Routes
router.get('/legacy/:id', (req, res) => {
    mjrWController.getScoreById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    mjrWController.updateScore(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    mjrWController.deleteScore(req, res);
});

module.exports = router;