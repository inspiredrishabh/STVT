const User = require('../models/User');
const { createSession, removeSession } = require('../utils/session');

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
        const session = createSession(user);

        res.json({
            success: true,
            message: 'Login successful',
            token: session.token,
            expires: session.expires,
            user: {
                role: user.role,
                name: user.name,
                permissions: user.permissions
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
};

// Verify token controller
const verifyToken = (req, res) => {
    // If middleware passes, token is valid
    res.json({
        message: 'Token is valid',
        user: {
            role: req.user.role,
            name: req.user.name,
            permissions: req.user.permissions
        }
    });
};

// Logout controller
const logout = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        removeSession(token);
    }

    res.json({ message: 'Logout successful' });
};

// Get permissions controller
const getPermissions = (req, res) => {
    res.json({
        permissions: req.user.permissions
    });
};

module.exports = {
    login,
    verifyToken,
    logout,
    getPermissions
};
