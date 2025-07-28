const sqlite3 = require('sqlite3').verbose();
const { join } = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

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
const db = new sqlite3.Database(dbPath);

// Function to hash passwords
const hashPassword = async (password) => {
    const saltRounds = 12; // Higher salt rounds for better security
    return await bcrypt.hash(password, saltRounds);
};

// Function to set up the database schema (create tables if they don't exist)
const initializeDatabase = async () => {
    return new Promise((resolve, reject) => {
        db.serialize(async () => {
            try {
                // Create users table
                db.run(`
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        role TEXT UNIQUE NOT NULL CHECK (role IN ('admin', 'master', 'operator')),
                        password TEXT NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `, async (err) => {
                    if (err) {
                        console.error('Error creating users table:', err.message);
                        reject(err);
                        return;
                    }

                    try {
                        // Check if users already exist
                        db.get('SELECT COUNT(*) as count FROM users', async (err, row) => {
                            if (err) {
                                console.error('Error checking users:', err.message);
                                reject(err);
                                return;
                            }

                            if (row.count === 0) {
                                // Hash default passwords
                                const adminHash = await hashPassword('admin123!');
                                const masterHash = await hashPassword('master123!');
                                const operatorHash = await hashPassword('operator123!');

                                // Insert default users with hashed passwords
                                db.run(`
                                    INSERT INTO users (role, password) VALUES 
                                    ('admin', ?),
                                    ('master', ?),
                                    ('operator', ?)
                                `, [adminHash, masterHash, operatorHash], (err) => {
                                    if (err) {
                                        console.error('Error inserting default users:', err.message);
                                        reject(err);
                                    } else {
                                        console.log('Users table initialized with hashed passwords');
                                        console.log('Default passwords:');
                                        console.log('- admin: admin123!');
                                        console.log('- master: master123!');
                                        console.log('- operator: operator123!');
                                        resolve();
                                    }
                                });
                            } else {
                                console.log('Users table already exists with data');
                                resolve();
                            }
                        });
                    } catch (hashError) {
                        console.error('Error hashing passwords:', hashError);
                        reject(hashError);
                    }
                });
            } catch (error) {
                console.error('Database initialization error:', error);
                reject(error);
            }
        });
    });
};

module.exports = { db, initializeDatabase, dbPath, hashPassword };