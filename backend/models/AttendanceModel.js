const sqlite3 = require('sqlite3').verbose();
const { db } = require('../config/db');

// Helper functions for naming convention (from wtcModel.js)
const toSnakeCase = (str) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
const toCamelCase = (str) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

const convertToSnakeCase = (obj) => {
    if (!obj) return null;
    const newObj = {};
    for (const key in obj) {
        newObj[toSnakeCase(key)] = obj[key];
    }
    return newObj;
};

const convertToCamelCase = (obj) => {
    if (!obj) return null;
    const newObj = {};
    for (const key in obj) {
        newObj[toCamelCase(key)] = obj[key];
    }
    return newObj;
};

class AttendanceModel {
    constructor() {
        this.tableName = 'attendances';
        this.createTable();
    }

    createTable() {
        db.run(`CREATE TABLE IF NOT EXISTS ${this.tableName} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            candidate_id INTEGER NOT NULL,
            ticket_no TEXT NOT NULL,
            date TEXT NOT NULL,
            theory_status TEXT NOT NULL CHECK(theory_status IN ('present', 'absent')),
            practical_status TEXT NOT NULL CHECK(practical_status IN ('present', 'absent')),
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (candidate_id) REFERENCES wtc_candidates(id),
            UNIQUE(candidate_id, date)
        )`);
    }

    // Create or update attendance record
    markAttendance(attendanceData) {
        const snakeCaseData = convertToSnakeCase(attendanceData);
        return new Promise((resolve, reject) => {
            // First check if record exists
            const checkSql = `SELECT id FROM ${this.tableName} WHERE candidate_id = ? AND date = ?`;
            db.get(checkSql, [snakeCaseData.candidate_id, snakeCaseData.date], (err, row) => {
                if (err) {
                    return reject(err);
                }

                if (row) {
                    // Update existing record
                    const updateFields = Object.keys(snakeCaseData)
                        .filter(key => key !== 'id' && key !== 'candidate_id' && key !== 'date')
                        .map(key => `${key} = ?`)
                        .join(', ');

                    if (!updateFields) {
                        return resolve(null); // No fields to update
                    }

                    const values = [...Object.values(snakeCaseData).filter((_, i) => {
                        const key = Object.keys(snakeCaseData)[i];
                        return key !== 'id' && key !== 'candidate_id' && key !== 'date';
                    }), snakeCaseData.candidate_id, snakeCaseData.date];

                    const updateSql = `UPDATE ${this.tableName} SET 
                        ${updateFields}, 
                        updated_at = CURRENT_TIMESTAMP 
                        WHERE candidate_id = ? AND date = ?`;

                    db.run(updateSql, values, function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            db.get(`SELECT * FROM ${this.tableName} WHERE id = ?`, [row.id], (err, updatedRow) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(convertToCamelCase(updatedRow));
                                }
                            });
                        }
                    });
                } else {
                    // Create new record
                    const columns = Object.keys(snakeCaseData);
                    const placeholders = columns.map(() => '?').join(', ');
                    const values = columns.map(key => snakeCaseData[key]);

                    const insertSql = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders})`;

                    db.run(insertSql, values, function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            db.get(`SELECT * FROM ${this.tableName} WHERE id = ?`, [this.lastID], (err, newRow) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(convertToCamelCase(newRow));
                                }
                            });
                        }
                    });
                }
            });
        });
    }

    // Get attendance records for a candidate
    getAttendanceByCandidate(candidateId, startDate = null, endDate = null) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM ${this.tableName} WHERE candidate_id = ?`;
            let params = [candidateId];

            if (startDate && endDate) {
                sql += ` AND date BETWEEN ? AND ?`;
                params.push(startDate, endDate);
            } else if (startDate) {
                sql += ` AND date >= ?`;
                params.push(startDate);
            } else if (endDate) {
                sql += ` AND date <= ?`;
                params.push(endDate);
            }

            sql += ` ORDER BY date DESC`;

