const sqlite3 = require('sqlite3').verbose();
const { db } = require('../config/db.js');

class MjiWModel {
    constructor() {
        this.tableName = 'mji_w_candidates';
        this.createTable();
    }

    createTable() {
        db.run(`CREATE TABLE IF NOT EXISTS ${this.tableName} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            
            -- Main identifier
            ticket_no TEXT UNIQUE NOT NULL,  -- Main unique identifier
            
            -- Subject 1 scores (7 parts)
            s1p1 REAL,  -- Subject 1 Part 1
            s1p2 REAL,  -- Subject 1 Part 2
            s1p3 REAL,  -- Subject 1 Part 3
            s1p4 REAL,  -- Subject 1 Part 4
            s1p5 REAL,  -- Subject 1 Part 5
            s1p6 REAL,  -- Subject 1 Part 6
            s1p7 REAL,  -- Subject 1 Part 7
            
            -- Subject 2 scores (8 parts)
            s2p1 REAL,  -- Subject 2 Part 1
            s2p2 REAL,  -- Subject 2 Part 2
            s2p3 REAL,  -- Subject 2 Part 3
            s2p4 REAL,  -- Subject 2 Part 4
            s2p5 REAL,  -- Subject 2 Part 5
            s2p6 REAL,  -- Subject 2 Part 6
            s2p7 REAL,  -- Subject 2 Part 7
            s2p8 REAL,  -- Subject 2 Part 8
            
            -- Subject 3 scores (2 parts)
            s3p1 REAL,  -- Subject 3 Part 1
            s3p2 REAL,  -- Subject 3 Part 2
            
            -- Subject 4 scores
            s4p1 REAL,  -- Subject 4 Part 1
            s4p2 REAL,  -- Subject 4 Part 2
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
                ticket_no, s1p1, s1p2, s1p3, s1p4, s1p5, s1p6, s1p7,
                s2p1, s2p2, s2p3, s2p4, s2p5, s2p6, s2p7, s2p8,
                s3p1, s3p2, s4p1, s4p2, s4p, s4i
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [
                scoreData.ticket_no || scoreData.ticketNumber,
                scoreData.s1p1, scoreData.s1p2, scoreData.s1p3, scoreData.s1p4,
                scoreData.s1p5, scoreData.s1p6, scoreData.s1p7,
                scoreData.s2p1, scoreData.s2p2, scoreData.s2p3, scoreData.s2p4,
                scoreData.s2p5, scoreData.s2p6, scoreData.s2p7, scoreData.s2p8,
                scoreData.s3p1, scoreData.s3p2,
                scoreData.s4p1, scoreData.s4p2, scoreData.s4p, scoreData.s4i
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
                s1p1 = ?, s1p2 = ?, s1p3 = ?, s1p4 = ?, s1p5 = ?, s1p6 = ?, s1p7 = ?,
                s2p1 = ?, s2p2 = ?, s2p3 = ?, s2p4 = ?, s2p5 = ?, s2p6 = ?, s2p7 = ?, s2p8 = ?,
                s3p1 = ?, s3p2 = ?, s4p1 = ?, s4p2 = ?, s4p = ?, s4i = ?,
                updated_at = CURRENT_TIMESTAMP 
                WHERE ticket_no = ?`;
                
            db.run(sql, [
                scoreData.s1p1, scoreData.s1p2, scoreData.s1p3, scoreData.s1p4,
                scoreData.s1p5, scoreData.s1p6, scoreData.s1p7,
                scoreData.s2p1, scoreData.s2p2, scoreData.s2p3, scoreData.s2p4,
                scoreData.s2p5, scoreData.s2p6, scoreData.s2p7, scoreData.s2p8,
                scoreData.s3p1, scoreData.s3p2,
                scoreData.s4p1, scoreData.s4p2, scoreData.s4p, scoreData.s4i,
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
                    mji.s1p1, mji.s1p2, mji.s1p3, mji.s1p4, mji.s1p5, mji.s1p6, mji.s1p7,
                    mji.s2p1, mji.s2p2, mji.s2p3, mji.s2p4, mji.s2p5, mji.s2p6, mji.s2p7, mji.s2p8,
                    mji.s3p1, mji.s3p2, mji.s4p1, mji.s4p2, mji.s4p, mji.s4i
                FROM stc_candidates sc
                LEFT JOIN ${this.tableName} mji ON sc.ticket_no = mji.ticket_no
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
                    mji.s1p1, mji.s1p2, mji.s1p3, mji.s1p4, mji.s1p5, mji.s1p6, mji.s1p7,
                    mji.s2p1, mji.s2p2, mji.s2p3, mji.s2p4, mji.s2p5, mji.s2p6, mji.s2p7, mji.s2p8,
                    mji.s3p1, mji.s3p2, mji.s4p1, mji.s4p2, mji.s4p, mji.s4i
                FROM stc_candidates sc
                LEFT JOIN ${this.tableName} mji ON sc.ticket_no = mji.ticket_no
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

module.exports = MjiWModel;
