import User from '../models/User.js';
import { createSession, removeSession } from '../utils/session.js';

// Login controller
const login = async (req, res) => {
    try {
        const { role, password } = req.body;

        if (!role || !password) {
            return res.status(400).json({ message: 'Role and password are required' });
        }

        // Check if role is valid
        if (!['admin', 'master', 'operator'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Verify user credentials
        const user = await User.verify(role, password);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create session
        const { token } = createSession(user);

        // Return success response
        res.json({
            success: true,
            token,
            user
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Verify token controller
const verifyToken = (req, res) => {
    // Authentication middleware already validated the token
    // Just return the user info
    res.json({
        success: true,
        user: req.user
    });
};

// Logout controller
const logout = (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            removeSession(token);
        }

        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get user permissions
const getPermissions = (req, res) => {
    try {
        res.json({
            role: req.user.role,
            permissions: req.user.permissions
        });
    } catch (error) {
        console.error('Get permissions error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export {
    login,
    verifyToken,
    logout,
    getPermissions
};
