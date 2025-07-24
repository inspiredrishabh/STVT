const sqlite3 = require('sqlite3').verbose();
const { db } = require('../config/db');

// --- HELPER FUNCTIONS for NAMING CONVENTION ---

// Converts a camelCase string to snake_case
const toSnakeCase = (str) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

// Converts a snake_case string to camelCase
const toCamelCase = (str) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

// Converts all keys of an object to snake_case
const convertToSnakeCase = (obj) => {
    if (!obj) return null;
    const newObj = {};
    for (const key in obj) {
        newObj[toSnakeCase(key)] = obj[key];
    }
    return newObj;
};

// Converts all keys of an object to camelCase
const convertToCamelCase = (obj) => {
    if (!obj) return null;
    const newObj = {};
    for (const key in obj) {
        newObj[toCamelCase(key)] = obj[key];
    }
    return newObj;
};

class WtcModel {
    constructor() {
        this.tableName = 'wtc_candidates';
        this.createTable();
    }

    createTable() {
        db.run(`CREATE TABLE IF NOT EXISTS ${this.tableName} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            
            -- Personal Information
            picture TEXT,
            name TEXT,
            sex TEXT,
            father_name TEXT,
            mother_name TEXT,
            dob TEXT,
            category TEXT,
            pwd TEXT,
            type_of_disability TEXT,
            nationality TEXT DEFAULT 'INDIAN',

            -- Contact Information
            current_address TEXT,
            permanent_address TEXT,
            phone_number TEXT,
            emergency_contact_number TEXT,
            email TEXT,

            -- Professional Information
            date_of_appointment_in_railway TEXT,
            mode_of_appointment TEXT,
            course_type TEXT,
            designation TEXT,
            unit TEXT,
            training_period TEXT,
            theory_duration TEXT,
            practical_duration TEXT,
            working_under TEXT,
            hrms_id TEXT,
            pf_no_nps_ups TEXT,
            employee_number TEXT,

            -- Education Information
            highest_qualification TEXT,
            field_of_study TEXT,
            institution TEXT,
            grade_type TEXT,
            grade_value TEXT,
            
            -- Course Information
            ticket_no TEXT UNIQUE NOT NULL,
            batch TEXT,
            date_of_joining_stc_wtc_non_railway TEXT,
            date_of_sparing TEXT,
            course_coordinator TEXT,

            -- System fields
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }

    create(candidateData) {
        const snakeCaseData = convertToSnakeCase(candidateData);
        return new Promise((resolve, reject) => {
            const columns = Object.keys(snakeCaseData).filter(key => key !== 'id');
            const placeholders = columns.map(() => '?').join(', ');
            const values = columns.map(key => snakeCaseData[key]);

            const sql = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders})`;

            db.run(sql, values, function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        reject(new Error('Ticket number already exists'));
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(convertToCamelCase({ id: this.lastID, ...snakeCaseData }));
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
                    resolve(convertToCamelCase(row));
                }
            });
        });
    }

    // Update by ticket number
    updateByTicketNumber(ticketNumber, candidateData) {
        const snakeCaseData = convertToSnakeCase(candidateData);
        return new Promise((resolve, reject) => {
            // Ensure ticket_no is included in update fields if present in candidateData
            const updateFields = Object.keys(snakeCaseData)
                .filter(key => key !== 'id')
                .map(key => `${key} = ?`)
                .join(', ');

            if (!updateFields) {
                return resolve(null); // No fields to update
            }

            const values = Object.keys(snakeCaseData)
                .filter(key => key !== 'id')
                .map(key => snakeCaseData[key]);
            values.push(ticketNumber); // old ticket_no for WHERE clause

            const sql = `UPDATE ${this.tableName} SET 
                ${updateFields}, 
                updated_at = CURRENT_TIMESTAMP 
                WHERE ticket_no = ?`;

            db.run(sql, values, function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        reject(new Error('Ticket number already exists'));
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(this.changes > 0 ? convertToCamelCase({ ticket_no: snakeCaseData.ticket_no || snakeCaseData.ticketNumber, ...snakeCaseData }) : null);
                }
            });
        });
    }

    // Delete by ticket number
    deleteByTicketNumber(ticketNumber) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM ${this.tableName} WHERE ticket_no = ?`;
            db.run(sql, [ticketNumber], function (err) {
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
                    resolve(rows.map(row => convertToCamelCase(row)));
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
                    resolve(rows.map(row => convertToCamelCase(row)));
                }
            });
        });
    }

    // WTC specific methods
    getByCourseType(courseType) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName} WHERE course_type = ?`;
            db.all(sql, [courseType], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => convertToCamelCase(row)));
                }
            });
        });
    }

    getByUnit(unit) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName} WHERE unit = ?`;
            db.all(sql, [unit], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => convertToCamelCase(row)));
                }
            });
        });
    }
    // Get candidates by batch
    getByBatch(batch) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName} WHERE batch = ?`;
            db.all(sql, [batch], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => convertToCamelCase(row)));
                }
            });
        });
    }

    // Get candidates by module number
    getByModuleNo(moduleNo) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName} WHERE module_no = ?`;
            db.all(sql, [moduleNo], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => convertToCamelCase(row)));
                }
            });
        });
    }

    // Abhi tak Id Unique The Ab Ticket Number Ho Gya Hai Isliye - Backward Compatibility
    getById(id) { return this.getByTicketNumber(id); }
    update(id, data) { return this.updateByTicketNumber(id, data); }
    delete(id) { return this.deleteByTicketNumber(id); }
}

module.exports = WtcModel;