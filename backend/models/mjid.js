const sqlite3 = require('sqlite3').verbose();
const {db} = require('../config/db');

class MjiDModel {
    constructor() {
        this.tableName = 'mji_d_candidates';
        this.createTable();
    }

    createTable() {
        db.run(`CREATE TABLE IF NOT EXISTS ${this.tableName} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            
            -- Main identifier
            ticket_no TEXT UNIQUE NOT NULL,  -- Main unique identifier
            
            -- Session 1 Papers with marks (7 papers)
            s1p1_marks REAL DEFAULT 0,  -- Session 1 Paper 1 marks
            s1p1_max_marks INTEGER DEFAULT 100,
            s1p2_marks REAL DEFAULT 0,  -- Session 1 Paper 2 marks
            s1p2_max_marks INTEGER DEFAULT 100,
            s1p3_marks REAL DEFAULT 0,  -- Session 1 Paper 3 marks
            s1p3_max_marks INTEGER DEFAULT 100,
            s1p4_marks REAL DEFAULT 0,  -- Session 1 Paper 4 marks
            s1p4_max_marks INTEGER DEFAULT 100,
            s1p5_marks REAL DEFAULT 0,  -- Session 1 Paper 5 marks
            s1p5_max_marks INTEGER DEFAULT 100,
            s1p6_marks REAL DEFAULT 0,  -- Session 1 Paper 6 marks
            s1p6_max_marks INTEGER DEFAULT 100,
            s1p7_marks REAL DEFAULT 0,  -- Session 1 Paper 7 marks
            s1p7_max_marks INTEGER DEFAULT 100,
            
            -- Session 2 Papers with marks (8 papers)
            s2p1_marks REAL DEFAULT 0,  -- Session 2 Paper 1 marks
            s2p1_max_marks INTEGER DEFAULT 100,
            s2p2_marks REAL DEFAULT 0,  -- Session 2 Paper 2 marks
            s2p2_max_marks INTEGER DEFAULT 100,
            s2p3_marks REAL DEFAULT 0,  -- Session 2 Paper 3 marks
            s2p3_max_marks INTEGER DEFAULT 100,
            s2p4_marks REAL DEFAULT 0,  -- Session 2 Paper 4 marks
            s2p4_max_marks INTEGER DEFAULT 100,
            s2p5_marks REAL DEFAULT 0,  -- Session 2 Paper 5 marks
            s2p5_max_marks INTEGER DEFAULT 50,
            s2p6_marks REAL DEFAULT 0,  -- Session 2 Paper 6 marks
            s2p6_max_marks INTEGER DEFAULT 25,
            s2p7_marks REAL DEFAULT 0,  -- Session 2 Paper 7 marks
            s2p7_max_marks INTEGER DEFAULT 50,
            s2p8_marks REAL DEFAULT 0,  -- Session 2 Paper 8 marks
            s2p8_max_marks INTEGER DEFAULT 50,
            
            -- Session 3 Papers with marks (2 papers)
            s3p1_marks REAL DEFAULT 0,  -- Session 3 Paper 1 marks
            s3p1_max_marks INTEGER DEFAULT 125,
            s3p2_marks REAL DEFAULT 0,  -- Session 3 Paper 2 marks
            s3p2_max_marks INTEGER DEFAULT 100,
            
            -- Session 4 Papers with marks
            s4p1_marks REAL DEFAULT 0,  -- Session 4 Paper 1 marks
            s4p1_max_marks INTEGER DEFAULT 100,
            s4p2_marks REAL DEFAULT 0,  -- Session 4 Paper 2 marks
            s4p2_max_marks INTEGER DEFAULT 100,
            s4pr_marks REAL DEFAULT 0,  -- Session 4 Practical marks
            s4pr_max_marks INTEGER DEFAULT 50,
            s4int_marks REAL DEFAULT 0, -- Session 4 Interview marks
            s4int_max_marks INTEGER DEFAULT 50,

            -- System fields
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY(ticket_no) REFERENCES stc_candidates(ticket_no)
        )`);
    }

