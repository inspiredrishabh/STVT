const sqlite3 = require('sqlite3').verbose();
const { db } = require('../config/db');

class MonthlyAttendanceModel {
    constructor() {
        // Define table name explicitly
        this.tableName = 'monthly_attendances';
        this.createTable();
    }

    createTable() {
        db.run(`
            CREATE TABLE IF NOT EXISTS monthly_attendances (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                candidate_id INTEGER NOT NULL,
                ticket_no TEXT NOT NULL,
                month TEXT NOT NULL,  -- Format: YYYY-MM
                total_classes INTEGER DEFAULT 0,
                classes_attended INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (candidate_id) REFERENCES wtc_candidates(id) ON DELETE CASCADE,
                UNIQUE(candidate_id, month)
            )
        `);
    }

    // Mark attendance for a trainee for a specific month
    async markAttendance(candidateId, month, totalClasses = 0, classesAttended = 0) {
        const tableName = this.tableName; // Store table name in local variable
        console.log(`Marking monthly attendance in table: ${tableName}`);

        return new Promise((resolve, reject) => {
            // First check if the candidate exists in wtc_candidates
            db.get(
                'SELECT id, ticket_no FROM wtc_candidates WHERE id = ?',
                [candidateId],
                (err, candidate) => {
                    if (err) return reject(err);
                    if (!candidate) return reject(new Error('Candidate not found'));

                    // Check if a monthly attendance record already exists for this candidate
                    db.get(
                        `SELECT id FROM ${tableName} WHERE candidate_id = ? AND month = ?`,
                        [candidateId, month],
                        (err, existing) => {
                            if (err) return reject(err);

                            if (existing) {
                                // Update existing record
                                const updateFields = [];
                                const updateValues = [];

                                // Update total classes and classes attended if provided
                                if (totalClasses !== undefined && totalClasses >= 0) {
                                    updateFields.push('total_classes = ?');
                                    updateValues.push(totalClasses);
                                }

                                if (classesAttended !== undefined && classesAttended >= 0) {
                                    updateFields.push('classes_attended = ?');
                                    updateValues.push(classesAttended);
                                }

                                updateFields.push('updated_at = CURRENT_TIMESTAMP');
                                updateValues.push(existing.id);

                                db.run(
                                    `UPDATE ${tableName} SET ${updateFields.join(', ')} WHERE id = ?`,
                                    [...updateValues],
                                    function (err) {
                                        if (err) return reject(err);

                                        // Fetch the updated record to return it
                                        db.get(
                                            `SELECT id, candidate_id, ticket_no, month, total_classes, classes_attended 
                                            FROM ${tableName} WHERE id = ?`,
                                            [existing.id],
                                            (err, record) => {
                                                if (err) return reject(err);
                                                resolve({
                                                    id: existing.id,
                                                    updated: true,
                                                    record: {
                                                        id: record.id,
                                                        candidateId: record.candidate_id,
                                                        ticketNo: record.ticket_no,
                                                        month: record.month,
                                                        totalClasses: record.total_classes,
                                                        classesAttended: record.classes_attended
                                                    }
                                                });
                                            }
                                        );
                                    }
                                );
                            } else {
                                // Insert new record
                                db.run(
                                    `INSERT INTO ${tableName} 
                                    (candidate_id, ticket_no, month, total_classes, classes_attended) 
                                    VALUES (?, ?, ?, ?, ?)`,
                                    [candidateId, candidate.ticket_no, month, totalClasses, classesAttended],
                                    function (err) {
                                        if (err) return reject(err);

                                        // Fetch the inserted record to return it
                                        db.get(
                                            `SELECT id, candidate_id, ticket_no, month, total_classes, classes_attended 
                                            FROM ${tableName} WHERE id = ?`,
                                            [this.lastID],
                                            (err, record) => {
                                                if (err) return reject(err);
                                                resolve({
                                                    id: this.lastID,
                                                    updated: false,
                                                    record: {
                                                        id: record.id,
                                                        candidateId: record.candidate_id,
                                                        ticketNo: record.ticket_no,
                                                        month: record.month,
                                                        totalClasses: record.total_classes,
                                                        classesAttended: record.classes_attended
                                                    }
                                                });
                                            }
                                        );
                                    }
                                );
                            }
                        }
                    );
                }
            );
        });
    }

