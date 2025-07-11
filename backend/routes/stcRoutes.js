const express = require('express');
const router = express.Router();
const StcController = require('../controllers/stcController');
const StcModel = require('../models/stcModel');
const upload = require('../middleware/upload');

// Initialize model and controller
const stcModel = new StcModel();
const stcController = new StcController(stcModel);

// Main Routes - Using Ticket Number
router.post('/', upload.single('picture'), (req, res) => {
    stcController.createCandidate(req, res);
});

router.get('/', (req, res) => {
    stcController.getCandidates(req, res);
});

router.get('/:ticketNumber', (req, res) => {
    stcController.getCandidateByTicketNumber(req, res);
});

router.put('/:ticketNumber', upload.single('image'), (req, res) => {
    stcController.updateCandidateByTicketNumber(req, res);
});

router.delete('/:ticketNumber', (req, res) => {
    stcController.deleteCandidateByTicketNumber(req, res);
});

// Resign candidate route
router.put('/:ticketNumber/resign', (req, res) => {
    stcController.resignCandidate(req, res);
});

// Filter Routes
router.get('/filter/designation/:designation', (req, res) => {
    stcController.getCandidatesByDesignation(req, res);
});

router.get('/filter/unit/:unit', (req, res) => {
    stcController.getCandidatesByUnit(req, res);
});

// Backward Compatibility Routes (Optional)
router.get('/legacy/:id', (req, res) => {
    stcController.getCandidateById(req, res);
});

router.put('/legacy/:id', upload.single('image'), (req, res) => {
    stcController.updateCandidate(req, res);
});

router.delete('/legacy/:id', (req, res) => {
    stcController.deleteCandidate(req, res);
});

module.exports = router;