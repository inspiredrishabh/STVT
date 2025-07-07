const sqlite3 = require('sqlite3').verbose();
const db = require('./database');

class MjrCwModel {
    constructor() {
        this.tableName = 'mjr_cw_candidates';
        this.createTable();
    }

    createTable() {
        db.run(`CREATE TABLE IF NOT EXISTS ${this.tableName} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            
            -- Main identifier
            ticket_no TEXT UNIQUE NOT NULL,  -- Main unique identifier
            
            -- Session 1 Papers with marks
            s1p1_marks REAL DEFAULT 0,  -- Session 1 Paper 1 marks
            s1p1_max_marks INTEGER DEFAULT 100,
            s1p2_marks REAL DEFAULT 0,  -- Session 1 Paper 2 marks
            s1p2_max_marks INTEGER DEFAULT 100,
            s1pr_marks REAL DEFAULT 0,  -- Session 1 Practical marks
            s1pr_max_marks INTEGER DEFAULT 50,
            
            -- Session 2 Papers with marks
            s2p1_marks REAL DEFAULT 0,  -- Session 2 Paper 1 marks
            s2p1_max_marks INTEGER DEFAULT 75,
            s2p2_marks REAL DEFAULT 0,  -- Session 2 Paper 2 marks
            s2p2_max_marks INTEGER DEFAULT 100,
            s2pr_marks REAL DEFAULT 0,  -- Session 2 Practical marks
            s2pr_max_marks INTEGER DEFAULT 50,
            
            -- Session 3 Papers with marks
            s3p1_marks REAL DEFAULT 0,  -- Session 3 Paper 1 marks
            s3p1_max_marks INTEGER DEFAULT 100,
            s3p2_marks REAL DEFAULT 0,  -- Session 3 Paper 2 marks
            s3p2_max_marks INTEGER DEFAULT 50,
            s3p3_marks REAL DEFAULT 0,  -- Session 3 Paper 3 marks
            s3p3_max_marks INTEGER DEFAULT 25,
            s3p4_marks REAL DEFAULT 0,  -- Session 3 Paper 4 marks
            s3p4_max_marks INTEGER DEFAULT 50,
            s3pr_marks REAL DEFAULT 0,  -- Session 3 Practical marks
            s3pr_max_marks INTEGER DEFAULT 50,
            
            -- Session 4 Papers with marks
            s4p1_marks REAL DEFAULT 0,  -- Session 4 Paper 1 marks
            s4p1_max_marks INTEGER DEFAULT 100,
            s4pr_marks REAL DEFAULT 0,  -- Session 4 Practical marks
            s4pr_max_marks INTEGER DEFAULT 50,
            s4int_marks REAL DEFAULT 0, -- Session 4 Interview marks
            s4int_max_marks INTEGER DEFAULT 100,

            -- System fields
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY(ticket_no) REFERENCES stc_candidates(ticket_no)
        )`);
    }

