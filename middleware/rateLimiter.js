const rateLimit = require('express-rate-limit');

/**
 * Creates a rate limiter with custom config
 */
const createLimiter = (max, windowMinutes = 15, message = 'Too many requests, please try again later') => {
    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        max: max,
        message: {
            success: false,
            message: message,
            status: 429
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// 1. Global API Rate Limiter (General usage)
const apiLimiter = createLimiter(100, 15, "Too many requests, please try again later");

// 2. Auth Rate Limiter (More strict for security)
const authLimiter = createLimiter(20, 15, "Too many login attempts, please try again later");

module.exports = {
    apiLimiter,
    authLimiter
};
