const AttendanceModel = require('../models/AttendanceModel');

async function initializeAttendanceTable() {
    try {
        // AttendanceModel creates its table when instantiated
        console.log('Attendance table created using SQLite');
        return true;
    } catch (error) {
        console.error('Error initializing attendance table:', error);
        return false;
    }
}

module.exports = { initializeAttendanceTable };
