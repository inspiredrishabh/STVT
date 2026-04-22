// Server configuration
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Session configuration
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Role permissions
const rolePermissions = {
    admin: [
        // Candidate Management
        "add-candidate",
        "manage-candidates",

        // STC Features
        "stc-feed-marks",
        "stc-trainee-profile",
        "stc-line-training",
        "stc-marksheet",
        "stc-management",

        // WTC Features
        "wtc-feed-marks",
        "wtc-trainee-profile",
        "wtc-attendance",
        "wtc-letter",
        "wtc-certificate",
        "wtc-management",

        // Non-Railway Features
        "non-railway-management",

        // Forms
        "stc-form",
        "wtc-form",
        "non-railway-form",

        // Generic permissions - mapped to UI elements
        "feed-marks",     // Generic menu item
        "marksheets",     // Generic menu item
        "letters",        // Generic menu item
        "trainee-profile" // Generic menu item
    ],
    master: [
        // Candidate Management
        "add-candidate",
        "manage-candidates",

        // STC Features
        "stc-feed-marks",
        "stc-trainee-profile",
        "stc-line-training",
        "stc-management",

        // WTC Features
        "wtc-trainee-profile",
        "wtc-attendance",
        "wtc-management",

        // Forms (all candidate types)
        "stc-form",
        "wtc-form",
        "non-railway-form",

        // Generic permissions
        "feed-marks",
        "trainee-profile"
    ],
    operator: [
        // Limited Candidate Management
        "add-candidate",
        "manage-candidates",

        // Forms - basic data entry (all candidate types)
        "stc-form",
        "wtc-form",
        "non-railway-form",

        // View-only permissions
        "view-candidates",
        "view-marks",
        "view-attendance",
        "view-profiles"
    ]
};



module.exports = {
    PORT,
    CORS_ORIGIN,
    NODE_ENV,
    SESSION_EXPIRY,
    rolePermissions,
};
