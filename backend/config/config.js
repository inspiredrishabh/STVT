// Server configuration
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Session configuration
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Role permissions
const rolePermissions = {
    admin: ["add-candidate", "manage-candidates", "feed-marks", "marksheets", "id-cards", "letters"],
    master: ["add-candidate", "manage-candidates", "feed-marks"],
    operator: ["add-candidate", "manage-candidates"]
};

export {
    PORT,
    CORS_ORIGIN,
    NODE_ENV,
    SESSION_EXPIRY,
    rolePermissions
};
