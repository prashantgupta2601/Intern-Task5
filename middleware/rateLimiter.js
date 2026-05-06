const rateLimit = require('express-rate-limit');

/**
 * createRateLimiter
 * Helper to create rate limiters with custom configurations
 * 
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} maxRequests - Maximum number of requests allowed in the window
 * @param {string} message - Custom error message
 */
const createRateLimiter = (windowMs, maxRequests, message) => {
    return rateLimit({
        windowMs,
        max: maxRequests,
        message: {
            success: false,
            error: {
                message,
                status: 429
            }
        },
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
};

// Global rate limiter: 100 requests per 15 minutes
exports.globalLimiter = createRateLimiter(
    15 * 60 * 1000,
    100,
    'Too many requests from this IP, please try again after 15 minutes'
);

// Crypto specific limiter: 20 requests per minute
exports.cryptoLimiter = createRateLimiter(
    1 * 60 * 1000,
    20,
    'Too many crypto price checks, please slow down'
);
