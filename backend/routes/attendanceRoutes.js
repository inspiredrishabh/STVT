const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Mark attendance for a trainee
router.post('/mark', attendanceController.markAttendance);

// Get attendance for a specific candidate
router.get('/candidate/:candidateId', attendanceController.getAttendance);

// Get attendance summary for all candidates
router.get('/summary', attendanceController.getAttendanceSummary);

// Bulk mark attendance
router.post('/bulk-mark', attendanceController.bulkMarkAttendance);

// Get attendance by date
router.get('/date/:date', attendanceController.getAttendanceByDate);

module.exports = router;