const express = require('express');
const { login, verifyToken, logout, getPermissions } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Auth routes
router.post('/login', login);
router.get('/verify', authenticateToken, verifyToken);
router.post('/logout', authenticateToken, logout);
router.get('/permissions', authenticateToken, getPermissions);

module.exports = router;
