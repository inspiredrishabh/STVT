const readline = require('readline');
const { db } = require('../config/db');
const bcrypt = require('bcrypt');

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

// Helper function to update a user's password with hashing
const updateUserPassword = async (role, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        return new Promise((resolve, reject) => {
            db.run('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE role = ?',
                [hashedPassword, role],
                function (err) {
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
    } catch (error) {
        throw new Error(`Error hashing password for ${role}: ${error.message}`);
    }
};

const changePasswords = async () => {
    try {
        const adminPassword = await askQuestion('Enter current admin password to verify: ');

        // 1. Verify Admin with hashed password
        const adminUser = await new Promise((resolve, reject) => {
            db.get('SELECT password FROM users WHERE role = ?', ['admin'], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });

        if (!adminUser) {
            throw new Error('Admin user not found in the database.');
        }

        // Compare with hashed password
        const isValidAdmin = await bcrypt.compare(adminPassword, adminUser.password);
        if (!isValidAdmin) {
            throw new Error('Admin verification failed. Incorrect password.');
        }

        console.log('Admin verified successfully.');

        // 2. Get new passwords
        const newAdminPassword = await askQuestion('Enter new password for admin: ');
        const newMasterPassword = await askQuestion('Enter new password for master: ');
        const newOperatorPassword = await askQuestion('Enter new password for operator: ');

        // Validate password strength
        const validatePassword = (password, role) => {
            if (password.length < 8) {
                throw new Error(`Password for ${role} must be at least 8 characters long`);
            }
            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
                throw new Error(`Password for ${role} must contain at least one uppercase letter, one lowercase letter, and one number`);
            }
        };

        validatePassword(newAdminPassword, 'admin');
        validatePassword(newMasterPassword, 'master');
        validatePassword(newOperatorPassword, 'operator');

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