const sqlite3 = require('sqlite3').verbose();
const { db } = require('../config/db');

const generateTicketNumber = async (designation, traineeType) => {
    console.log(`Generating ticket number for designation: ${designation} in ${traineeType}`);

    if (!traineeType) {
        return Promise.reject(new Error("Trainee type is required to generate a ticket number."));
    }

    // Convert designation to lowercase for the prefix
    const prefix = designation;
    const tableName = `${traineeType}_candidates`;

    // The table you need to query is 'stc_candidates', not the designation itself.
    // You need to find the last ticket number for the given designation.
    // Assuming ticket_no looks like "aje00001", "ase00002" etc.
    const query = `
        SELECT ticket_no
        FROM ${tableName}
        WHERE ticket_no LIKE ? || '%'
        ORDER BY ticket_no DESC
        LIMIT 1
    `;

    return new Promise((resolve, reject) => {
        db.get(query, [prefix], (err, row) => {
            if (err) {
                console.error(`Error fetching last ticket number for ${designation}:`, err.message);
                reject(err);
            } else {
                const lastTicketNumber = row ? row.ticket_no : null; // Use ticket_no
                const newTicketNumber = createNewTicketNumber(prefix, lastTicketNumber);
                console.log(`Generated new ticket number: ${newTicketNumber}`);
                resolve(newTicketNumber);
            }
        });
    });
};

const createNewTicketNumber = (prefix, lastTicketNumber) => {
    let newNumber = 1;
    if (lastTicketNumber) {
        // Assuming lastTicketNumber is like "prefixXXXXX" (e.g., "aje00001")
        // Extract the numeric part after the prefix
        const numericPart = lastTicketNumber.slice(prefix.length);
        const lastNumber = parseInt(numericPart, 10);
        if (!isNaN(lastNumber)) { // Ensure it's a valid number
            newNumber = lastNumber + 1;
        } else {
            console.warn(`Could not parse numeric part from last ticket number: ${lastTicketNumber}`);
            // Fallback to 1 if parsing fails
            newNumber = 1;
        }
    }
    return `${prefix}${String(newNumber).padStart(5, '0')}`;
};

module.exports = {
    generateTicketNumber,
};