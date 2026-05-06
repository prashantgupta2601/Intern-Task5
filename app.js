const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

// Import our custom middlewares and config
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { globalLimiter } = require('./middleware/rateLimiter');
const config = require('./config/appConfig');

// Import controllers and routes
const testController = require('./controllers/testController');
const apiRoutes = require('./routes');

const app = express();

/**
 * setupMiddleware
 * Configures the standard middleware pipeline for the application
 */
const setupMiddleware = (app) => {
    // 1. Security headers (Helmet)
    app.use(helmet());

    // 2. Rate Limiting
    app.use(globalLimiter);

    // 3. Cross-Origin Resource Sharing (CORS)
    app.use(cors(config.corsOptions));

    // 4. Request Logging (Morgan for dev mode + Our custom logger)
    if (config.env === 'development') {
        app.use(morgan('dev'));
    }
    app.use(logger);

    // 5. Body Parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
};

// Initialize middleware
setupMiddleware(app);

/**
 * Base Routes
 */
app.get('/', testController.getWelcomeMessage);

/**
 * Modular API Routes
 * All API routes are prefixed with /api/v1
 */
app.use('/api/v1', apiRoutes);

// Attach the Centralized Error Handler LAST
app.use(errorHandler);

module.exports = app;