    // Get monthly attendance records for a candidate with statistics
    async getMonthlyAttendanceByCandidate(candidateId) {
        const tableName = this.tableName; // Store table name in local variable
        return new Promise((resolve, reject) => {
            // First verify candidate exists
            db.get(
                'SELECT id, date_of_joining_stc_wtc_non_railway as dateOfJoining, date_of_sparing as dateOfSparing FROM wtc_candidates WHERE id = ?',
                [candidateId],
                (err, candidate) => {
                    if (err) return reject(err);
                    if (!candidate) return reject(new Error('Candidate not found'));

                    // Get all attendance records for this candidate
                    db.all(
                        `SELECT id, month, total_classes, classes_attended
                         FROM ${tableName} 
                         WHERE candidate_id = ?
                         ORDER BY month ASC`,
                        [candidateId],
                        (err, records) => {
                            if (err) return reject(err);

                            // Calculate statistics
                            const totalRecords = records.length;

                            // Calculate total attendance across all months
                            let totalClassesAll = 0;
                            let classesAttendedAll = 0;

                            // Format the records
                            const formattedRecords = records.map(record => {
                                totalClassesAll += record.total_classes || 0;
                                classesAttendedAll += record.classes_attended || 0;

                                return {
                                    id: record.id,
                                    month: record.month,
                                    totalClasses: record.total_classes || 0,
                                    classesAttended: record.classes_attended || 0,
                                    attendancePercentage: record.total_classes > 0
                                        ? Math.round((record.classes_attended / record.total_classes) * 100)
                                        : 0
                                };
                            });

                            // Calculate overall attendance percentage
                            const overallAttendancePercentage = totalClassesAll > 0
                                ? Math.round((classesAttendedAll / totalClassesAll) * 100)
                                : 0;

                            resolve({
                                candidateDetails: {
                                    id: candidate.id,
                                    dateOfJoining: candidate.dateOfJoining,
                                    dateOfSparing: candidate.dateOfSparing
                                },
                                monthlyRecords: formattedRecords,
                                statistics: {
                                    totalMonths: totalRecords,
                                    totalClasses: totalClassesAll,
                                    classesAttended: classesAttendedAll,
                                    attendancePercentage: overallAttendancePercentage
                                }
                            });
                        }
                    );
                }
            );
        });
    }

    // Generate months between joining and sparing dates
    async generateMonthsBetweenDates(candidateId) {
        return new Promise((resolve, reject) => {
            // Get candidate's joining and sparing dates
            db.get(
                'SELECT id, ticket_no, date_of_joining_stc_wtc_non_railway as dateOfJoining, date_of_sparing as dateOfSparing FROM wtc_candidates WHERE id = ?',
                [candidateId],
                (err, candidate) => {
                    if (err) return reject(err);
                    if (!candidate) return reject(new Error('Candidate not found'));

                    // If dates are not set, return empty array
                    if (!candidate.dateOfJoining) {
                        return resolve({
                            candidateId: candidate.id,
                            ticketNo: candidate.ticket_no,
                            months: []
                        });
                    }

                    // Parse dates
                    const startDate = new Date(candidate.dateOfJoining);
                    // If sparing date is not set, use current date
                    const endDate = candidate.dateOfSparing ? new Date(candidate.dateOfSparing) : new Date();

                    // Generate array of months between dates
                    const months = [];
                    let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

                    while (currentDate <= endDate) {
                        const month = currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0');
                        months.push(month);
                        currentDate.setMonth(currentDate.getMonth() + 1);
                    }

                    resolve({
                        candidateId: candidate.id,
                        ticketNo: candidate.ticket_no,
                        months
                    });
                }
            );
        });
    }

