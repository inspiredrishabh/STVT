const sqlite3 = require('sqlite3').verbose();
const { db } = require('../config/db.js');

class MjrDModel {
    constructor() {
        this.tableName = 'mjr_d_candidates';
        this.createTable();
    }

    createTable() {
        db.run(`CREATE TABLE IF NOT EXISTS ${this.tableName} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            
            -- Main identifier
            ticket_no TEXT UNIQUE NOT NULL,  -- Main unique identifier
            
            -- Subject 1 scores
            s1p1 REAL,  -- Subject 1 Part 1
            s1p2 REAL,  -- Subject 1 Part 2
            s1p REAL,   -- Subject 1 Total
            
            -- Subject 2 scores
            s2p1 REAL,  -- Subject 2 Part 1
            s2p2 REAL,  -- Subject 2 Part 2
            s2p REAL,   -- Subject 2 Total
            
            -- Subject 3 scores
            s3p1 REAL,  -- Subject 3 Part 1
            s3p2 REAL,  -- Subject 3 Part 2
            s3p3 REAL,  -- Subject 3 Part 3
            s3p4 REAL,  -- Subject 3 Part 4
            s3p REAL,   -- Subject 3 Total
            
            -- Subject 4 scores
            s4p1 REAL,  -- Subject 4 Part 1
            s4p REAL,   -- Subject 4 Total
            s4i REAL,   -- Subject 4 Internal

            -- System fields
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }

    create(scoreData) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO ${this.tableName} (
                ticket_no, s1p1, s1p2, s1p, s2p1, s2p2, s2p, 
                s3p1, s3p2, s3p3, s3p4, s3p, s4p1, s4p, s4i
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [
                scoreData.ticket_no || scoreData.ticketNumber,
                scoreData.s1p1,
                scoreData.s1p2,
                scoreData.s1p,
                scoreData.s2p1,
                scoreData.s2p2,
                scoreData.s2p,
                scoreData.s3p1,
                scoreData.s3p2,
                scoreData.s3p3,
                scoreData.s3p4,
                scoreData.s3p,
                scoreData.s4p1,
                scoreData.s4p,
                scoreData.s4i
            ], function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        reject(new Error('Ticket number already exists'));
                    } else {
                        reject(err);
                    }
                } else {
                    resolve({ 
                        id: this.lastID,
                        ticket_no: scoreData.ticket_no || scoreData.ticketNumber,
                        ...scoreData
                    });
                }
            });
        });
    }

    // Primary method - Get by ticket number
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

    // Update by ticket number
    updateByTicketNumber(ticketNumber, scoreData) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE ${this.tableName} SET 
                s1p1 = ?, s1p2 = ?, s1p = ?, s2p1 = ?, s2p2 = ?, s2p = ?, 
                s3p1 = ?, s3p2 = ?, s3p3 = ?, s3p4 = ?, s3p = ?, 
                s4p1 = ?, s4p = ?, s4i = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE ticket_no = ?`;
                
            db.run(sql, [
                scoreData.s1p1,
                scoreData.s1p2,
                scoreData.s1p,
                scoreData.s2p1,
                scoreData.s2p2,
                scoreData.s2p,
                scoreData.s3p1,
                scoreData.s3p2,
                scoreData.s3p3,
                scoreData.s3p4,
                scoreData.s3p,
                scoreData.s4p1,
                scoreData.s4p,
                scoreData.s4i,
                ticketNumber
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0 ? { ticket_no: ticketNumber, ...scoreData } : null);
                }
            });
        });
    }

    // Delete by ticket number
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

    // Get scores with candidate details (join with stc_candidates table)
    getScoresWithCandidateDetails() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    sc.*, 
                    mjr.s1p1, mjr.s1p2, mjr.s1p, 
                    mjr.s2p1, mjr.s2p2, mjr.s2p,
                    mjr.s3p1, mjr.s3p2, mjr.s3p3, mjr.s3p4, mjr.s3p,
                    mjr.s4p1, mjr.s4p, mjr.s4i
                FROM stc_candidates sc
                LEFT JOIN ${this.tableName} mjr ON sc.ticket_no = mjr.ticket_no
                ORDER BY sc.created_at DESC
            `;
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get scores for specific candidate with details
    getScoreWithCandidateDetails(ticketNumber) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    sc.*, 
                    mjr.s1p1, mjr.s1p2, mjr.s1p, 
                    mjr.s2p1, mjr.s2p2, mjr.s2p,
                    mjr.s3p1, mjr.s3p2, mjr.s3p3, mjr.s3p4, mjr.s3p,
                    mjr.s4p1, mjr.s4p, mjr.s4i
                FROM stc_candidates sc
                LEFT JOIN ${this.tableName} mjr ON sc.ticket_no = mjr.ticket_no
                WHERE sc.ticket_no = ?
            `;
            db.get(sql, [ticketNumber], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Backward Compatibility
    getById(id) { return this.getByTicketNumber(id); }
    update(id, data) { return this.updateByTicketNumber(id, data); }
    delete(id) { return this.deleteByTicketNumber(id); }
}

module.exports  = MjrDModel;