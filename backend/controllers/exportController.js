const ExcelJS = require('exceljs');
const { db } = require('../config/db');

// Function to get all table names in the database
const getAllTables = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.map(row => row.name));
            }
        });
    });
};

// Function to get all data from a specific table
const getTableData = (tableName) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM ${tableName}`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Function to get foreign key relationships
const getForeignKeyRelationships = () => {
    return new Promise((resolve, reject) => {
        // This query needs to be corrected to use the actual column names from pragma_foreign_key_list
        const sql = `SELECT m.name as table_name, p."table" as parent_table
                 FROM sqlite_master m
                 JOIN pragma_foreign_key_list(m.name) p
                 WHERE m.type='table'`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const relationships = {};
                rows.forEach(row => {
                    if (!relationships[row.parent_table]) {
                        relationships[row.parent_table] = [];
                    }
                    relationships[row.parent_table].push(row.table_name);
                });
                resolve(relationships);
            }
        });
    });
};

// Export database to Excel
exports.exportDatabase = async (req, res) => {
    try {
        // Create a new Excel workbook
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'STVT System';
        workbook.lastModifiedBy = 'STVT Export Tool';
        workbook.created = new Date();
        workbook.modified = new Date();

        // Get all tables
        const tables = await getAllTables();

        // Get foreign key relationships
        const relationships = await getForeignKeyRelationships();

        // Process main tables first (those that are referenced by foreign keys)
        const mainTables = Object.keys(relationships);
        const processedTables = new Set();

        // Process main tables first
        for (const tableName of mainTables) {
            if (processedTables.has(tableName)) continue;

            // Get data from the table
            const data = await getTableData(tableName);

            // Create a new worksheet
            const worksheet = workbook.addWorksheet(tableName);

            // Add headers if data exists
            if (data.length > 0) {
                const headers = Object.keys(data[0]);
                worksheet.addRow(headers);

                // Add data rows
                data.forEach(row => {
                    worksheet.addRow(Object.values(row));
                });

                // Format headers
                const headerRow = worksheet.getRow(1);
                headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0070C0' } };

                // Auto fit columns
                worksheet.columns.forEach(column => {
                    column.width = Math.max(15, Math.min(30, column.width || 15));
                });
            }

            processedTables.add(tableName);
        }

        // Process remaining tables
        for (const tableName of tables) {
            if (processedTables.has(tableName)) continue;

            // Get data from the table
            const data = await getTableData(tableName);

            // Create a new worksheet
            const worksheet = workbook.addWorksheet(tableName);

            // Add headers if data exists
            if (data.length > 0) {
                const headers = Object.keys(data[0]);
                worksheet.addRow(headers);

                // Add data rows
                data.forEach(row => {
                    worksheet.addRow(Object.values(row));
                });

                // Format headers
                const headerRow = worksheet.getRow(1);
                headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0070C0' } };

                // Auto fit columns
                worksheet.columns.forEach(column => {
                    column.width = Math.max(15, Math.min(30, column.width || 15));
                });
            }
        }

        // Write to buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Set headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=STVT_Database_${new Date().toISOString().slice(0, 10)}.xlsx`);

        // Send response
        res.send(Buffer.from(buffer));
    } catch (error) {
        console.error('Error exporting database:', error);
        res.status(500).json({ success: false, message: 'Failed to export database', error: error.message });
    }
};