    create(scoreData) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO ${this.tableName} (
                ticket_no, s1p1_marks, s1p2_marks, s1pr_marks,
                s2p1_marks, s2p2_marks, s2pr_marks,
                s3p1_marks, s3p2_marks, s3p3_marks, s3p4_marks, s3pr_marks,
                s4p1_marks, s4pr_marks, s4int_marks
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [
                scoreData.ticket_no || scoreData.ticketNumber,
                scoreData.s1p1_marks || scoreData.s1p1 || 0,
                scoreData.s1p2_marks || scoreData.s1p2 || 0,
                scoreData.s1pr_marks || scoreData.s1pr || scoreData.s1p || 0,
                scoreData.s2p1_marks || scoreData.s2p1 || 0,
                scoreData.s2p2_marks || scoreData.s2p2 || 0,
                scoreData.s2pr_marks || scoreData.s2pr || 0,
                scoreData.s3p1_marks || scoreData.s3p1 || 0,
                scoreData.s3p2_marks || scoreData.s3p2 || 0,
                scoreData.s3p3_marks || scoreData.s3p3 || 0,
                scoreData.s3p4_marks || scoreData.s3p4 || 0,
                scoreData.s3pr_marks || scoreData.s3pr || 0,
                scoreData.s4p1_marks || scoreData.s4p1 || 0,
                scoreData.s4pr_marks || scoreData.s4p || 0,
                scoreData.s4int_marks || scoreData.s4int || scoreData.s4i || 0
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
                s1p1_marks = ?, s1p2_marks = ?, s1pr_marks = ?,
                s2p1_marks = ?, s2p2_marks = ?, s2pr_marks = ?,
                s3p1_marks = ?, s3p2_marks = ?, s3p3_marks = ?, s3p4_marks = ?, s3pr_marks = ?,
                s4p1_marks = ?, s4pr_marks = ?, s4int_marks = ?,
                updated_at = CURRENT_TIMESTAMP 
                WHERE ticket_no = ?`;
                
            db.run(sql, [
                scoreData.s1p1_marks || scoreData.s1p1 || 0,
                scoreData.s1p2_marks || scoreData.s1p2 || 0,
                scoreData.s1pr_marks || scoreData.s1pr || scoreData.s1p || 0,
                scoreData.s2p1_marks || scoreData.s2p1 || 0,
                scoreData.s2p2_marks || scoreData.s2p2 || 0,
                scoreData.s2pr_marks || scoreData.s2pr || 0,
                scoreData.s3p1_marks || scoreData.s3p1 || 0,
                scoreData.s3p2_marks || scoreData.s3p2 || 0,
                scoreData.s3p3_marks || scoreData.s3p3 || 0,
                scoreData.s3p4_marks || scoreData.s3p4 || 0,
                scoreData.s3pr_marks || scoreData.s3pr || 0,
                scoreData.s4p1_marks || scoreData.s4p1 || 0,
                scoreData.s4pr_marks || scoreData.s4p || 0,
                scoreData.s4int_marks || scoreData.s4int || scoreData.s4i || 0,
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
                (s1p1_marks + s1p2_marks + s1pr_marks + s2p1_marks + s2p2_marks + s2pr_marks + 
                 s3p1_marks + s3p2_marks + s3p3_marks + s3p4_marks + s3pr_marks + s4p1_marks + s4pr_marks + s4int_marks) as total_marks,
                (s1p1_max_marks + s1p2_max_marks + s1pr_max_marks + s2p1_max_marks + s2p2_max_marks + s2pr_max_marks + 
                 s3p1_max_marks + s3p2_max_marks + s3p3_max_marks + s3p4_max_marks + s3pr_max_marks + s4p1_max_marks + s4pr_max_marks + s4int_max_marks) as total_max_marks
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
                    mjr.s1p1_marks, mjr.s1p2_marks, mjr.s1pr_marks,
                    mjr.s2p1_marks, mjr.s2p2_marks, mjr.s2pr_marks,
                    mjr.s3p1_marks, mjr.s3p2_marks, mjr.s3p3_marks, mjr.s3p4_marks, mjr.s3pr_marks,
                    mjr.s4p1_marks, mjr.s4pr_marks, mjr.s4int_marks,
                    (mjr.s1p1_marks + mjr.s1p2_marks + mjr.s1pr_marks + mjr.s2p1_marks + mjr.s2p2_marks + mjr.s2pr_marks + 
                     mjr.s3p1_marks + mjr.s3p2_marks + mjr.s3p3_marks + mjr.s3p4_marks + mjr.s3pr_marks + mjr.s4p1_marks + mjr.s4pr_marks + mjr.s4int_marks) as total_marks
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
                    mjr.s1p1_marks, mjr.s1p2_marks, mjr.s1pr_marks,
                    mjr.s2p1_marks, mjr.s2p2_marks, mjr.s2pr_marks,
                    mjr.s3p1_marks, mjr.s3p2_marks, mjr.s3p3_marks, mjr.s3p4_marks, mjr.s3pr_marks,
                    mjr.s4p1_marks, mjr.s4pr_marks, mjr.s4int_marks,
                    (mjr.s1p1_marks + mjr.s1p2_marks + mjr.s1pr_marks + mjr.s2p1_marks + mjr.s2p2_marks + mjr.s2pr_marks + 
                     mjr.s3p1_marks + mjr.s3p2_marks + mjr.s3p3_marks + mjr.s3p4_marks + mjr.s3pr_marks + mjr.s4p1_marks + mjr.s4pr_marks + mjr.s4int_marks) as total_marks
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

module.exports = MjrCwModel;