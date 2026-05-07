const redisClient = require('../config/redisClient');

/**
 * Cache Invalidator Utility
 * Responsible for clearing Redis cache based on keys or patterns
 */
const cacheInvalidator = {
    /**
     * Delete a specific cache key
     * @param {string} key - The key to delete
     */
    async invalidateKey(key) {
        try {
            await redisClient.del(key);
            console.log(`[CACHE INVALIDATE] Deleted key: ${key}`);
        } catch (error) {
            console.error(`[CACHE INVALIDATE ERROR] Failed to delete key ${key}:`, error.message);
        }
    },

    /**
     * Delete cache keys matching a pattern
     * @param {string} pattern - The pattern to match (e.g., 'cache:/api/v1/products*')
     */
    async invalidatePattern(pattern) {
        try {
            // Redis SCAN is safer than KEYS in production
            let cursor = '0';
            let keysDeleted = 0;

            do {
                const [newCursor, keys] = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
                cursor = newCursor;

                if (keys.length > 0) {
                    await redisClient.del(...keys);
                    keysDeleted += keys.length;
                }
            } while (cursor !== '0');

            console.log(`[CACHE INVALIDATE] Pattern '${pattern}' cleared. Keys deleted: ${keysDeleted}`);
        } catch (error) {
            console.error(`[CACHE INVALIDATE ERROR] Failed to invalidate pattern ${pattern}:`, error.message);
        }
    }
};

module.exports = cacheInvalidator;
