const redisClient = require('../config/redisClient');

/**
 * Cache Middleware
 * intercepting the response to cache it in Redis
 * 
 * @param {number} ttl - Time to live in seconds (default 60)
 */
const cacheMiddleware = (ttl = 60) => async (req, res, next) => {
    // Generate a unique cache key based on the route and parameters
    const key = `cache:${req.originalUrl || req.url}`;

    try {
        // 1. Check if data exists in Redis
        const cachedData = await redisClient.get(key);

        if (cachedData) {
            console.log(`[REDIS CACHE] Hit: ${key}`);
            return res.status(200).json(JSON.parse(cachedData));
        }

        // 2. If not, capture the original res.json to store the data later
        console.log(`[REDIS CACHE] Miss: ${key}`);
        
        // Save the original json function
        const originalJson = res.json;

        // Override res.json
        res.json = (data) => {
            // Restore the original json function
            res.json = originalJson;

            // Store the response in Redis with TTL
            // We only cache success responses
            if (res.statusCode >= 200 && res.statusCode < 300) {
                redisClient.set(key, JSON.stringify(data), 'EX', ttl);
            }

            // Send the response to the client
            return res.json(data);
        };

        next();
    } catch (error) {
        console.error('❌ Cache Middleware Error:', error.message);
        // On cache error, we just continue to the controller
        next();
    }
};

module.exports = cacheMiddleware;
