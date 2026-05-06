const apiResponse = require('../utils/apiResponse');

/**
 * @desc    Welcome route
 * @route   GET /
 * @access  Public
 */
exports.getWelcomeMessage = (req, res) => {
    return apiResponse.success(res, 'Welcome to the Advanced Middleware System API!', {
        status: 'Server is running smoothly',
        timestamp: new Date().toISOString()
    });
};

/**
 * @desc    Echo message back to user
 * @route   POST /api/v1/test/echo
 * @access  Public
 */
exports.echoMessage = (req, res) => {
    const { message } = req.body;
    return apiResponse.success(res, 'Message received successfully', {
        echo: message,
        processedAt: new Date().toISOString()
    });
};

/**
 * @desc    Test error handling
 * @route   GET /api/v1/test/error
 * @access  Public
 */
exports.triggerTestError = (req, res, next) => {
    const error = new Error('This is a simulated production error');
    error.statusCode = 400;
    next(error);
};
