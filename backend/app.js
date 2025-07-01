import express from 'express';
import cors from 'cors';
import { CORS_ORIGIN } from './config/config.js';
import authRoutes from './routes/authRoutes.js';

const createApp = () => {
    const app = express();

    // Middleware
    app.use(cors({
        origin: CORS_ORIGIN,
        credentials: true
    }));
    app.use(express.json());

    // Routes
    app.use('/api/auth', authRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ message: 'Something went wrong!' });
    });

    return app;
};

export default createApp;
