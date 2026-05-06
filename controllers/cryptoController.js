const cryptoService = require('../services/cryptoService');
const apiResponse = require('../utils/apiResponse');

/**
 * @desc    Get current price of a coin
 * @route   GET /api/v1/crypto/price/:id
 * @access  Public
 */
exports.getPrice = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await cryptoService.getCoinPrice(id);
        
        return apiResponse.success(res, `Current price of ${id}`, data);
    } catch (error) {
        // Pass the error to the centralized error handler
        next(error);
    }
};
