import express from 'express';
import { login, verifyToken, logout, getPermissions } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/login', login);
router.get('/verify', authenticateToken, verifyToken);
router.post('/logout', authenticateToken, logout);
router.get('/permissions', authenticateToken, getPermissions);

export default router;
