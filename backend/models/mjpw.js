const sqlite3 = require('sqlite3').verbose();
const { db } = require('../config/db.js');

class MjpWModel {
    constructor() {
        this.tableName = 'mjp_w_candidates';
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
            
            -- Subject 2 scores
            s2p1 REAL,  -- Subject 2 Part 1
            s2p REAL,   -- Subject 2 Total
            s2i REAL,   -- Subject 2 Internal

            -- System fields
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }

    create(scoreData) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO ${this.tableName} (
                ticket_no, s1p1, s1p2, s2p1, s2p, s2i
            ) VALUES (?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [
                scoreData.ticket_no || scoreData.ticketNumber,
                scoreData.s1p1,
                scoreData.s1p2,
                scoreData.s2p1,
                scoreData.s2p,
                scoreData.s2i
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
                s1p1 = ?, s1p2 = ?, s2p1 = ?, s2p = ?, s2i = ?,
                updated_at = CURRENT_TIMESTAMP 
                WHERE ticket_no = ?`;
                
            db.run(sql, [
                scoreData.s1p1,
                scoreData.s1p2,
                scoreData.s2p1,
                scoreData.s2p,
                scoreData.s2i,
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
                    mjp.s1p1, mjp.s1p2, mjp.s2p1, mjp.s2p, mjp.s2i
                FROM stc_candidates sc
                LEFT JOIN ${this.tableName} mjp ON sc.ticket_no = mjp.ticket_no
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
                    mjp.s1p1, mjp.s1p2, mjp.s2p1, mjp.s2p, mjp.s2i
                FROM stc_candidates sc
                LEFT JOIN ${this.tableName} mjp ON sc.ticket_no = mjp.ticket_no
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

module.exports = MjpWModel;