/**
 * Database initialization script
 * Run with: npm run init-db
 * this can be seperatly run to set up the database
 * or can be run with npm start
 * currenlty not used in production
 * but can be used to reset the database
 */
const sqlite3 = require('sqlite3').verbose();
const { join } = require('path');
const fs = require('fs');

// Ensure db directory exists
const dbDir = join(__dirname, '..', 'db');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Set up database path
const dbPath = join(dbDir, 'db.sqlite');

console.log(`📊 Setting up STVT Authentication Database at: ${dbPath}`);

// Initialize database
const db = new sqlite3.Database(dbPath);

// Create and populate database
db.serialize(() => {
    // Create users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT UNIQUE NOT NULL CHECK (role IN ('admin', 'master', 'operator')),
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO users (role, password)
        VALUES
            ('admin', '1234'),
            ('master', '5678'),
            ('operator', '9012')
    `);

});


module.exports = db;