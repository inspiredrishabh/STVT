const express = require('express');
const router = express.Router();
const monthlyAttendanceController = require('../controllers/monthlyAttendanceController');

// Mark monthly attendance for a trainee
router.post('/mark', monthlyAttendanceController.markMonthlyAttendance);

// Get monthly attendance for a specific candidate
router.get('/candidate/:candidateId', monthlyAttendanceController.getMonthlyAttendance);

// Get all months between joining and sparing dates for a candidate
router.get('/months/:candidateId', monthlyAttendanceController.getAttendanceMonths);

// Get monthly attendance summary for all candidates
router.get('/summary', monthlyAttendanceController.getMonthlyAttendanceSummary);

// Bulk mark monthly attendance for multiple trainees
router.post('/bulk-mark', monthlyAttendanceController.bulkMarkMonthlyAttendance);

module.exports = router;
