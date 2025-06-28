import { getSessionCount } from '../src/utils/session.js';
import { dbPath } from '../config/db.js';

// Health check controller
const healthCheck = (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: dbPath,
        sessions: getSessionCount()
    });
};

export { healthCheck };
