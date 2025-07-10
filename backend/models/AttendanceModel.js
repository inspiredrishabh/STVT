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
                date TEXT NOT NULL,
                theory_status TEXT CHECK(theory_status IN ('present', 'absent')),
                practical_status TEXT CHECK(practical_status IN ('present', 'absent')),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (candidate_id) REFERENCES wtc_candidates(id) ON DELETE CASCADE,
                UNIQUE(candidate_id, date)
            )
        `);
    }

    // Mark attendance for a trainee
    async markAttendance(candidateId, date, theoryStatus, practicalStatus, notes = '') {
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

                    // Check if an attendance record already exists for this candidate and date
                    db.get(
                        `SELECT id FROM ${tableName} WHERE candidate_id = ? AND date = ?`,
                        [candidateId, date],
                        (err, existing) => {
                            if (err) return reject(err);

                            if (existing) {
                                // Update existing record
                                const updateFields = [];
                                const updateValues = [];

                                if (theoryStatus) {
                                    updateFields.push('theory_status = ?');
                                    updateValues.push(theoryStatus);
                                }

                                if (practicalStatus) {
                                    updateFields.push('practical_status = ?');
                                    updateValues.push(practicalStatus);
                                }

                                updateFields.push('notes = ?');
                                updateValues.push(notes);

                                updateFields.push('updated_at = CURRENT_TIMESTAMP');
                                updateValues.push(existing.id);

                                db.run(
                                    `UPDATE ${tableName} SET ${updateFields.join(', ')} WHERE id = ?`,
                                    [...updateValues],
                                    function (err) {
                                        if (err) return reject(err);

                                        // Fetch the updated record to return it
                                        db.get(
                                            `SELECT id, candidate_id, ticket_no, date, theory_status, practical_status, notes 
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
                                                        date: record.date,
                                                        theoryStatus: record.theory_status,
                                                        practicalStatus: record.practical_status,
                                                        notes: record.notes
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
                                    (candidate_id, ticket_no, date, theory_status, practical_status, notes) 
                                    VALUES (?, ?, ?, ?, ?, ?)`,
                                    [candidateId, candidate.ticket_no, date, theoryStatus, practicalStatus, notes],
                                    function (err) {
                                        if (err) return reject(err);

                                        // Fetch the inserted record to return it
                                        db.get(
                                            `SELECT id, candidate_id, ticket_no, date, theory_status, practical_status, notes 
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
                                                        date: record.date,
                                                        theoryStatus: record.theory_status,
                                                        practicalStatus: record.practical_status,
                                                        notes: record.notes
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
                        `SELECT id, date, theory_status, practical_status, notes 
                         FROM ${tableName} 
                         WHERE candidate_id = ? 
                         ORDER BY date DESC`,
                        [candidateId],
                        (err, records) => {
                            if (err) return reject(err);

                            // Calculate statistics
                            const totalRecords = records.length;
                            const theoryPresent = records.filter(r => r.theory_status === 'present').length;
                            const practicalPresent = records.filter(r => r.practical_status === 'present').length;

                            const theoryPercentage = totalRecords > 0 ? Math.round((theoryPresent / totalRecords) * 100) : 0;
                            const practicalPercentage = totalRecords > 0 ? Math.round((practicalPresent / totalRecords) * 100) : 0;

                            // Convert snake_case fields to camelCase for consistency
                            const formattedRecords = records.map(record => ({
                                id: record.id,
                                date: record.date,
                                theoryStatus: record.theory_status,
                                practicalStatus: record.practical_status,
                                notes: record.notes
                            }));

                            resolve({
                                attendanceRecords: formattedRecords,
                                statistics: {
                                    totalRecords,
                                    theoryPresent,
                                    practicalPresent,
                                    theoryPercentage,
                                    practicalPercentage
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
                    COUNT(a.id) as totalDays,
                    SUM(CASE WHEN a.theory_status = 'present' THEN 1 ELSE 0 END) as theoryPresent,
                    SUM(CASE WHEN a.practical_status = 'present' THEN 1 ELSE 0 END) as practicalPresent,
                    ROUND((SUM(CASE WHEN a.theory_status = 'present' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(a.id), 0)), 0) as theoryPercentage,
                    ROUND((SUM(CASE WHEN a.practical_status = 'present' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(a.id), 0)), 0) as practicalPercentage
                FROM 
                    wtc_candidates c
                LEFT JOIN 
                    ${tableName} a ON c.id = a.candidate_id
                ${whereClause}
                GROUP BY 
                    c.id, c.ticket_no, c.name, c.designation, c.batch, c.module_no
            `;

            db.all(query, params, (err, results) => {
                if (err) return reject(err);

                // Calculate overall statistics
                let totalTheoryPresent = 0;
                let totalPracticalPresent = 0;
                let totalDays = 0;

                results.forEach(result => {
                    totalTheoryPresent += result.theoryPresent || 0;
                    totalPracticalPresent += result.practicalPresent || 0;
                    totalDays += result.totalDays || 0;
                });

                const averageTheoryPercentage = totalDays > 0 ? Math.round((totalTheoryPresent / totalDays) * 100) : 0;
                const averagePracticalPercentage = totalDays > 0 ? Math.round((totalPracticalPresent / totalDays) * 100) : 0;

                resolve({
                    candidates: results.map(r => ({
                        id: r.candidateId,
                        ticketNo: r.ticketNo,
                        name: r.name,
                        designation: r.designation,
                        batch: r.batch,
                        moduleNo: r.moduleNo,
                        totalDays: r.totalDays || 0,
                        theoryPresent: r.theoryPresent || 0,
                        practicalPresent: r.practicalPresent || 0,
                        theoryPercentage: r.theoryPercentage || 0,
                        practicalPercentage: r.practicalPercentage || 0
                    })),
                    summary: {
                        totalCandidates: results.length,
                        totalDays,
                        averageTheoryPercentage,
                        averagePracticalPercentage
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
                    const { candidateId, date, theoryStatus, practicalStatus, notes } = record;

                    // Skip if required fields are missing
                    if (!candidateId || !date || (!theoryStatus && !practicalStatus)) {
                        results.push({
                            candidateId,
                            date,
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
                                    date,
                                    success: false,
                                    message: err ? err.message : 'Candidate not found'
                                });
                                processed++;
                            } else {
                                // Check if attendance record exists
                                db.get(
                                    `SELECT id FROM ${tableName} WHERE candidate_id = ? AND date = ?`,
                                    [candidateId, date],
                                    (err, existing) => {
                                        if (err) {
                                            results.push({
                                                candidateId,
                                                date,
                                                success: false,
                                                message: err.message
                                            });
                                            processed++;
                                        } else if (existing) {
                                            // Update existing record
                                            const updateFields = [];
                                            const updateValues = [];

                                            if (theoryStatus) {
                                                updateFields.push('theory_status = ?');
                                                updateValues.push(theoryStatus);
                                            }

                                            if (practicalStatus) {
                                                updateFields.push('practical_status = ?');
                                                updateValues.push(practicalStatus);
                                            }

                                            if (notes) {
                                                updateFields.push('notes = ?');
                                                updateValues.push(notes);
                                            }

                                            updateFields.push('updated_at = CURRENT_TIMESTAMP');
                                            updateValues.push(existing.id);

                                            db.run(
                                                `UPDATE ${tableName} SET ${updateFields.join(', ')} WHERE id = ?`,
                                                [...updateValues],
                                                function (err) {
                                                    results.push({
                                                        candidateId,
                                                        date,
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
                                                (candidate_id, ticket_no, date, theory_status, practical_status, notes) 
                                                VALUES (?, ?, ?, ?, ?, ?)`,
                                                [
                                                    candidateId,
                                                    candidate.ticket_no,
                                                    date,
                                                    theoryStatus || null,
                                                    practicalStatus || null,
                                                    notes || ''
                                                ],
                                                function (err) {
                                                    results.push({
                                                        candidateId,
                                                        date,
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

    // Get attendance by date with optional batch/module filter
    async getAttendanceByDate(date, batch = null, moduleNo = null) {
        const tableName = this.tableName; // Store table name in local variable
        return new Promise((resolve, reject) => {
            let whereClause = 'WHERE a.date = ?';
            const params = [date];

            if (batch) {
                whereClause += ' AND c.batch = ?';
                params.push(batch);
            }

            if (moduleNo) {
                whereClause += ' AND c.module_no = ?';
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
                    a.theory_status as theoryStatus, 
                    a.practical_status as practicalStatus, 
                    a.notes
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