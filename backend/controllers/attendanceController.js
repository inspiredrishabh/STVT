const AttendanceModel = require('../models/AttendanceModel');
const WtcModel = require('../models/wtcModel');

// Mark attendance for a trainee
exports.markAttendance = async (req, res) => {
    try {
        const { candidateId, date, theoryStatus, practicalStatus, notes } = req.body;

        if (!candidateId || !date) {
            return res.status(400).json({
                success: false,
                message: 'Candidate ID and date are required'
            });
        }

        // At least one of theory or practical status is required
        if (!theoryStatus && !practicalStatus) {
            return res.status(400).json({
                success: false,
                message: 'At least one of theory or practical status must be provided'
            });
        }

        const markResult = await AttendanceModel.markAttendance(
            candidateId,
            date,
            theoryStatus,
            practicalStatus,
            notes
        );

        // After marking attendance, fetch the updated attendance data
        const updatedAttendanceData = await AttendanceModel.getAttendanceByCandidate(candidateId);

        res.status(200).json({
            success: true,
            message: markResult.updated ? 'Attendance updated successfully' : 'Attendance marked successfully',
            data: updatedAttendanceData
        });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to mark attendance'
        });
    }
};

// Get attendance for a specific candidate
exports.getAttendance = async (req, res) => {
    try {
        const { candidateId } = req.params;

        if (!candidateId) {
            return res.status(400).json({
                success: false,
                message: 'Candidate ID is required'
            });
        }

        const attendanceData = await AttendanceModel.getAttendanceByCandidate(candidateId);

        res.status(200).json({
            success: true,
            data: attendanceData
        });
    } catch (error) {
        console.error('Error getting attendance:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get attendance'
        });
    }
};

// Get attendance summary for all candidates
exports.getAttendanceSummary = async (req, res) => {
    try {
        const { batch, moduleNo } = req.query;

        const attendanceStats = await AttendanceModel.getAttendanceStats(batch, moduleNo);

        res.status(200).json({
            success: true,
            data: attendanceStats
        });
    } catch (error) {
        console.error('Error getting attendance summary:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get attendance summary'
        });
    }
};

// Bulk mark attendance for multiple candidates
exports.bulkMarkAttendance = async (req, res) => {
    try {
        const { records } = req.body;

        if (!records || !Array.isArray(records) || records.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid attendance records array is required'
            });
        }

        const bulkResult = await AttendanceModel.bulkMarkAttendance(records);

        res.status(200).json({
            success: true,
            message: `Bulk attendance processed for ${bulkResult.results ? bulkResult.results.length : 0} records`,
            results: bulkResult.results || []
        });
    } catch (error) {
        console.error('Error bulk marking attendance:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process bulk attendance',
            error: error.message
        });
    }
};

// Get attendance records by date
exports.getAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const { batch, moduleNo } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date is required'
            });
        }

        const attendanceRecords = await AttendanceModel.getAttendanceByDate(date, batch, moduleNo);

        // Transform to match the expected format from the frontend
        const result = attendanceRecords.map(record => {
            return {
                candidate: {
                    id: record.candidateId,
                    ticketNo: record.ticketNo,
                    name: record.name,
                    designation: record.designation,
                    batch: record.batch,
                    moduleNo: record.moduleNo
                },
                attendance: {
                    id: record.id,
                    theoryStatus: record.theoryStatus,
                    practicalStatus: record.practicalStatus,
                    notes: record.notes
                }
            };
        });

        res.status(200).json({
            success: true,
            date,
            data: result
        });
    } catch (error) {
        console.error('Error fetching attendance by date:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch attendance by date',
            error: error.message
        });
    }
};