    // Bulk mark attendance for multiple candidates
    async bulkMarkMonthlyAttendance(records) {
        const tableName = this.tableName; // Store table name in local variable
        return new Promise((resolve, reject) => {
            const results = [];
            let processed = 0;

            if (records.length === 0) {
                return resolve({ success: true, results: [] });
            }

            // Begin transaction
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                records.forEach(record => {
                    const { candidateId, month, totalClasses, classesAttended } = record;

                    // Skip if required fields are missing
                    if (!candidateId || !month || (totalClasses === undefined && classesAttended === undefined)) {
                        results.push({
                            candidateId,
                            month,
                            success: false,
                            message: 'Missing required fields'
                        });
                        processed++;

                        if (processed === records.length) {
                            db.run('COMMIT', err => {
                                if (err) {
                                    db.run('ROLLBACK');
                                    return reject(err);
                                }
                                resolve({ results });
                            });
                        }
                        return;
                    }

                    // Check if candidate exists
                    db.get(
                        'SELECT id, ticket_no FROM wtc_candidates WHERE id = ?',
                        [candidateId],
                        (err, candidate) => {
                            if (err || !candidate) {
                                results.push({
                                    candidateId,
                                    month,
                                    success: false,
                                    message: err ? err.message : 'Candidate not found'
                                });
                                processed++;

                                if (processed === records.length) {
                                    db.run('COMMIT', err => {
                                        if (err) {
                                            db.run('ROLLBACK');
                                            return reject(err);
                                        }
                                        resolve({ results });
                                    });
                                }
                                return;
                            }

                            // Check if a record already exists for this candidate and month
                            db.get(
                                `SELECT id FROM ${tableName} WHERE candidate_id = ? AND month = ?`,
                                [candidateId, month],
                                (err, existing) => {
                                    if (err) {
                                        results.push({
                                            candidateId,
                                            month,
                                            success: false,
                                            message: err.message
                                        });
                                        processed++;

                                        if (processed === records.length) {
                                            db.run('COMMIT', err => {
                                                if (err) {
                                                    db.run('ROLLBACK');
                                                    return reject(err);
                                                }
                                                resolve({ results });
                                            });
                                        }
                                        return;
                                    }

                                    if (existing) {
                                        // Update existing record
                                        const updateFields = [];
                                        const updateValues = [];

                                        if (totalClasses !== undefined && totalClasses >= 0) {
                                            updateFields.push('total_classes = ?');
                                            updateValues.push(totalClasses);
                                        }

                                        if (classesAttended !== undefined && classesAttended >= 0) {
                                            updateFields.push('classes_attended = ?');
                                            updateValues.push(classesAttended);
                                        }

                                        updateFields.push('updated_at = CURRENT_TIMESTAMP');
                                        updateValues.push(existing.id);

                                        db.run(
                                            `UPDATE ${tableName} SET ${updateFields.join(', ')} WHERE id = ?`,
                                            [...updateValues],
                                            function (err) {
                                                results.push({
                                                    candidateId,
                                                    month,
                                                    success: !err,
                                                    message: err ? err.message : 'Attendance updated successfully'
                                                });
                                                processed++;

                                                if (processed === records.length) {
                                                    db.run('COMMIT', err => {
                                                        if (err) {
                                                            db.run('ROLLBACK');
                                                            return reject(err);
                                                        }
                                                        resolve({ results });
                                                    });
                                                }
                                            }
                                        );
                                    } else {
                                        // Insert new record
                                        db.run(
                                            `INSERT INTO ${tableName} 
                                            (candidate_id, ticket_no, month, total_classes, classes_attended) 
                                            VALUES (?, ?, ?, ?, ?)`,
                                            [
                                                candidateId,
                                                candidate.ticket_no,
                                                month,
                                                totalClasses || 0,
                                                classesAttended || 0
                                            ],
                                            function (err) {
                                                results.push({
                                                    candidateId,
                                                    month,
                                                    success: !err,
                                                    message: err ? err.message : 'Attendance marked successfully'
                                                });
                                                processed++;

                                                if (processed === records.length) {
                                                    db.run('COMMIT', err => {
                                                        if (err) {
                                                            db.run('ROLLBACK');
                                                            return reject(err);
                                                        }
                                                        resolve({ results });
                                                    });
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    );
                });
            });
        });
    }

    // Get attendance statistics by batch or module
    async getMonthlyAttendanceStats(batch = null, moduleNo = null) {
        const tableName = this.tableName; // Store table name in local variable
        return new Promise((resolve, reject) => {
            let whereClause = '';
            const params = [];

            if (batch) {
                whereClause += 'WHERE c.batch = ?';
                params.push(batch);
            }

            if (moduleNo) {
                whereClause += batch ? ' AND c.module_no = ?' : 'WHERE c.module_no = ?';
                params.push(moduleNo);
            }

            // First get all candidates
            const candidateQuery = `
                SELECT 
                    c.id as candidateId, 
                    c.ticket_no as ticketNo, 
                    c.name, 
                    c.designation, 
                    c.batch,
                    c.module_no as moduleNo,
                    c.date_of_joining_stc_wtc_non_railway as dateOfJoining,
                    c.date_of_sparing as dateOfSparing
                FROM 
                    wtc_candidates c
                ${whereClause}
            `;

            db.all(candidateQuery, params, async (err, candidates) => {
                if (err) return reject(err);

                // For each candidate, get their monthly attendance records
                const candidatesWithAttendance = [];

                // Process each candidate sequentially with Promise.all
                await Promise.all(candidates.map(async (candidate) => {
                    try {
                        // Get monthly attendance for this candidate
                        const monthlyAttendance = await this.getMonthlyAttendanceByCandidate(candidate.candidateId);

                        candidatesWithAttendance.push({
                            ...candidate,
                            monthlyRecords: monthlyAttendance.monthlyRecords,
                            statistics: monthlyAttendance.statistics
                        });
                    } catch (error) {
                        // If there's an error, add the candidate without attendance data
                        candidatesWithAttendance.push({
                            ...candidate,
                            monthlyRecords: [],
                            statistics: {
                                totalMonths: 0,
                                totalClasses: 0,
                                classesAttended: 0,
                                attendancePercentage: 0
                            }
                        });
                    }
                }));

                // Calculate overall statistics
                let totalClasses = 0;
                let totalClassesAttended = 0;

                candidatesWithAttendance.forEach(candidate => {
                    totalClasses += candidate.statistics?.totalClasses || 0;
                    totalClassesAttended += candidate.statistics?.classesAttended || 0;
                });

                const averageAttendancePercentage = totalClasses > 0
                    ? Math.round((totalClassesAttended / totalClasses) * 100)
                    : 0;

                resolve({
                    candidates: candidatesWithAttendance,
                    summary: {
                        totalCandidates: candidatesWithAttendance.length,
                        totalClasses,
                        totalClassesAttended,
                        averageAttendancePercentage
                    }
                });
            });
        });
    }
}

module.exports = new MonthlyAttendanceModel();
