const redisClient = require('../config/redisClient');

// In-memory map to track inflight requests for cache stampede prevention
const inflightRequests = new Map();

/**
 * Cache Middleware
 * Intercepts the response to cache it in Redis
 * 
 * @param {number} defaultTtl - Default Time to live in seconds (default 60)
 */
const cacheMiddleware = (defaultTtl = 60) => async (req, res, next) => {
    // Generate a unique cache key based on the route and query parameters
    const key = `cache:${req.originalUrl || req.url}`;
    
    // Dynamic TTL: allow custom TTL per route via req.cacheTTL
    const ttl = req.cacheTTL || defaultTtl;

    try {
        // 1. Check if data exists in Redis
        const cachedData = await redisClient.get(key);

        if (cachedData) {
            // Enhanced logging for Step 3.12 (adding it now to be ready)
            console.log(`[REDIS CACHE] HIT: ${key}`);
            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log(`[REDIS CACHE] MISS: ${key}`);

        // 2. Prevent Cache Stampede
        // If a request for this key is already being processed, wait for it
        if (inflightRequests.has(key)) {
            console.log(`[STAMPEDE PREVENTION] Waiting for inflight request: ${key}`);
            try {
                const data = await inflightRequests.get(key);
                return res.status(200).json(data);
            } catch (err) {
                // If the inflight request failed, proceed to process normally
                console.error(`[STAMPEDE PREVENTION] Inflight request failed: ${err.message}`);
            }
        }

        // Create a new promise for this request to block others
        let resolveInflight;
        let rejectInflight;
        const inflightPromise = new Promise((resolve, reject) => {
            resolveInflight = resolve;
            rejectInflight = reject;
        });
        inflightRequests.set(key, inflightPromise);

        // Save the original json function
        const originalJson = res.json;

        // Override res.json
        res.json = (data) => {
            // Restore the original json function
            res.json = originalJson;

            // Store the response in Redis with TTL if it's a success response
            if (res.statusCode >= 200 && res.statusCode < 300) {
                redisClient.set(key, JSON.stringify(data), 'EX', ttl)
                    .catch(err => console.error(`[REDIS ERROR] Failed to set cache: ${err.message}`));
                
                // Resolve the inflight promise with the data
                resolveInflight(data);
            } else {
                // Reject if not a success status
                rejectInflight(new Error(`Request failed with status ${res.statusCode}`));
            }

            // Remove from inflight map
            inflightRequests.delete(key);

            // Send the response to the client
            return res.json(data);
        };

        next();
    } catch (error) {
        console.error('❌ Cache Middleware Error:', error.message);
        // Remove from inflight map on error
        inflightRequests.delete(key);
        next();
    }
};

module.exports = cacheMiddleware;
