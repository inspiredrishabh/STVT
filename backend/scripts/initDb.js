/**
 * Database initialization script
 * Run with: npm run init-db
 */
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

});
