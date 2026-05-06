/**
 * Custom Logger Middleware
 * This middleware tracks every incoming request and calculates the time it takes to respond.
 * It uses the 'finish' event to ensure we capture the timing accurately.
 */

const logger = (req, res, next) => {
    // Record the start time
    const start = Date.now();
    
    // Extract details from the request
    const { method, url } = req;
    const timestamp = new Date().toISOString();

    // Listen for the finish event on the response object
    res.on('finish', () => {
        // Calculate how long it took to process the request
        const duration = Date.now() - start;
        const status = res.statusCode;

        // Log the result in a clean, human-readable format
        // Example: [2024-03-20T10:00:00.000Z] GET /api/test - 200 (15ms)
        const logMessage = `[${timestamp}] ${method} ${url} - ${status} (${duration}ms)`;
        
        if (duration > 1000) {
            console.warn(`⚠️  SLOW REQUEST: ${logMessage}`);
        } else {
            console.log(logMessage);
        }
    });

    // Move to the next middleware in the pipeline
    next();
};

module.exports = logger;
