const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const http = require('http');
const setupWebSocket = require('./websocket');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');

// Load environment variables from the root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const server = http.createServer(app);

const corsOptions = {
    origin: process.env.CORS_ORIGIN, // Allow only this origin
    optionsSuccessStatus: 200, // For legacy browser support
};

// Global rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter); // Apply rate limiting to all requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/api', authRoutes);

setupWebSocket(server);

// Serve static files in production
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Catchall handler in production
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

if (process.env.NODE_ENV !== 'test') {
    // Connect to MongoDB
    mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('Could not connect to MongoDB', err));

    // Start the server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = { app, server };
