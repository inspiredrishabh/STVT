// const sqlite3 = require('sqlite3').verbose();
// const path = require('path');

// // Connect to the SQLite database
// const dbPath = path.resolve(__dirname, '../../database/trainee.db');
// const db = new sqlite3.Database(dbPath, (err) => {
//     if (err) {
//         console.error('Error opening database ' + err.message);
//     } else {
//         console.log('Connected to the SQLite database.');
//     }
// });

// // Enable foreign key constraints
// db.run("PRAGMA foreign_keys = ON");

// // Graceful shutdown
// process.on('SIGINT', () => {
//     db.close((err) => {
//         if (err) {
//             console.error('Error closing database:', err.message);
//         } else {
//             console.log('Database connection closed.');
//         }
//         process.exit(0);
//     });
// });

// module.exports = db;    