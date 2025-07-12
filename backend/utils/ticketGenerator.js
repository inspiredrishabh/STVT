const sqlite3 = require('sqlite3').verbose();
const { db } = require('../config/db');

// Mutex to prevent race conditions in ticket generation
let ticketGenerationQueue = [];
let isProcessing = false;
// Track highest generated numbers per prefix to avoid duplicates
let generatedNumbers = {};

// Helper function to create an acronym from a phrase
const createAcronym = (phrase) => {
    if (!phrase || typeof phrase !== 'string') {
        return 'TKT'; // Return a default prefix if phrase is invalid
    }
    // Words to ignore when creating the acronym
    const ignoreWords = ['for', 'of', 'in', 'a', 'an', 'the'];
    return phrase
        .split(' ')
        .filter(word => !ignoreWords.includes(word.toLowerCase()))
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase();
};

const generateTicketNumber = async (designation, traineeType) => {
    return new Promise((resolve, reject) => {
        console.log(`Queuing ticket generation for designation: ${designation} in ${traineeType}`);

        if (!traineeType) {
            reject(new Error("Trainee type is required to generate a ticket number."));
            return;
        }

        // Add to queue
        ticketGenerationQueue.push({
            designation,
            traineeType,
            resolve,
            reject
        });

        // Process queue if not already processing
        if (!isProcessing) {
            processTicketQueue();
        }
    });
};

const processTicketQueue = async () => {
    if (isProcessing || ticketGenerationQueue.length === 0) {
        return;
    }

    isProcessing = true;

    while (ticketGenerationQueue.length > 0) {
        const { designation, traineeType, resolve, reject } = ticketGenerationQueue.shift();
        
        try {
            const ticketNumber = await generateTicketNumberInternal(designation, traineeType);
            resolve(ticketNumber);
        } catch (error) {
            reject(error);
        }
    }

    isProcessing = false;
};

const generateTicketNumberInternal = async (designation, traineeType) => {
    return new Promise((resolve, reject) => {
        console.log(`Generating ticket number for designation: ${designation} in ${traineeType}`);
        
        // For STC candidates, use designation directly as prefix
        // For other trainee types, create acronym from designation
        const prefix = traineeType === 'stc' ? designation.toUpperCase() : createAcronym(designation);
        const tableName = `${traineeType}_candidates`;
        const prefixKey = `${traineeType}_${prefix.toLowerCase()}`;

        // Simple query to get all tickets for this prefix, then find the max
        const query = `
            SELECT ticket_no
            FROM ${tableName}
            WHERE LOWER(ticket_no) LIKE LOWER(?) || '%'
            ORDER BY ticket_no
        `;

        db.all(query, [`${prefix}`], (err, rows) => {
            if (err) {
                console.error(`Error fetching ticket numbers for ${designation}:`, err.message);
                reject(err);
                return;
            }

            let maxNumber = 0;
            const prefixLower = prefix.toLowerCase();

            // Find the highest number for this exact prefix
            if (rows && rows.length > 0) {
                rows.forEach(row => {
                    const ticket = row.ticket_no;
                    const ticketLower = ticket.toLowerCase();
                    
                    // Check if ticket starts with our prefix (case-insensitive)
                    if (ticketLower.startsWith(prefixLower)) {
                        const numericPart = ticket.slice(prefix.length);
                        const number = parseInt(numericPart, 10);
                        
                        if (!isNaN(number) && number > maxNumber) {
                            maxNumber = number;
                        }
                    }
                });
            }

            // Check if we've generated any numbers for this prefix in this session
            if (generatedNumbers[prefixKey] && generatedNumbers[prefixKey] > maxNumber) {
                maxNumber = generatedNumbers[prefixKey];
            }

            const newNumber = maxNumber + 1;
            const newTicketNumber = `${prefix}${String(newNumber).padStart(5, '0')}`;
            
            // Track this generated number
            generatedNumbers[prefixKey] = newNumber;
            
            console.log(`Generated new ticket number: ${newTicketNumber} (prefix: ${prefix}, max found: ${maxNumber}, session max: ${generatedNumbers[prefixKey]})`);
            resolve(newTicketNumber);
        });
    });
};

module.exports = {
    generateTicketNumber,
};