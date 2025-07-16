const MonthlyAttendanceModel = require('../models/MonthlyAttendanceModel');
const WtcModel = require('../models/wtcModel');

// Mark monthly attendance for a trainee
exports.markMonthlyAttendance = async (req, res) => {
    try {
        const { candidateId, month, totalClasses, classesAttended } = req.body;

        if (!candidateId || !month) {
            return res.status(400).json({
                success: false,
                message: 'Candidate ID and month are required'
            });
        }

        // Validate month format (YYYY-MM)
        const monthRegex = /^\d{4}-\d{2}$/;
        if (!monthRegex.test(month)) {
            return res.status(400).json({
                success: false,
                message: 'Month must be in YYYY-MM format'
            });
        }

        // At least one of total classes or classes attended must be provided
        if (totalClasses === undefined || classesAttended === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Total classes and classes attended must be provided'
            });
        }

        const markResult = await MonthlyAttendanceModel.markAttendance(
            candidateId,
            month,
            totalClasses,
            classesAttended
        );

        // After marking attendance, fetch the updated attendance data
        const updatedAttendanceData = await MonthlyAttendanceModel.getMonthlyAttendanceByCandidate(candidateId);

        res.status(200).json({
            success: true,
            message: markResult.updated ? 'Monthly attendance updated successfully' : 'Monthly attendance marked successfully',
            data: updatedAttendanceData
        });
    } catch (error) {
        console.error('Error marking monthly attendance:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to mark monthly attendance'
        });
    }
};

// Get monthly attendance for a specific candidate
exports.getMonthlyAttendance = async (req, res) => {
    try {
        const { candidateId } = req.params;

        if (!candidateId) {
            return res.status(400).json({
                success: false,
                message: 'Candidate ID is required'
            });
        }

        const attendanceData = await MonthlyAttendanceModel.getMonthlyAttendanceByCandidate(candidateId);

        res.status(200).json({
            success: true,
            data: attendanceData
        });
    } catch (error) {
        console.error('Error getting monthly attendance:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get monthly attendance'
        });
    }
};

// Get all months between joining and sparing dates for a candidate
exports.getAttendanceMonths = async (req, res) => {
    try {
        const { candidateId } = req.params;

        if (!candidateId) {
            return res.status(400).json({
                success: false,
                message: 'Candidate ID is required'
            });
        }

        const monthsData = await MonthlyAttendanceModel.generateMonthsBetweenDates(candidateId);

        res.status(200).json({
            success: true,
            data: monthsData
        });
    } catch (error) {
        console.error('Error getting attendance months:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get attendance months'
        });
    }
};

// Get monthly attendance summary for all candidates
exports.getMonthlyAttendanceSummary = async (req, res) => {
    try {
        const { batch, moduleNo } = req.query;

        const attendanceStats = await MonthlyAttendanceModel.getMonthlyAttendanceStats(batch, moduleNo);

        res.status(200).json({
            success: true,
            data: attendanceStats
        });
    } catch (error) {
        console.error('Error getting monthly attendance summary:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get monthly attendance summary'
        });
    }
};

// Bulk mark monthly attendance for multiple candidates
exports.bulkMarkMonthlyAttendance = async (req, res) => {
    try {
        const { records } = req.body;

        if (!records || !Array.isArray(records) || records.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid attendance records array is required'
            });
        }

        // Validate each record has candidateId and month
        for (const record of records) {
            if (!record.candidateId || !record.month) {
                return res.status(400).json({
                    success: false,
                    message: 'Each record must contain candidateId and month'
                });
            }

            // Validate month format
            const monthRegex = /^\d{4}-\d{2}$/;
            if (!monthRegex.test(record.month)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid month format in record for candidate ${record.candidateId}. Must be YYYY-MM`
                });
            }
        }

        const bulkResult = await MonthlyAttendanceModel.bulkMarkMonthlyAttendance(records);

        res.status(200).json({
            success: true,
            message: `Bulk monthly attendance processed for ${bulkResult.results ? bulkResult.results.length : 0} records`,
            results: bulkResult.results || []
        });
    } catch (error) {
        console.error('Error bulk marking monthly attendance:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process bulk monthly attendance',
            error: error.message
        });
    }
};
