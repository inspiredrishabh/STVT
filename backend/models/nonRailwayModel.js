const sqlite3 = require("sqlite3").verbose();
const { db } = require("../config/db.js");

class NonRailwayModel {
  constructor() {
    this.tableName = "nonrailway_candidates";
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
            permanent_address TEXT,
            current_address TEXT,
            phone_number TEXT,
            emergency_contact_number TEXT,
            email TEXT,

            -- Professional Information (for non-railway, some fields might be null)
            course_type TEXT,
            designation TEXT,
            unit TEXT,
            duration TEXT,
            theory TEXT,
            practical TEXT,
            working_under TEXT,
            remarks TEXT,

            -- Education Information
            highest_qualification TEXT,
            field_of_study TEXT,
            institution TEXT,
            grade_type TEXT,
            grade_value TEXT,
            
            -- Course Information
            ticket_no TEXT UNIQUE NOT NULL,  -- Main unique identifier
            batch TEXT,
            date_of_joining_stc_wtc_non_railway TEXT,
            module_no TEXT,
            date_of_sparing TEXT,
            course_coordinator TEXT,

            -- System fields
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
  }

  create(candidateData) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO ${this.tableName} (
                picture, name, sex, father_name, mother_name, dob, category, pwd, 
                type_of_disability, nationality, permanent_address, current_address, 
                phone_number, emergency_contact_number, email, course_type, designation, 
                unit, duration, theory, practical, working_under, remarks, 
                highest_qualification, field_of_study, institution, grade_type, 
                grade_value, ticket_no, batch, date_of_joining_stc_wtc_non_railway, 
                module_no, date_of_sparing
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.run(
        sql,
        [
          candidateData.picture || candidateData.imagePath,
          candidateData.name,
          candidateData.sex,
          candidateData.father_name,
          candidateData.mother_name,
          candidateData.dob,
          candidateData.category,
          candidateData.pwd,
          candidateData.type_of_disability,
          candidateData.nationality || "INDIAN",
          candidateData.permanent_address,
          candidateData.current_address,
          candidateData.phone_number,
          candidateData.emergency_contact_number,
          candidateData.email,
          candidateData.course_type,
          candidateData.designation,
          candidateData.unit,
          candidateData.duration,
          candidateData.theory,
          candidateData.practical,
          candidateData.working_under,
          candidateData.remarks,
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
        ],
        function (err) {
          if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
              reject(new Error("Ticket number already exists"));
            } else {
              reject(err);
            }
          } else {
            resolve({
              id: this.lastID,
              ticket_no: candidateData.ticket_no || candidateData.ticketNumber,
              ...candidateData,
            });
          }
        }
      );
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
                emergency_contact_number = ?, email = ?, course_type = ?, designation = ?, 
                unit = ?, duration = ?, theory = ?, practical = ?, working_under = ?, 
                remarks = ?, highest_qualification = ?, field_of_study = ?, institution = ?, 
                grade_type = ?, grade_value = ?, batch = ?, 
                date_of_joining_stc_wtc_non_railway = ?, module_no = ?, date_of_sparing = ?, 
                ticket_no = ?,  -- allow ticket_no to be updated
                updated_at = CURRENT_TIMESTAMP WHERE ticket_no = ?`;

      db.run(
        sql,
        [
          candidateData.picture || candidateData.imagePath,
          candidateData.name,
          candidateData.sex,
          candidateData.father_name,
          candidateData.mother_name,
          candidateData.dob,
          candidateData.category,
          candidateData.pwd,
          candidateData.type_of_disability,
          candidateData.nationality || "INDIAN",
          candidateData.permanent_address,
          candidateData.current_address,
          candidateData.phone_number,
          candidateData.emergency_contact_number,
          candidateData.email,
          candidateData.course_type,
          candidateData.designation,
          candidateData.unit,
          candidateData.duration,
          candidateData.theory,
          candidateData.practical,
          candidateData.working_under,
          candidateData.remarks,
          candidateData.highest_qualification,
          candidateData.field_of_study,
          candidateData.institution,
          candidateData.grade_type,
          candidateData.grade_value,
          candidateData.batch,
          candidateData.date_of_joining_stc_wtc_non_railway,
          candidateData.module_no,
          candidateData.date_of_sparing,
          candidateData.ticket_no || candidateData.ticketNumber, // new ticket_no value
          ticketNumber, // old ticket_no for WHERE clause
        ],
        function (err) {
          if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
              reject(new Error("Ticket number already exists"));
            } else {
              reject(err);
            }
          } else {
            resolve(
              this.changes > 0
                ? {
                    ticket_no:
                      candidateData.ticket_no || candidateData.ticketNumber,
                    ...candidateData,
                  }
                : null
            );
          }
        }
      );
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

  // NonRailway specific methods
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

  // getByDuration(duration) {
  //     return new Promise((resolve, reject) => {
  //         const sql = `SELECT * FROM ${this.tableName} WHERE duration = ?`;
  //         db.all(sql, [duration], (err, rows) => {
  //             if (err) {
  //                 reject(err);
  //             } else {
  //                 resolve(rows);
  //             }
  //         });
  //     });
  // }

  // getByTheory(theory) {
  //     return new Promise((resolve, reject) => {
  //         const sql = `SELECT * FROM ${this.tableName} WHERE theory = ?`;
  //         db.all(sql, [theory], (err, rows) => {
  //             if (err) {
  //                 reject(err);
  //             } else {
  //                 resolve(rows);
  //             }
  //         });
  //     });
  // }

  // getByPractical(practical) {
  //     return new Promise((resolve, reject) => {
  //         const sql = `SELECT * FROM ${this.tableName} WHERE practical = ?`;
  //         db.all(sql, [practical], (err, rows) => {
  //             if (err) {
  //                 reject(err);
  //             } else {
  //                 resolve(rows);
  //             }
  //         });
  //     });
  // }

  // searchByRemarks(keyword) {
  //     return new Promise((resolve, reject) => {
  //         const sql = `SELECT * FROM ${this.tableName} WHERE remarks LIKE ?`;
  //         db.all(sql, [`%${keyword}%`], (err, rows) => {
  //             if (err) {
  //                 reject(err);
  //             } else {
  //                 resolve(rows);
  //             }
  //         });
  //     });
  // }

  // // Get candidates with theory and practical details
  // getTrainingDetails() {
  //     return new Promise((resolve, reject) => {
  //         const sql = `SELECT id, name, ticket_no, course_type, duration, theory, practical, remarks FROM ${this.tableName} ORDER BY created_at DESC`;
  //         db.all(sql, [], (err, rows) => {
  //             if (err) {
  //                 reject(err);
  //             } else {
  //                 resolve(rows);
  //             }
  //         });
  //     });
  // }

  // Get candidates by unit
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

  // Abhi tak Id Unique The Ab Ticket Number Ho Gya Hai Isliye - Backward Compatibility
  getById(id) {
    return this.getByTicketNumber(id);
  }
  update(id, data) {
    return this.updateByTicketNumber(id, data);
  }
  delete(id) {
    return this.deleteByTicketNumber(id);
  }
}

module.exports = NonRailwayModel;
