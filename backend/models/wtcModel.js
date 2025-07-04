const { db } = require('../config/db.js'); // Get the db instancenst sqlite3 = require('sqlite3').verbose();


class WtcModel {
    constructor() {
        this.tableName = 'wtc_candidates';
        this.createTable();
    }

    createTable() {
        db.run(`CREATE TABLE IF NOT EXISTS ${this.tableName} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            
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

            permanent_address TEXT,
            current_address TEXT,
            phone_number TEXT,
            emergency_contact_number TEXT,
            email TEXT,

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

            highest_qualification TEXT,
            field_of_study TEXT,
            institution TEXT,
            grade_type TEXT,
            grade_value TEXT,
            
            ticket_no TEXT UNIQUE NOT NULL, 
            batch TEXT,
            date_of_joining_stc_wtc_non_railway TEXT,
            module_no TEXT,
            date_of_sparing TEXT,
            course_duration TEXT,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }

    create(candidateData) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO ${this.tableName} (
                picture, name, sex, father_name, mother_name, dob, category, pwd, 
                type_of_disability, nationality, permanent_address, current_address, 
                phone_number, emergency_contact_number, email, date_of_appointment_in_railway, 
                mode_of_appointment, course_type, designation, unit, training_period, 
                theory_duration, practical_duration, working_under, hrms_id, pf_no_nps_ups, 
                employee_number, highest_qualification, field_of_study, institution, grade_type, 
                grade_value, ticket_no, batch, date_of_joining_stc_wtc_non_railway, module_no, 
                date_of_sparing, course_duration
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            db.run(sql, [
                candidateData.picture || candidateData.imagePath,
                candidateData.name,
                candidateData.sex,
                candidateData.father_name,
                candidateData.mother_name,
                candidateData.dob,
                candidateData.category,
                candidateData.pwd,
                candidateData.type_of_disability,
                candidateData.nationality || 'INDIAN',
                candidateData.permanent_address,
                candidateData.current_address,
                candidateData.phone_number,
                candidateData.emergency_contact_number,
                candidateData.email,
                candidateData.date_of_appointment_in_railway,
                candidateData.mode_of_appointment,
                candidateData.course_type,
                candidateData.designation,
                candidateData.unit,
                candidateData.training_period,
                candidateData.theory_duration,
                candidateData.practical_duration,
                candidateData.working_under,
                candidateData.hrms_id,
                candidateData.pf_no_nps_ups,
                candidateData.employee_number,
                candidateData.highest_qualification,
                candidateData.field_of_study,
                candidateData.institution,
                candidateData.grade_type,
                candidateData.grade_value,
                candidateData.ticket_no || candidateData.ticketNumber,
                candidateData.batch,
                candidateData.date_of_joining_stc_wtc_non_railway,
                candidateData.module_no,
                candidateData.date_of_sparing,
                candidateData.course_duration
            ], function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        reject(new Error('Ticket number already exists'));
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
    updateByTicketNumber(ticketNumber, candidateData) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE ${this.tableName} SET 
                picture = ?, name = ?, sex = ?, father_name = ?, mother_name = ?, dob = ?, 
                category = ?, pwd = ?, type_of_disability = ?, nationality = ?, 
                permanent_address = ?, current_address = ?, phone_number = ?, 
                emergency_contact_number = ?, email = ?, date_of_appointment_in_railway = ?, 
                mode_of_appointment = ?, course_type = ?, designation = ?, unit = ?, 
                training_period = ?, theory_duration = ?, practical_duration = ?, 
                working_under = ?, hrms_id = ?, pf_no_nps_ups = ?, employee_number = ?, 
                highest_qualification = ?, field_of_study = ?, institution = ?, grade_type = ?, 
                grade_value = ?, batch = ?, date_of_joining_stc_wtc_non_railway = ?, 
                module_no = ?, date_of_sparing = ?, course_duration = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE ticket_no = ?`;

            db.run(sql, [
                candidateData.picture || candidateData.imagePath,
                candidateData.name,
                candidateData.sex,
                candidateData.father_name,
                candidateData.mother_name,
                candidateData.dob,
                candidateData.category,
                candidateData.pwd,
                candidateData.type_of_disability,
                candidateData.nationality || 'INDIAN',
                candidateData.permanent_address,
                candidateData.current_address,
                candidateData.phone_number,
                candidateData.emergency_contact_number,
                candidateData.email,
                candidateData.date_of_appointment_in_railway,
                candidateData.mode_of_appointment,
                candidateData.course_type,
                candidateData.designation,
                candidateData.unit,
                candidateData.training_period,
                candidateData.theory_duration,
                candidateData.practical_duration,
                candidateData.working_under,
                candidateData.hrms_id,
                candidateData.pf_no_nps_ups,
                candidateData.employee_number,
                candidateData.highest_qualification,
                candidateData.field_of_study,
                candidateData.institution,
                candidateData.grade_type,
                candidateData.grade_value,
                candidateData.batch,
                candidateData.date_of_joining_stc_wtc_non_railway,
                candidateData.module_no,
                candidateData.date_of_sparing,
                candidateData.course_duration,
                ticketNumber
            ], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0 ? { ticket_no: ticketNumber, ...candidateData } : null);
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

    // WTC specific methods
    getByCourseType(courseType) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName} WHERE course_type = ?`;
            db.all(sql, [courseType], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
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
                    resolve(rows);
                }
            });
        });
    }

    // getByTrainingPeriod(trainingPeriod) {
    //     return new Promise((resolve, reject) => {
    //         const sql = `SELECT * FROM ${this.tableName} WHERE training_period = ?`;
    //         db.all(sql, [trainingPeriod], (err, rows) => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(rows);
    //             }
    //         });
    //     });
    // }

    // getByTheoryDuration(theoryDuration) {
    //     return new Promise((resolve, reject) => {
    //         const sql = `SELECT * FROM ${this.tableName} WHERE theory_duration = ?`;
    //         db.all(sql, [theoryDuration], (err, rows) => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(rows);
    //             }
    //         });
    //     });
    // }

    // getByPracticalDuration(practicalDuration) {
    //     return new Promise((resolve, reject) => {
    //         const sql = `SELECT * FROM ${this.tableName} WHERE practical_duration = ?`;
    //         db.all(sql, [practicalDuration], (err, rows) => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(rows);
    //             }
    //         });
    //     });
    // }


    // Abhi tak Id Unique The Ab Ticket Number Ho Gya Hai Isliye - Backward Compatibility
    getById(id) { return this.getByTicketNumber(id); }
    update(id, data) { return this.updateByTicketNumber(id, data); }
    delete(id) { return this.deleteByTicketNumber(id); }
}

module.exports = WtcModel;