/**
 * Centralized Error Handling Middleware
 * This catches all errors passed down the middleware chain.
 * Instead of letting the server crash, we return a structured JSON response.
 */

const errorHandler = (err, req, res, next) => {
    // Log the error for the developer (in a real app, you might use a service like Sentry)
    console.error(`[ERROR] ${err.message}`);
    if (err.stack) {
        // We only log the stack trace in development mode usually, 
        // but for this task we'll keep it simple.
        console.error(err.stack);
    }

    // Determine the status code - default to 500 (Internal Server Error)
    const statusCode = err.statusCode || 500;
    
    // Send a clean JSON response to the client
    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message || 'Internal Server Error',
            // Only show detailed errors in development
            status: statusCode
        }
    });
};

module.exports = errorHandler;
