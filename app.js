const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

// Import our custom middlewares and config
const compression = require('compression');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const cacheMiddleware = require('./middleware/cache');
const config = require('./config/appConfig');

// Import controllers and routes
const testController = require('./controllers/testController');
const apiRoutes = require('./routes');
const { addEmailJob } = require('./jobs/emailQueue');

const app = express();

/**
 * setupMiddleware
 * Configures the standard middleware pipeline for the application
 */
const setupMiddleware = (app) => {
    // 1. Response Compression
    app.use(compression());

    // 2. Security headers (Helmet)
    app.use(helmet());

    // 3. Global Rate Limiting (DDoS Protection)
    app.use(apiLimiter);

    // 4. Cross-Origin Resource Sharing (CORS)
    app.use(cors(config.corsOptions));

    // 5. Request Logging (Morgan for dev mode + Our custom logger)
    if (config.env === 'development') {
        app.use(morgan('dev'));
    }
    app.use(logger);

    // 6. Body Parsing
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
 * Background Job Route
 * POST /send-email
 */
app.post('/send-email', async (req, res, next) => {
    try {
        const { email, subject, message } = req.body;
        
        if (!email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: email, subject, or message'
            });
        }

        // Enqueue the job
        await addEmailJob({ email, subject, message });

        return res.status(202).json({
            success: true,
            message: 'Email job has been accepted and is being processed in the background.'
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Performance Testing Route
 * GET /api/data
 * Simulates a heavy database query or processing
 */
app.get('/api/data', cacheMiddleware(60), async (req, res) => {
    // Simulate heavy operation (2.5 seconds)
    console.log('🐢 Processing heavy operation...');
    await new Promise(resolve => setTimeout(resolve, 2500));

    return res.status(200).json({
        success: true,
        message: 'Heavy data fetched successfully',
        data: {
            items: ['Bitcoin', 'Ethereum', 'Cardano', 'Solana'],
            count: 4,
            fetchedAt: new Date().toISOString(),
            source: 'Database (Simulated)'
        }
    });
});

/**
 * Modular API Routes
 * All API routes are prefixed with /api/v1
 */
app.use('/api/v1', apiRoutes);

// Attach the Centralized Error Handler LAST
app.use(errorHandler);

module.exports = app;
