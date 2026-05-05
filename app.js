const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

// Import our custom middlewares and config
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const config = require('./config/appConfig');

const app = express();

/**
 * setupMiddleware
 * Configures the standard middleware pipeline for the application
 */
const setupMiddleware = (app) => {
    // 1. Security headers (Helmet)
    app.use(helmet());

    // 2. Cross-Origin Resource Sharing (CORS)
    app.use(cors(config.corsOptions));

    // 3. Request Logging (Morgan for dev mode + Our custom logger)
    if (config.env === 'development') {
        app.use(morgan('dev'));
    }
    app.use(logger);

    // 4. Body Parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
};

// Initialize middleware
setupMiddleware(app);

/**
 * Standard Test Route
 */
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Advanced Middleware System API!',
        status: 'Server is running smoothly',
        timestamp: new Date().toISOString()
    });
});

/**
 * Route that triggers an error for testing our error handler
 */
app.get('/test-error', (req, res, next) => {
    const error = new Error('This is a simulated production error');
    error.statusCode = 400;
    next(error);
});

// Attach the Centralized Error Handler LAST
app.use(errorHandler);

module.exports = app;
