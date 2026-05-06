const rateLimit = require('express-rate-limit');

/**
 * Global Rate Limiter
 * 100 requests per 15 minutes per IP
 */
const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    message: {
        success: false,
        error: {
            message: 'Too many requests from this IP, please try again after 15 minutes',
            status: 429
        }
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

module.exports = globalRateLimiter;
