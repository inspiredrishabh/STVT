const fs = require('fs');
const path = require('path');
const moment = require('moment');

// Configuration
const DB_PATH = path.join(__dirname, '../db/db.sqlite');

// Choose one of these backup locations
// const BACKUP_DIR = '\\\\fileserver\\backups\\STVT'; // Network share (best)
// const BACKUP_DIR = 'D:\\Backups\\STVT';          // Secondary drive (good)
const BACKUP_DIR = 'C:\\STVT_Backups';           // Separate folder (basic)

const MAX_BACKUPS = 7; // Keep one week of daily backups

// Function to create backup
function createBackup() {
    try {
        // Create backup directory if it doesn't exist
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
        }

        // Generate backup filename with timestamp
        const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
        const backupFilename = `db_backup_${timestamp}.sqlite`;
        const backupPath = path.join(BACKUP_DIR, backupFilename);

        console.log(`Creating backup at ${backupPath}`);

        // Create backup using file copy
        fs.copyFileSync(DB_PATH, backupPath);

        console.log('Backup completed successfully!');

        // Rotate old backups
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(file => file.startsWith('db_backup_'))
            .sort();

        if (files.length > MAX_BACKUPS) {
            const filesToDelete = files.slice(0, files.length - MAX_BACKUPS);
            filesToDelete.forEach(file => {
                fs.unlinkSync(path.join(BACKUP_DIR, file));
                console.log(`Deleted old backup: ${file}`);
            });
        }

        return { success: true, message: 'Backup completed successfully' };
    } catch (err) {
        console.error('Backup failed:', err);
        return { success: false, error: err.message };
    }
}

// If run directly
if (require.main === module) {
    const result = createBackup();
    if (!result.success) {
        process.exit(1);
    }
}

// Export for use in other files
module.exports = { createBackup };