    create(scoreData) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO ${this.tableName} (
                ticket_no, s1p1_marks, s1p2_marks, s1p3_marks, s1p4_marks, s1p5_marks, s1p6_marks, s1p7_marks,
                s2p1_marks, s2p2_marks, s2p3_marks, s2p4_marks, s2p5_marks, s2p6_marks, s2p7_marks, s2p8_marks,
                s3p1_marks, s3p2_marks, s4p1_marks, s4p2_marks, s4pr_marks, s4int_marks
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [
                scoreData.ticket_no || scoreData.ticketNumber,
                scoreData.s1p1_marks || scoreData.s1p1 || 0,
                scoreData.s1p2_marks || scoreData.s1p2 || 0,
                scoreData.s1p3_marks || scoreData.s1p3 || 0,
                scoreData.s1p4_marks || scoreData.s1p4 || 0,
                scoreData.s1p5_marks || scoreData.s1p5 || 0,
                scoreData.s1p6_marks || scoreData.s1p6 || 0,
                scoreData.s1p7_marks || scoreData.s1p7 || 0,
                scoreData.s2p1_marks || scoreData.s2p1 || 0,
                scoreData.s2p2_marks || scoreData.s2p2 || 0,
                scoreData.s2p3_marks || scoreData.s2p3 || 0,
                scoreData.s2p4_marks || scoreData.s2p4 || 0,
                scoreData.s2p5_marks || scoreData.s2p5 || 0,
                scoreData.s2p6_marks || scoreData.s2p6 || 0,
                scoreData.s2p7_marks || scoreData.s2p7 || 0,
                scoreData.s2p8_marks || scoreData.s2p8 || 0,
                scoreData.s3p1_marks || scoreData.s3p1 || 0,
                scoreData.s3p2_marks || scoreData.s3p2 || 0,
                scoreData.s4p1_marks || scoreData.s4p1 || 0,
                scoreData.s4p2_marks || scoreData.s4p2 || 0,
                scoreData.s4pr_marks || scoreData.s4p || 0,
                scoreData.s4int_marks || scoreData.s4i || 0
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
                s1p1_marks = ?, s1p2_marks = ?, s1p3_marks = ?, s1p4_marks = ?, s1p5_marks = ?, s1p6_marks = ?, s1p7_marks = ?,
                s2p1_marks = ?, s2p2_marks = ?, s2p3_marks = ?, s2p4_marks = ?, s2p5_marks = ?, s2p6_marks = ?, s2p7_marks = ?, s2p8_marks = ?,
                s3p1_marks = ?, s3p2_marks = ?, s4p1_marks = ?, s4p2_marks = ?, s4pr_marks = ?, s4int_marks = ?,
                updated_at = CURRENT_TIMESTAMP 
                WHERE ticket_no = ?`;
                
            db.run(sql, [
                scoreData.s1p1_marks || scoreData.s1p1 || 0,
                scoreData.s1p2_marks || scoreData.s1p2 || 0,
                scoreData.s1p3_marks || scoreData.s1p3 || 0,
                scoreData.s1p4_marks || scoreData.s1p4 || 0,
                scoreData.s1p5_marks || scoreData.s1p5 || 0,
                scoreData.s1p6_marks || scoreData.s1p6 || 0,
                scoreData.s1p7_marks || scoreData.s1p7 || 0,
                scoreData.s2p1_marks || scoreData.s2p1 || 0,
                scoreData.s2p2_marks || scoreData.s2p2 || 0,
                scoreData.s2p3_marks || scoreData.s2p3 || 0,
                scoreData.s2p4_marks || scoreData.s2p4 || 0,
                scoreData.s2p5_marks || scoreData.s2p5 || 0,
                scoreData.s2p6_marks || scoreData.s2p6 || 0,
                scoreData.s2p7_marks || scoreData.s2p7 || 0,
                scoreData.s2p8_marks || scoreData.s2p8 || 0,
                scoreData.s3p1_marks || scoreData.s3p1 || 0,
                scoreData.s3p2_marks || scoreData.s3p2 || 0,
                scoreData.s4p1_marks || scoreData.s4p1 || 0,
                scoreData.s4p2_marks || scoreData.s4p2 || 0,
                scoreData.s4pr_marks || scoreData.s4p || 0,
                scoreData.s4int_marks || scoreData.s4i || 0,
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

    // Update specific paper marks
    updatePaperMarks(ticketNumber, paperCode, marks) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE ${this.tableName} SET ${paperCode}_marks = ?, updated_at = CURRENT_TIMESTAMP 
                        WHERE ticket_no = ?`;
            
            db.run(sql, [marks, ticketNumber], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    }

    // Get marks summary with totals
    getMarksSummary(ticketNumber) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *,
                (s1p1_marks + s1p2_marks + s1p3_marks + s1p4_marks + s1p5_marks + s1p6_marks + s1p7_marks +
                 s2p1_marks + s2p2_marks + s2p3_marks + s2p4_marks + s2p5_marks + s2p6_marks + s2p7_marks + s2p8_marks +
                 s3p1_marks + s3p2_marks + s4p1_marks + s4p2_marks + s4pr_marks + s4int_marks) as total_marks,
                (s1p1_max_marks + s1p2_max_marks + s1p3_max_marks + s1p4_max_marks + s1p5_max_marks + s1p6_max_marks + s1p7_max_marks +
                 s2p1_max_marks + s2p2_max_marks + s2p3_max_marks + s2p4_max_marks + s2p5_max_marks + s2p6_max_marks + s2p7_max_marks + s2p8_max_marks +
                 s3p1_max_marks + s3p2_max_marks + s4p1_max_marks + s4p2_max_marks + s4pr_max_marks + s4int_max_marks) as total_max_marks
                FROM ${this.tableName} WHERE ticket_no = ?`;
            
            db.get(sql, [ticketNumber], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
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
                    mji.s1p1_marks, mji.s1p2_marks, mji.s1p3_marks, mji.s1p4_marks, mji.s1p5_marks, mji.s1p6_marks, mji.s1p7_marks,
                    mji.s2p1_marks, mji.s2p2_marks, mji.s2p3_marks, mji.s2p4_marks, mji.s2p5_marks, mji.s2p6_marks, mji.s2p7_marks, mji.s2p8_marks,
                    mji.s3p1_marks, mji.s3p2_marks, mji.s4p1_marks, mji.s4p2_marks, mji.s4pr_marks, mji.s4int_marks,
                    (mji.s1p1_marks + mji.s1p2_marks + mji.s1p3_marks + mji.s1p4_marks + mji.s1p5_marks + mji.s1p6_marks + mji.s1p7_marks +
                     mji.s2p1_marks + mji.s2p2_marks + mji.s2p3_marks + mji.s2p4_marks + mji.s2p5_marks + mji.s2p6_marks + mji.s2p7_marks + mji.s2p8_marks +
                     mji.s3p1_marks + mji.s3p2_marks + mji.s4p1_marks + mji.s4p2_marks + mji.s4pr_marks + mji.s4int_marks) as total_marks
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
                    mji.s1p1_marks, mji.s1p2_marks, mji.s1p3_marks, mji.s1p4_marks, mji.s1p5_marks, mji.s1p6_marks, mji.s1p7_marks,
                    mji.s2p1_marks, mji.s2p2_marks, mji.s2p3_marks, mji.s2p4_marks, mji.s2p5_marks, mji.s2p6_marks, mji.s2p7_marks, mji.s2p8_marks,
                    mji.s3p1_marks, mji.s3p2_marks, mji.s4p1_marks, mji.s4p2_marks, mji.s4pr_marks, mji.s4int_marks,
                    (mji.s1p1_marks + mji.s1p2_marks + mji.s1p3_marks + mji.s1p4_marks + mji.s1p5_marks + mji.s1p6_marks + mji.s1p7_marks +
                     mji.s2p1_marks + mji.s2p2_marks + mji.s2p3_marks + mji.s2p4_marks + mji.s2p5_marks + mji.s2p6_marks + mji.s2p7_marks + mji.s2p8_marks +
                     mji.s3p1_marks + mji.s3p2_marks + mji.s4p1_marks + mji.s4p2_marks + mji.s4pr_marks + mji.s4int_marks) as total_marks
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

module.exports = MjiDModel;