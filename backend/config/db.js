const sqlite3 = require('sqlite3').verbose();
const { join } = require('path'); // Only join is needed from 'path'
const fs = require('fs');

const dbDir = join(__dirname, '..', 'db');
const uploadsDir = join(__dirname, '..', 'uploads');
const tempDir = join(uploadsDir, 'temp');

// Create directories if they don't exist
[dbDir, uploadsDir, tempDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Set up the full path for the SQLite database file
const dbPath = join(dbDir, 'db.sqlite');

// Create a new SQLite database instance
const db = new sqlite3.Database(dbPath)

// Function to set up the database schema (create tables if they don't exist)
const initializeDatabase = () => {
    // `db.serialize()` ensures that all subsequent `db.run()` calls are executed in sequence
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role TEXT UNIQUE NOT NULL CHECK (role IN ('admin', 'master', 'operator')),
                password TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating users table:', err.message);
            } else {
                console.log('Users table checked/created successfully. Initialized with default passwords');
            }
        });

        db.run(`
            INSERT OR IGNORE INTO users (role, password)
            VALUES
                ('admin', '1234'),
                ('master', '5678'),
                ('operator', '9012')
        `);

    });
};

module.exports = { db, initializeDatabase, dbPath };