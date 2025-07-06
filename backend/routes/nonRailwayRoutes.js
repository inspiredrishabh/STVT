// const express = require('express');
// const router = express.Router();
// const NonRailwayController = require('../controllers/nonRailwayController');
// const NonRailwayModel = require('../models/nonRailwayModel');
// const upload = require('../middleware/upload');

// // Initialize model and controller
// const nonRailwayModel = new NonRailwayModel();
// const nonRailwayController = new NonRailwayController(nonRailwayModel);

// // Main Routes - Using Ticket Number
// router.post('/', upload.single('image'), (req, res) => {
//     nonRailwayController.createCandidate(req, res);
// });

// router.get('/', (req, res) => {
//     nonRailwayController.getCandidates(req, res);
// });

// router.get('/:ticketNumber', (req, res) => {
//     nonRailwayController.getCandidateByTicketNumber(req, res);
// });

// router.put('/:ticketNumber', upload.single('image'), (req, res) => {
//     nonRailwayController.updateCandidateByTicketNumber(req, res);
// });

// router.delete('/:ticketNumber', (req, res) => {
//     nonRailwayController.deleteCandidateByTicketNumber(req, res);
// });

// // Filter Routes
// router.get('/filter/designation/:designation', (req, res) => {
//     nonRailwayController.getCandidatesByDesignation(req, res);
// });

// router.get('/filter/courseType/:courseType', (req, res) => {
//     nonRailwayController.getCandidatesByCourseType(req, res);
// });

// router.get('/filter/unit/:unit', (req, res) => {
//     nonRailwayController.getCandidatesByUnit(req, res);
// });

// // router.get('/filter/duration/:duration', (req, res) => {
// //     nonRailwayController.getCandidatesByDuration(req, res);
// // });

// // router.get('/filter/theory/:theory', (req, res) => {
// //     nonRailwayController.getCandidatesByTheory(req, res);
// // });

// // router.get('/filter/practical/:practical', (req, res) => {
// //     nonRailwayController.getCandidatesByPractical(req, res);
// // });

// // Search Routes - Commented for future use
// // router.get('/search/remarks/:keyword', (req, res) => {
// //     nonRailwayController.searchCandidatesByRemarks(req, res);
// // });

// // Special Routes - Commented for future use
// // router.get('/reports/training-details', (req, res) => {
// //     nonRailwayController.getTrainingDetails(req, res);
// // });

// // Backward Compatibility Routes (Optional)
// router.get('/legacy/:id', (req, res) => {
//     nonRailwayController.getCandidateById(req, res);
// });

// router.put('/legacy/:id', upload.single('image'), (req, res) => {
//     nonRailwayController.updateCandidate(req, res);
// });

// router.delete('/legacy/:id', (req, res) => {
//     nonRailwayController.deleteCandidate(req, res);
// });

// module.exports = router;