const AttendanceModel = require('../models/AttendanceModel');
const WtcModel = require('../models/wtcModel');
// No need for Sequelize's Op

// Create or update an attendance record
exports.markAttendance = async (req, res) => {
    try {
        const { candidateId, date, theoryStatus, practicalStatus, notes } = req.body;

        if (!candidateId || !date) {
            return res.status(400).json({
                success: false,
                message: 'Candidate ID and date are required'
            });
        }

        // Check if the candidate exists - using WtcModel instead of Candidate
        const wtcModel = new WtcModel();
        const candidate = await wtcModel.getById(candidateId);
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        // Create the attendance data object
        const attendanceData = {
            candidateId,
            ticketNo: candidate.ticketNo,
            date,
            theoryStatus: theoryStatus || 'absent',
            practicalStatus: practicalStatus || 'absent',
            notes
        };

        // Use AttendanceModel to mark attendance (it handles both create and update)
        const attendance = await AttendanceModel.markAttendance(attendanceData);

        res.status(200).json({
            success: true,
            message: 'Attendance marked successfully',
            data: attendance
        });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark attendance',
            error: error.message
        });
    }
};

// Get attendance records for a specific candidate
exports.getAttendance = async (req, res) => {
    try {
        const { candidateId } = req.params;
        const { startDate, endDate } = req.query;

        // Get WTC candidate details first
        const wtcModel = new WtcModel();
        const candidate = await wtcModel.getById(candidateId);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        // Get attendance records using AttendanceModel
        const attendanceRecords = await AttendanceModel.getAttendanceByCandidate(candidateId, startDate, endDate);

        // Get attendance statistics
        const statistics = await AttendanceModel.getAttendanceStats(candidateId);

        res.status(200).json({
            success: true,
            data: {
                candidate,
                attendanceRecords,
                statistics
            }
        });
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch attendance records',
            error: error.message
        });
    }
};

// Get attendance summary for all candidates
exports.getAttendanceSummary = async (req, res) => {
    try {
        const { batch, moduleNo } = req.query;

        // Get all WTC candidates based on filters
        const wtcModel = new WtcModel();
        let candidates;

        if (batch) {
            candidates = await wtcModel.getByBatch(batch);
        } else if (moduleNo) {
            candidates = await wtcModel.getByModuleNo(moduleNo);
        } else {
            candidates = await wtcModel.getAll();
        }

        // Calculate attendance statistics for each candidate
        const attendanceSummary = [];
        for (const candidate of candidates) {
            // Get attendance statistics for this candidate
            const stats = await AttendanceModel.getAttendanceStats(candidate.id);

            attendanceSummary.push({
                id: candidate.id,
                ticketNo: candidate.ticketNo,
                name: candidate.name,
                designation: candidate.designation,
                batch: candidate.batch,
                moduleNo: candidate.moduleNo,
                dateOfJoiningStcWtcNonRailway: candidate.dateOfJoiningStcWtcNonRailway,
                dateOfSparing: candidate.dateOfSparing,
                attendanceStatistics: stats
            });
        }

        res.status(200).json({
            success: true,
            data: attendanceSummary
        });
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch attendance summary',
            error: error.message
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

        // Process all candidate IDs first to get their ticket numbers
        const wtcModel = new WtcModel();
        const processedRecords = [];

        for (const record of records) {
            const { candidateId, date, theoryStatus, practicalStatus, notes } = record;

            try {
                // Get candidate details to retrieve ticket number
                const candidate = await wtcModel.getById(candidateId);
                if (!candidate) {
                    throw new Error(`Candidate with ID ${candidateId} not found`);
                }

                processedRecords.push({
                    candidateId,
                    ticketNo: candidate.ticketNo,
                    date,
                    theoryStatus: theoryStatus || 'absent',
                    practicalStatus: practicalStatus || 'absent',
                    notes
                });
            } catch (error) {
                console.error(`Error processing candidate ${candidateId}: ${error.message}`);
            }
        }

        // Use the bulk mark attendance method from AttendanceModel
        const bulkResult = await AttendanceModel.bulkMarkAttendance(processedRecords);

        res.status(200).json({
            success: true,
            message: `Bulk attendance marked for ${bulkResult.results ? bulkResult.results.length : 0} out of ${records.length} records`,
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

        // Use AttendanceModel to get attendance by date with join to wtc_candidates
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
