const cacheInvalidator = require('../utils/cacheInvalidator');

/**
 * Auto Cache Invalidator Middleware
 * Automatically invalidates cache patterns when data is modified
 * 
 * @param {string} pattern - Optional pattern to invalidate. If not provided, it derives from the request path.
 */
const autoInvalidate = (pattern = null) => async (req, res, next) => {
    // Only intercept data-modifying methods
    const methodsToIntercept = ['POST', 'PUT', 'PATCH', 'DELETE'];
    
    if (!methodsToIntercept.includes(req.method)) {
        return next();
    }

    // Save original json function
    const originalJson = res.json;

    res.json = function(data) {
        // Only invalidate if the request was successful
        if (res.statusCode >= 200 && res.statusCode < 300) {
            // Derive pattern if not provided: 'cache:/api/v1/resource*'
            const invalidationPattern = pattern || `cache:${req.baseUrl || req.path}*`;
            
            // Fire and forget invalidation (don't block the response)
            cacheInvalidator.invalidatePattern(invalidationPattern)
                .catch(err => console.error(`[AUTO-INVALIDATE ERROR] ${err.message}`));
        }

        return originalJson.call(this, data);
    };

    next();
};

module.exports = autoInvalidate;
