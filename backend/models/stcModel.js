const sqlite3 = require("sqlite3").verbose();
const { db } = require("../config/db.js");

class StcModel {
  constructor() {
    this.tableName = "stc_candidates";
    this.createTable();
    this.addMissingColumns(); // Add this line
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
      marital_status TEXT,
      blood_group TEXT,

      permanent_address TEXT,
      current_address TEXT,
      phone_number TEXT,
      emergency_contact_number TEXT,
      email TEXT,
      
      date_of_appointment_in_railway TEXT,
      mode_of_appointment TEXT,
      designation TEXT,
      unit TEXT,
      working_under TEXT,
      hrms_id TEXT,
      pf_no_nps_ups TEXT,
      employee_number TEXT,
      previous_work_experience TEXT,
      
      highest_qualification TEXT,
      highest_degree TEXT,
      field_of_study TEXT,
      institution TEXT,
      college TEXT,
      grade_type TEXT,
      grade_value TEXT,
      
      hobbies TEXT,
      cultural_hobby TEXT,
      achievement TEXT,
      
      ticket_no TEXT UNIQUE NOT NULL,
      batch TEXT,
      date_of_joining_stc_wtc_non_railway TEXT,
      module_no TEXT,
      date_of_sparing TEXT,
      course_duration TEXT,
      resignation_status TEXT DEFAULT 'no',

      session1start TEXT DEFAULT NULL,
      session1end TEXT DEFAULT NULL,
      session2start TEXT DEFAULT NULL,
      session2end TEXT DEFAULT NULL,
      session3start TEXT DEFAULT NULL,
      session3end TEXT DEFAULT NULL,
      session4start TEXT DEFAULT NULL,
      session4end TEXT DEFAULT NULL,
      
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }

  addMissingColumns() {
    // This safely adds missing columns without breaking existing data
    const columnsToAdd = [
      { name: 'marital_status', type: 'TEXT' },
      { name: 'blood_group', type: 'TEXT' },
      { name: 'previous_work_experience', type: 'TEXT' },
      { name: 'highest_degree', type: 'TEXT' },
      { name: 'college', type: 'TEXT' },
      { name: 'hobbies', type: 'TEXT' },
      { name: 'cultural_hobby', type: 'TEXT' },
      { name: 'achievement', type: 'TEXT' },
    ];

    columnsToAdd.forEach(({ name, type }) => {
      // Check if column exists
      db.all(`PRAGMA table_info(${this.tableName})`, [], (err, columns) => {
        if (err) {
          console.error(`Error checking column ${name}:`, err);
          return;
        }

        const columnExists = columns.some(col => col.name === name);
        
        if (!columnExists) {
          // Add column if it doesn't exist
          db.run(`ALTER TABLE ${this.tableName} ADD COLUMN ${name} ${type}`, (alterErr) => {
            if (alterErr) {
              console.error(`Error adding column ${name}:`, alterErr);
            } else {
              console.log(`✅ Added missing column: ${name}`);
            }
          });
        }
      });
    });
  }

