const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { db } = require('../config/db');

// Initialize the database with the monthly_attendances table
async function initMonthlyAttendanceDb() {
    console.log('Initializing monthly attendance database...');

    return new Promise((resolve, reject) => {
        // Create monthly_attendances table
        db.run(`
            CREATE TABLE IF NOT EXISTS monthly_attendances (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                candidate_id INTEGER NOT NULL,
                ticket_no TEXT NOT NULL,
                month TEXT NOT NULL,  -- Format: YYYY-MM
                total_classes INTEGER DEFAULT 0,
                classes_attended INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (candidate_id) REFERENCES wtc_candidates(id) ON DELETE CASCADE,
                UNIQUE(candidate_id, month)
            )
        `, (err) => {
            if (err) {
                console.error('Error creating monthly_attendances table:', err);
                return reject(err);
            }
            
            console.log('Monthly attendances table created or already exists');
            resolve();
        });
    });
}

// Run the initialization
initMonthlyAttendanceDb()
    .then(() => {
        console.log('Monthly attendance database initialized successfully');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Error initializing monthly attendance database:', err);
        process.exit(1);
    });
