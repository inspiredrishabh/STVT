const readline = require('readline');
const { db } = require('../config/db');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Helper function to ask questions in the terminal
const askQuestion = (query) => {
    return new Promise(resolve => rl.question(query, ans => {
        resolve(ans);
    }));
};

// Helper function to update a user's password with plain text
const updateUserPassword = (role, password) => {
    return new Promise((resolve, reject) => {
        // Directly update the password with the plain text input
        db.run('UPDATE users SET password = ? WHERE role = ?', [password, role], function (err) {
            if (err) {
                return reject(new Error(`Error updating password for ${role}: ${err.message}`));
            }
            if (this.changes === 0) {
                console.warn(`Warning: Role '${role}' not found. No password updated.`);
            } else {
                console.log(`Password for '${role}' updated successfully.`);
            }
            resolve();
        });
    });
};

const changePasswords = async () => {
    try {
        const adminPassword = await askQuestion('Enter current admin password to verify: ');

        // 1. Verify Admin
        const adminUser = await new Promise((resolve, reject) => {
            db.get('SELECT password FROM users WHERE role = ?', ['admin'], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });

        if (!adminUser) {
            throw new Error('Admin user not found in the database.');
        }

        // Simple string comparison for verification
        if (adminPassword !== adminUser.password) {
            throw new Error('Admin verification failed. Incorrect password.');
        }

        console.log('Admin verified successfully.');

        // 2. Get new passwords
        const newAdminPassword = await askQuestion('Enter new password for admin: ');
        const newMasterPassword = await askQuestion('Enter new password for master: ');
        const newOperatorPassword = await askQuestion('Enter new password for operator: ');

        // 3. Update passwords
        await updateUserPassword('admin', newAdminPassword);
        await updateUserPassword('master', newMasterPassword);
        await updateUserPassword('operator', newOperatorPassword);

        console.log('\nAll passwords updated successfully.');
    } catch (error) {
        console.error('Error changing passwords:', error.message);
    } finally {
        rl.close();
    }
};

changePasswords();
