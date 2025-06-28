import { SESSION_EXPIRY } from '../config/config.js';

// Session storage (in-memory for simplicity)
const sessions = new Map();

// Helper function to generate session token
const generateSessionToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Create a new session
const createSession = (user) => {
    const token = generateSessionToken();
    const expires = Date.now() + SESSION_EXPIRY;

    // Store session
    sessions.set(token, { user, expires });

    return { token, expires };
};

// Remove a session
const removeSession = (token) => {
    if (sessions.has(token)) {
        sessions.delete(token);
        return true;
    }
    return false;
};

// Get session information
const getSession = (token) => {
    return sessions.get(token);
};

// Get total active session count
const getSessionCount = () => {
    return sessions.size;
};

export {
    sessions,
    generateSessionToken,
    createSession,
    removeSession,
    getSession,
    getSessionCount
};
