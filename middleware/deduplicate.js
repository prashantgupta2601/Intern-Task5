/**
 * Request Deduplication Middleware
 * Prevents multiple identical requests from being processed simultaneously.
 * If a second identical request arrives while the first is still processing,
 * it waits for the first one to finish and returns the same result.
 */

const pendingRequests = new Map();

const deduplicate = () => async (req, res, next) => {
    // Generate a unique key for the request
    // We use method, path, and stringified body to identify "identical" requests
    const key = `${req.method}:${req.originalUrl || req.url}:${JSON.stringify(req.body)}`;

    if (pendingRequests.has(key)) {
        console.log(`[DEDUPLICATE] Duplicate request detected, waiting: ${key}`);
        try {
            const result = await pendingRequests.get(key);
            return res.status(result.status).json(result.data);
        } catch (error) {
            // If the original request failed, we might want to let this one through
            // or return the same error. Here we let it through to be safe.
            console.error(`[DEDUPLICATE] Original request failed, retrying: ${error.message}`);
        }
    }

    // Capture the original json function
    const originalJson = res.json;
    
    // Create a promise to track this request
    let resolvePending;
    const pendingPromise = new Promise((resolve) => {
        resolvePending = resolve;
    });

    pendingRequests.set(key, pendingPromise);

    res.json = function(data) {
        // Resolve the promise so waiting requests can get the result
        resolvePending({
            status: res.statusCode,
            data: data
        });

        // Clean up
        pendingRequests.delete(key);

        return originalJson.call(this, data);
    };

    // Handle unexpected closures/errors
    res.on('finish', () => {
        if (pendingRequests.has(key)) {
            pendingRequests.delete(key);
        }
    });

    next();
};

module.exports = deduplicate;
