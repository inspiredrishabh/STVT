const AttendanceModel = require('../models/AttendanceModel');
const WtcModel = require('../models/wtcModel');

// Mark attendance for a trainee
// ...existing code...
// Mark attendance for a trainee - DISABLED (LEGACY SYSTEM)
exports.markAttendance = async (req, res) => {
    // Return a message indicating that this endpoint is disabled
    res.status(403).json({
        success: false,
        message: 'The legacy attendance system has been deprecated. Please use the monthly attendance system instead.'
    });
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

// Bulk mark attendance for multiple candidates - DISABLED (LEGACY SYSTEM)
exports.bulkMarkAttendance = async (req, res) => {
    // Return a message indicating that this endpoint is disabled
    res.status(403).json({
        success: false,
        message: 'The legacy attendance system has been deprecated. Please use the monthly attendance system instead.'
    });
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