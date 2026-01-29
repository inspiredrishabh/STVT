const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "db", "db.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Error connecting to database:", err);
    return;
  }
  console.log("✅ Connected to database");
});

console.log("\n🔄 Removing stream_in_btech and database columns from STC candidates table...\n");

// SQLite doesn't support DROP COLUMN directly, so we need to recreate the table
const recreateTable = () => {
  db.serialize(() => {
    // Step 1: Rename old table
    db.run("ALTER TABLE stc_candidates RENAME TO stc_candidates_old", (err) => {
      if (err) {
        console.error("❌ Error renaming table:", err);
        return;
      }
      console.log("✅ Renamed old table");

      // Step 2: Create new table without stream_in_btech and database
      const createTableSQL = `CREATE TABLE stc_candidates (
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
      )`;

      db.run(createTableSQL, (err) => {
        if (err) {
          console.error("❌ Error creating new table:", err);
          return;
        }
        console.log("✅ Created new table without stream_in_btech and database");

        // Step 3: Copy data from old table (excluding stream_in_btech and database)
        const copyDataSQL = `INSERT INTO stc_candidates 
          SELECT id, picture, name, sex, father_name, mother_name, dob, category, pwd,
                 type_of_disability, nationality, marital_status, blood_group,
                 permanent_address, current_address, phone_number, emergency_contact_number,
                 email, date_of_appointment_in_railway, mode_of_appointment, designation,
                 unit, working_under, hrms_id, pf_no_nps_ups, employee_number,
                 previous_work_experience, highest_qualification, highest_degree,
                 field_of_study, institution, college, grade_type, grade_value,
                 hobbies, cultural_hobby, achievement, ticket_no, batch,
                 date_of_joining_stc_wtc_non_railway, module_no, date_of_sparing,
                 course_duration, resignation_status, session1start, session1end,
                 session2start, session2end, session3start, session3end,
                 session4start, session4end, created_at, updated_at
          FROM stc_candidates_old`;

        db.run(copyDataSQL, (err) => {
          if (err) {
            console.error("❌ Error copying data:", err);
            return;
          }
          console.log("✅ Copied data to new table");

          // Step 4: Drop old table
          db.run("DROP TABLE stc_candidates_old", (err) => {
            if (err) {
              console.error("❌ Error dropping old table:", err);
              return;
            }
            console.log("✅ Dropped old table");

            // Verify new schema
            db.all("PRAGMA table_info(stc_candidates)", [], (err, rows) => {
              if (err) {
                console.error("❌ Error:", err);
              } else {
                console.log("\n📋 New Table Schema:");
                console.log("=".repeat(60));
                rows.forEach((row) => {
                  console.log(`${row.cid.toString().padStart(2)}. ${row.name.padEnd(35)} ${row.type}`);
                });
                console.log("=".repeat(60));
              }

              db.close((err) => {
                if (err) {
                  console.error("\n❌ Error closing database:", err);
                } else {
                  console.log("\n✅ Database connection closed");
                  console.log("\n🎉 Migration completed! Restart your backend server.\n");
                }
              });
            });
          });
        });
      });
    });
  });
};

recreateTable();