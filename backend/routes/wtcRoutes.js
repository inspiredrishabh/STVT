// const express = require('express');
// const router = express.Router();
// const WtcController = require('../controllers/wtcController');
// const WtcModel = require('../models/wtcModel');
// const upload = require('../middleware/upload');

// // Initialize model and controller
// const wtcModel = new WtcModel();
// const wtcController = new WtcController(wtcModel);

// // Main Routes - Using Ticket Number
// router.post('/', upload.single('image'), (req, res) => {
//     wtcController.createCandidate(req, res);
// });

// router.get('/', (req, res) => {
//     wtcController.getCandidates(req, res);
// });

// router.get('/:ticketNumber', (req, res) => {
//     wtcController.getCandidateByTicketNumber(req, res);
// });

// router.put('/:ticketNumber', upload.single('image'), (req, res) => {
//     wtcController.updateCandidateByTicketNumber(req, res);
// });

// router.delete('/:ticketNumber', (req, res) => {
//     wtcController.deleteCandidateByTicketNumber(req, res);
// });

// // Filter Routes
// router.get('/filter/designation/:designation', (req, res) => {
//     wtcController.getCandidatesByDesignation(req, res);
// });

// router.get('/filter/courseType/:courseType', (req, res) => {
//     wtcController.getCandidatesByCourseType(req, res);
// });

// router.get('/filter/unit/:unit', (req, res) => {
//     wtcController.getCandidatesByUnit(req, res);
// });

// // router.get('/filter/trainingPeriod/:trainingPeriod', (req, res) => {
// //     wtcController.getCandidatesByTrainingPeriod(req, res);
// // });

// // router.get('/filter/theoryDuration/:theoryDuration', (req, res) => {
// //     wtcController.getCandidatesByTheoryDuration(req, res);
// // });

// // router.get('/filter/practicalDuration/:practicalDuration', (req, res) => {
// //     wtcController.getCandidatesByPracticalDuration(req, res);
// // });

// // Backward Compatibility Routes (Optional)
// router.get('/legacy/:id', (req, res) => {
//     wtcController.getCandidateById(req, res);
// });

// router.put('/legacy/:id', upload.single('image'), (req, res) => {
//     wtcController.updateCandidate(req, res);
// });

// router.delete('/legacy/:id', (req, res) => {
//     wtcController.deleteCandidate(req, res);
// });

// module.exports = router;