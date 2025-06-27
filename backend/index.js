import createApp from './app.js';
import { PORT } from './config/config.js';
import { db, initializeDatabase } from './config/db.js';

// Initialize the database
initializeDatabase();

// Create the express app
const app = createApp();

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');

    server.close(() => {
        console.log('✅ Server closed.');

        db.close((err) => {
            if (err) {
                console.error('❌ Error closing database:', err);
                process.exit(1);
            } else {
                console.log('✅ Database connection closed.');
                process.exit(0);
            }
        });
    });
});
