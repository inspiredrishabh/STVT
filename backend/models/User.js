const { db } = require('../config/db.js');
const { rolePermissions } = require('../config/config.js');
const bcrypt = require('bcrypt');

class User {
    // Verify user credentials with hashed password
    static async verify(role, password) {
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT * FROM users WHERE role = ?",
                [role],
                async (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (!row) {
                        resolve(null);
                        return;
                    }

                    try {
                        // Compare provided password with hashed password
                        const isValidPassword = await bcrypt.compare(password, row.password);

                        if (!isValidPassword) {
                            resolve(null);
                            return;
                        }

                        // Format user object with permissions
                        const user = {
                            id: row.id,
                            role: row.role,
                            permissions: rolePermissions[row.role] || []
                        };

                        resolve(user);
                    } catch (compareError) {
                        console.error('Password comparison error:', compareError);
                        reject(compareError);
                    }
                }
            );
        });
    }

    // Update user password (with hashing)
    static async updatePassword(role, newPassword) {
        return new Promise(async (resolve, reject) => {
            try {
                const hashedPassword = await bcrypt.hash(newPassword, 12);

                db.run(
                    "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE role = ?",
                    [hashedPassword, role],
                    function (err) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve({ changes: this.changes });
                    }
                );
            } catch (hashError) {
                reject(hashError);
            }
        });
    }
}

module.exports = User;