            db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => convertToCamelCase(row)));
                }
            });
        });
    }

    // Get attendance by date
    getAttendanceByDate(date, batch = null, moduleNo = null) {
        return new Promise((resolve, reject) => {
            let sql = `
                SELECT a.*, c.name, c.ticket_no, c.batch, c.module_no, c.designation 
                FROM ${this.tableName} a
                JOIN wtc_candidates c ON a.candidate_id = c.id
                WHERE a.date = ?
            `;
            let params = [date];

            if (batch) {
                sql += ` AND c.batch = ?`;
                params.push(batch);
            }

            if (moduleNo) {
                sql += ` AND c.module_no = ?`;
                params.push(moduleNo);
            }

            db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => convertToCamelCase(row)));
                }
            });
        });
    }

    // Get summary statistics for a candidate
    getAttendanceStats(candidateId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT 
                COUNT(*) as total_records,
                SUM(CASE WHEN theory_status = 'present' THEN 1 ELSE 0 END) as theory_present,
                SUM(CASE WHEN practical_status = 'present' THEN 1 ELSE 0 END) as practical_present
                FROM ${this.tableName}
                WHERE candidate_id = ?`;

            db.get(sql, [candidateId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (!row || row.total_records === 0) {
                        resolve({
                            totalRecords: 0,
                            theoryPresent: 0,
                            practicalPresent: 0,
                            theoryPercentage: 0,
                            practicalPercentage: 0,
                            overallPercentage: 0
                        });
                    } else {
                        const stats = {
                            totalRecords: row.total_records,
                            theoryPresent: row.theory_present,
                            practicalPresent: row.practical_present,
                            theoryPercentage: Math.round((row.theory_present / row.total_records) * 100),
                            practicalPercentage: Math.round((row.practical_present / row.total_records) * 100),
                        };
                        stats.overallPercentage = Math.round((stats.theoryPercentage + stats.practicalPercentage) / 2);
                        resolve(stats);
                    }
                }
            });
        });
    }

    // Delete attendance record
    deleteAttendance(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
            db.run(sql, [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    }

    // Bulk mark attendance
    bulkMarkAttendance(recordsArray) {
        return new Promise(async (resolve, reject) => {
            if (!Array.isArray(recordsArray) || recordsArray.length === 0) {
                return reject(new Error('Invalid records array'));
            }

            const results = [];
            const errors = [];

            // Use a transaction for bulk operations
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                for (const record of recordsArray) {
                    const snakeCaseData = convertToSnakeCase(record);

                    try {
                        // Check if record exists
                        const checkSql = `SELECT id FROM ${this.tableName} 
                            WHERE candidate_id = ? AND date = ?`;

                        db.get(checkSql, [snakeCaseData.candidate_id, snakeCaseData.date], (err, row) => {
                            if (err) {
                                errors.push({ record: snakeCaseData, error: err.message });
                                return;
                            }

                            if (row) {
                                // Update
                                const updateFields = Object.keys(snakeCaseData)
                                    .filter(key => key !== 'id' && key !== 'candidate_id' && key !== 'date')
                                    .map(key => `${key} = ?`)
                                    .join(', ');

                                if (!updateFields) return;

                                const values = [
                                    ...Object.values(snakeCaseData).filter((_, i) => {
                                        const key = Object.keys(snakeCaseData)[i];
                                        return key !== 'id' && key !== 'candidate_id' && key !== 'date';
                                    }),
                                    snakeCaseData.candidate_id,
                                    snakeCaseData.date
                                ];

                                const updateSql = `UPDATE ${this.tableName} SET 
                                    ${updateFields}, 
                                    updated_at = CURRENT_TIMESTAMP 
                                    WHERE candidate_id = ? AND date = ?`;

                                db.run(updateSql, values, function (err) {
                                    if (err) {
                                        errors.push({ record: snakeCaseData, error: err.message });
                                    } else {
                                        results.push({ candidateId: snakeCaseData.candidate_id, date: snakeCaseData.date, success: true });
                                    }
                                });
                            } else {
                                // Insert
                                const columns = Object.keys(snakeCaseData);
                                const placeholders = columns.map(() => '?').join(', ');
                                const values = columns.map(key => snakeCaseData[key]);

                                const insertSql = `INSERT INTO ${this.tableName} (${columns.join(', ')}) 
                                    VALUES (${placeholders})`;

                                db.run(insertSql, values, function (err) {
                                    if (err) {
                                        errors.push({ record: snakeCaseData, error: err.message });
                                    } else {
                                        results.push({ candidateId: snakeCaseData.candidate_id, date: snakeCaseData.date, success: true });
                                    }
                                });
                            }
                        });
                    } catch (err) {
                        errors.push({ record: snakeCaseData, error: err.message });
                    }
                }

                // Commit or rollback based on errors
                if (errors.length > 0) {
                    db.run('ROLLBACK', () => {
                        reject({ errors });
                    });
                } else {
                    db.run('COMMIT', () => {
                        resolve({ results });
                    });
                }
            });
        });
    }
}

module.exports = new AttendanceModel();
