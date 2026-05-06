/**
 * API Response Utility
 * Ensures all success responses follow a standard structure
 */

const sendResponse = (res, statusCode, success, message, data = null) => {
    return res.status(statusCode).json({
        success,
        message,
        data
    });
};

/**
 * Success helper
 */
exports.success = (res, message, data = null, statusCode = 200) => {
    return sendResponse(res, statusCode, true, message, data);
};

/**
 * Error helper (Optional, since we have errorHandler, 
 * but useful for specific manual error returns)
 */
exports.error = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        error: {
            message,
            status: statusCode
        }
    });
};
