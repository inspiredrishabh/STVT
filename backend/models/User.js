const  { db } = require ('../config/db.js');
const  { rolePermissions } = require ('../config/config.js');

class User {
    // Verify user credentials
    static async verify(role, password) {
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT * FROM users WHERE role = ? AND password = ?",
                [role, password],
                (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (!row) {
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
                }
            );
        });
    }

}

module.exports= User;
