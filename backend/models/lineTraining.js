const sqlite3 = require('sqlite3').verbose();
const {db} = require('../config/db');

class lineTrainingModel {
    constructor() {
        this.tableName = 'line_training_candidates';
        this.migrateDatabaseSchema();
    }

    migrateDatabaseSchema() {
        // Check if table exists with old schema and migrate if needed
        db.get(`PRAGMA table_info(${this.tableName})`, (err, row) => {
            if (err) {
                // Table doesn't exist, create new one
                this.createTable();
            } else {
                // Check if we need to migrate by looking for the old UNIQUE constraint
                db.get(`SELECT sql FROM sqlite_master WHERE type='table' AND name='${this.tableName}'`, (err, result) => {
                    if (result && result.sql.includes('ticket_no TEXT UNIQUE NOT NULL')) {
                        console.log('Migrating line training table schema...');
                        this.migrateFromOldSchema();
                    } else {
                        // Table already has new schema or doesn't exist
                        this.createTable();
                    }
                });
            }
        });
    }

    migrateFromOldSchema() {
        // Backup existing data
        db.all(`SELECT * FROM ${this.tableName}`, (err, existingData) => {
            if (err) {
                console.error('Error reading existing data:', err);
                this.createTable();
                return;
            }

            // Drop old table
            db.run(`DROP TABLE IF EXISTS ${this.tableName}`, (err) => {
                if (err) {
                    console.error('Error dropping old table:', err);
                    return;
                }

                // Create new table with callback to restore data
                db.run(`CREATE TABLE IF NOT EXISTS ${this.tableName} (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ticket_no TEXT NOT NULL,
                    name TEXT,
                    designation TEXT,
                    activity_centre TEXT,
                    start_date TEXT,
                    end_date TEXT,
                    remark TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(ticket_no, activity_centre, start_date, end_date)
                )`, (err) => {
                    if (err) {
                        console.error('Error creating new table:', err);
                        return;
                    }

                    // Restore data (if any) after table is created
                    if (existingData && existingData.length > 0) {
                        console.log(`Restoring ${existingData.length} records...`);
                        existingData.forEach(record => {
                            const sql = `INSERT INTO ${this.tableName} (
                                ticket_no, name, designation, activity_centre, start_date, end_date, remark
                            ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                            
                            db.run(sql, [
                                record.ticket_no,
                                record.name,
                                record.designation,
                                record.activity_centre,
                                record.start_date,
                                record.end_date,
                                record.remark
                            ], function(err) {
                                if (err && !err.message.includes('UNIQUE constraint failed')) {
                                    console.error('Error restoring record:', err);
                                }
                            });
                        });
                        console.log('Migration completed successfully!');
                    }
                });
            });
        });
    }

    createTable() {
        db.run(`CREATE TABLE IF NOT EXISTS ${this.tableName} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket_no TEXT NOT NULL,
            name TEXT,
            designation TEXT,
            activity_centre TEXT,
            start_date TEXT,
            end_date TEXT,
            remark TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(ticket_no, activity_centre, start_date, end_date)
        )`);
    }

    create(candidateData) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO ${this.tableName} (
                ticket_no, name, designation, activity_centre, start_date, end_date, remark
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [
                candidateData.ticket_no || candidateData.ticketNumber,
                candidateData.name,
                candidateData.designation,
                candidateData.activity_centre || candidateData.activityCentre,
                candidateData.start_date || candidateData.startDate,
                candidateData.end_date || candidateData.endDate,
                candidateData.remark
            ], function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        reject(new Error('Trainee is already enrolled in this training program'));
                    } else {
                        reject(err);
                    }
                } else {
                    resolve({ 
                        id: this.lastID,
                        ticket_no: candidateData.ticket_no || candidateData.ticketNumber,
                        ...candidateData
                    });
                }
            });
        });
    }

    getByTicketNumber(ticketNumber) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName} WHERE ticket_no = ?`;
            db.get(sql, [ticketNumber], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    updateByTicketNumber(ticketNumber, candidateData) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE ${this.tableName} SET 
                name = ?, designation = ?, activity_centre = ?, start_date = ?, 
                end_date = ?, remark = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE ticket_no = ?`;
                
            db.run(sql, [
                candidateData.name,
                candidateData.designation,
                candidateData.activity_centre || candidateData.activityCentre,
                candidateData.start_date || candidateData.startDate,
                candidateData.end_date || candidateData.endDate,
                candidateData.remark,
                ticketNumber
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0 ? { ticket_no: ticketNumber, ...candidateData } : null);
                }
            });
        });
    }

    deleteByTicketNumber(ticketNumber) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM ${this.tableName} WHERE ticket_no = ?`;
            db.run(sql, [ticketNumber], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName} ORDER BY created_at DESC`;
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getByDesignation(designation) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName} WHERE designation = ?`;
            db.all(sql, [designation], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getByActivityCentre(activityCentre) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName} WHERE activity_centre = ?`;
            db.all(sql, [activityCentre], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getByDateRange(startDate, endDate) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName} WHERE start_date >= ? AND end_date <= ?`;
            db.all(sql, [startDate, endDate], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get by record ID (primary key)
    getById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Backward compatibility methods
    update(id, data) { return this.updateByTicketNumber(id, data); }
    delete(id) { return this.deleteByTicketNumber(id); }
}

module.exports = lineTrainingModel;