  create(candidateData) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO ${this.tableName} (
        picture, name, sex, father_name, mother_name, dob, category, pwd, 
        type_of_disability, nationality, marital_status, blood_group,
        permanent_address, current_address, phone_number, emergency_contact_number, 
        email, date_of_appointment_in_railway, mode_of_appointment, designation, 
        unit, working_under, hrms_id, pf_no_nps_ups, employee_number, 
        previous_work_experience, highest_qualification, highest_degree, 
        field_of_study, institution, college, grade_type, grade_value,
        hobbies, cultural_hobby, achievement,
        ticket_no, batch, date_of_joining_stc_wtc_non_railway, module_no, 
        date_of_sparing, course_duration, resignation_status,
        session1start, session1end, session2start, session2end, 
        session3start, session3end, session4start, session4end
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.run(
        sql,
        [
          // 1-12: Personal Info
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
          candidateData.marital_status,
          candidateData.blood_group,
          // 13-17: Contact
          candidateData.permanent_address,
          candidateData.current_address,
          candidateData.phone_number,
          candidateData.emergency_contact_number,
          candidateData.email,
          // 18-26: Professional
          candidateData.date_of_appointment_in_railway,
          candidateData.mode_of_appointment,
          candidateData.designation,
          candidateData.unit,
          candidateData.working_under,
          candidateData.hrms_id,
          candidateData.pf_no_nps_ups,
          candidateData.employee_number,
          candidateData.previous_work_experience,
          // 27-33: Education
          candidateData.highest_qualification,
          candidateData.highest_degree,
          candidateData.field_of_study,
          candidateData.institution,
          candidateData.college,
          candidateData.grade_type,
          candidateData.grade_value,
          // 34-36: Additional Info
          candidateData.hobbies,
          candidateData.cultural_hobby,
          candidateData.achievement,
          // 37-43: Course Info
          candidateData.ticket_no || candidateData.ticketNumber,
          candidateData.batch,
          candidateData.date_of_joining_stc_wtc_non_railway,
          candidateData.module_no,
          candidateData.date_of_sparing,
          candidateData.course_duration,
          candidateData.resignation_status || "no",
          // 44-51: Sessions (8 values)
          candidateData.session1start ?? null,
          candidateData.session1end ?? null,
          candidateData.session2start ?? null,
          candidateData.session2end ?? null,
          candidateData.session3start ?? null,
          candidateData.session3end ?? null,
          candidateData.session4start ?? null,
          candidateData.session4end ?? null,
        ], 
        function (err) {
          if (err) {
            console.error("Create error:", err);
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
          picture = ?, name = ?, sex = ?, father_name = ?, mother_name = ?, dob = ?, 
          category = ?, pwd = ?, type_of_disability = ?, nationality = ?, 
          marital_status = ?, blood_group = ?,
          permanent_address = ?, current_address = ?, phone_number = ?, 
          emergency_contact_number = ?, email = ?, date_of_appointment_in_railway = ?, 
          mode_of_appointment = ?, designation = ?, unit = ?, working_under = ?, 
          hrms_id = ?, pf_no_nps_ups = ?, employee_number = ?, previous_work_experience = ?,
          highest_qualification = ?, highest_degree = ?, field_of_study = ?, 
          institution = ?, college = ?, grade_type = ?, grade_value = ?,
          hobbies = ?, cultural_hobby = ?, achievement = ?,
          batch = ?, date_of_joining_stc_wtc_non_railway = ?, module_no = ?, 
          date_of_sparing = ?, course_duration = ?, resignation_status = ?,
          session1start = ?, session1end = ?, session2start = ?, session2end = ?,
          session3start = ?, session3end = ?, session4start = ?, session4end = ?, 
          ticket_no = ?,
          updated_at = CURRENT_TIMESTAMP 
          WHERE ticket_no = ?`;

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
          candidateData.marital_status,
          candidateData.blood_group,
          candidateData.permanent_address,
          candidateData.current_address,
          candidateData.phone_number,
          candidateData.emergency_contact_number,
          candidateData.email,
          candidateData.date_of_appointment_in_railway,
          candidateData.mode_of_appointment,
          candidateData.designation,
          candidateData.unit,
          candidateData.working_under,
          candidateData.hrms_id,
          candidateData.pf_no_nps_ups,
          candidateData.employee_number,
          candidateData.previous_work_experience,
          candidateData.highest_qualification,
          candidateData.highest_degree,
          candidateData.field_of_study,
          candidateData.institution,
          candidateData.college,
          candidateData.grade_type,
          candidateData.grade_value,
          candidateData.hobbies,
          candidateData.cultural_hobby,
          candidateData.achievement,
          candidateData.batch,
          candidateData.date_of_joining_stc_wtc_non_railway,
          candidateData.module_no,
          candidateData.date_of_sparing,
          candidateData.course_duration,
          candidateData.resignation_status || "no",
          candidateData.session1start ?? null,
          candidateData.session1end ?? null,
          candidateData.session2start ?? null,
          candidateData.session2end ?? null,
          candidateData.session3start ?? null,
          candidateData.session3end ?? null,
          candidateData.session4start ?? null,
          candidateData.session4end ?? null,
          candidateData.ticket_no || candidateData.ticketNumber,
          ticketNumber
        ],
        function (err) {
          if (err) {
            console.error("Update error:", err);
            reject(err);
          } else {
            resolve(this.changes > 0 ? { ticket_no: candidateData.ticket_no || candidateData.ticketNumber, ...candidateData } : null);
          }
        }
      );
    });
  }

  deleteByTicketNumber(ticketNumber) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM ${this.tableName} WHERE ticket_no = ?`;
      db.run(sql, [ticketNumber], function (err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }

  getAll() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${this.tableName} ORDER BY created_at DESC`;
      db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  getByModule(module) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${this.tableName} WHERE module_no = ? ORDER BY name ASC`;
      db.all(sql, [module], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  getByDesignation(designation) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${this.tableName} WHERE designation = ?`;
      db.all(sql, [designation], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  getByUnit(unit) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${this.tableName} WHERE unit = ?`;
      db.all(sql, [unit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

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

module.exports = StcModel;
