const sqlite3 = require('sqlite3').verbose();
const { db } = require('../config/db');

class AttendanceModel {
    constructor() {
        // Define table name explicitly
        this.tableName = 'attendances';
        console.log(`Initializing AttendanceModel with table name: ${this.tableName}`);
        this.createTable();
    }

    createTable() {
        db.run(`
            CREATE TABLE IF NOT EXISTS attendances (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                candidate_id INTEGER NOT NULL,
                ticket_no TEXT NOT NULL,
                total_classes INTEGER DEFAULT 0,
                classes_attended INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (candidate_id) REFERENCES wtc_candidates(id) ON DELETE CASCADE,
                UNIQUE(candidate_id)
            )
        `);
    }

    // Mark attendance for a trainee
    async markAttendance(candidateId, totalClasses = 0, classesAttended = 0) {
        const tableName = this.tableName; // Store table name in local variable
        console.log(`Marking attendance in table: ${tableName}`);

        return new Promise((resolve, reject) => {
            // First check if the candidate exists in wtc_candidates
            db.get(
                'SELECT id, ticket_no FROM wtc_candidates WHERE id = ?',
                [candidateId],
                (err, candidate) => {
                    if (err) return reject(err);
                    if (!candidate) return reject(new Error('Candidate not found'));

                    // Check if an attendance record already exists for this candidate
                    db.get(
                        `SELECT id FROM ${tableName} WHERE candidate_id = ?`,
                        [candidateId],
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
                                            `SELECT id, candidate_id, ticket_no, total_classes, classes_attended 
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
                                    (candidate_id, ticket_no, total_classes, classes_attended) 
                                    VALUES (?, ?, ?, ?)`,
                                    [candidateId, candidate.ticket_no, totalClasses, classesAttended],
                                    function (err) {
                                        if (err) return reject(err);

                                        // Fetch the inserted record to return it
                                        db.get(
                                            `SELECT id, candidate_id, ticket_no, total_classes, classes_attended 
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

    // Get attendance records for a candidate with statistics
    async getAttendanceByCandidate(candidateId) {
        const tableName = this.tableName; // Store table name in local variable
        return new Promise((resolve, reject) => {
            // First verify candidate exists
            db.get(
                'SELECT id FROM wtc_candidates WHERE id = ?',
                [candidateId],
                (err, candidate) => {
                    if (err) return reject(err);
                    if (!candidate) return reject(new Error('Candidate not found'));

                    // Get all attendance records for this candidate
                    db.all(
                        `SELECT id, total_classes, classes_attended
                         FROM ${tableName} 
                         WHERE candidate_id = ?`,
                        [candidateId],
                        (err, records) => {
                            if (err) return reject(err);

                            // Calculate statistics
                            const totalRecords = records.length;

                            // Get the most recent record (there should only be one per candidate now)
                            const totalClasses = records.length > 0 ? records[0].total_classes || 0 : 0;
                            const classesAttended = records.length > 0 ? records[0].classes_attended || 0 : 0;

                            // Calculate attendance percentage
                            const attendancePercentage = totalClasses > 0 ? Math.round((classesAttended / totalClasses) * 100) : 0;

                            // Convert snake_case fields to camelCase for consistency
                            const formattedRecords = records.map(record => ({
                                id: record.id,
                                totalClasses: record.total_classes || 0,
                                classesAttended: record.classes_attended || 0,
                            }));

                            resolve({
                                attendanceRecords: formattedRecords,
                                statistics: {
                                    totalRecords,
                                    totalClasses,
                                    classesAttended,
                                    attendancePercentage
                                }
                            });
                        }
                    );
                }
            );
        });
    }

    // Get attendance statistics by batch or module
    async getAttendanceStats(batch = null, moduleNo = null) {
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

            const query = `
                SELECT 
                    c.id as candidateId, 
                    c.ticket_no as ticketNo, 
                    c.name, 
                    c.designation, 
                    c.batch,
                    c.module_no as moduleNo,
                    a.total_classes as totalClasses,
                    a.classes_attended as classesAttended,
                    ROUND((a.classes_attended * 100.0 / NULLIF(a.total_classes, 0)), 0) as attendancePercentage
                FROM 
                    wtc_candidates c
                LEFT JOIN 
                    ${tableName} a ON c.id = a.candidate_id
                ${whereClause}
            `;

            db.all(query, params, (err, results) => {
                if (err) return reject(err);

                // Calculate overall statistics
                let totalClasses = 0;
                let totalClassesAttended = 0;

                results.forEach(result => {
                    totalClasses += result.totalClasses || 0;
                    totalClassesAttended += result.classesAttended || 0;
                });

                const averageAttendancePercentage = totalClasses > 0 ? Math.round((totalClassesAttended / totalClasses) * 100) : 0;

                resolve({
                    candidates: results.map(r => ({
                        id: r.candidateId,
                        ticketNo: r.ticketNo,
                        name: r.name,
                        designation: r.designation,
                        batch: r.batch,
                        moduleNo: r.moduleNo,
                        totalClasses: r.totalClasses || 0,
                        classesAttended: r.classesAttended || 0,
                        attendancePercentage: r.attendancePercentage || 0
                    })),
                    summary: {
                        totalCandidates: results.length,
                        totalClasses,
                        totalClassesAttended,
                        averageAttendancePercentage
                    }
                });
            });
        });
    }

    // Bulk mark attendance for multiple candidates
    async bulkMarkAttendance(records) {
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
                    const { candidateId, totalClasses, classesAttended } = record;

                    // Skip if required fields are missing
                    if (!candidateId || (totalClasses === undefined && classesAttended === undefined)) {
                        results.push({
                            candidateId,
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
                                    success: false,
                                    message: err ? err.message : 'Candidate not found'
                                });
                                processed++;
                            } else {
                                // Check if attendance record exists
                                db.get(
                                    `SELECT id FROM ${tableName} WHERE candidate_id = ?`,
                                    [candidateId],
                                    (err, existing) => {
                                        if (err) {
                                            results.push({
                                                candidateId,
                                                success: false,
                                                message: err.message
                                            });
                                            processed++;
                                        } else if (existing) {
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
                                                (candidate_id, ticket_no, total_classes, classes_attended) 
                                                VALUES (?, ?, ?, ?)`,
                                                [
                                                    candidateId,
                                                    candidate.ticket_no,
                                                    totalClasses || 0,
                                                    classesAttended || 0
                                                ],
                                                function (err) {
                                                    results.push({
                                                        candidateId,
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
                        }
                    );
                });
            });
        });
    }

    // Get attendance with optional batch/module filter
    async getAllAttendance(batch = null, moduleNo = null) {
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

            const query = `
                SELECT 
                    a.id, 
                    a.candidate_id as candidateId,
                    a.ticket_no as ticketNo, 
                    c.name, 
                    c.designation, 
                    c.batch, 
                    c.module_no as moduleNo, 
                    a.total_classes as totalClasses,
                    a.classes_attended as classesAttended
                FROM 
                    ${tableName} a
                JOIN 
                    wtc_candidates c ON a.candidate_id = c.id
                ${whereClause}
            `;

            db.all(query, params, (err, results) => {
                if (err) return reject(err);
                resolve(results || []);
            });
        });
    }
}

module.exports = new AttendanceModel();