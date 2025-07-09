const express = require('express');
const router = express.Router();
const LineTrainingController = require('../controllers/lineTrainingController');
const LineTrainingModel = require('../models/lineTraining');

// Initialize model and controller
const lineTrainingModel = new LineTrainingModel();
const lineTrainingController = new LineTrainingController(lineTrainingModel);

// Main Routes - Training Programs
router.post('/', (req, res) => {
    lineTrainingController.createCandidate(req, res);
});

router.get('/', (req, res) => {
    lineTrainingController.getCandidates(req, res);
});

router.get('/:id', (req, res) => {
    lineTrainingController.getCandidateById(req, res);
});

router.put('/:id', (req, res) => {
    lineTrainingController.updateCandidate(req, res);
});

router.delete('/:id', (req, res) => {
    lineTrainingController.deleteCandidate(req, res);
});

// Filter Routes
router.get('/filter/designation/:designation', (req, res) => {
    lineTrainingController.getCandidatesByDesignation(req, res);
});

router.get('/filter/activityCentre/:activityCentre', (req, res) => {
    lineTrainingController.getCandidatesByActivityCentre(req, res);
});

// Date range filter (using query parameters)
router.get('/filter/dateRange', (req, res) => {
    lineTrainingController.getCandidatesByDateRange(req, res);
});

// Backward Compatibility Routes (Optional)
router.get('/legacy/:id', (req, res) => {
    lineTrainingController.getCandidateById(req, res);
});

router.put('/legacy/:id', (req, res) => {
    lineTrainingController.updateCandidate(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    lineTrainingController.deleteCandidate(req, res);
});

module.exports = router;