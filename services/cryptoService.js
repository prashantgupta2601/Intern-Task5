const axios = require('axios');
const NodeCache = require('node-cache');
const config = require('../config/appConfig');

/**
 * Crypto Service
 * Responsible for interacting with external Crypto APIs (CoinGecko)
 */

// Initialize cache with TTL from config
const cryptoCache = new NodeCache({ stdTTL: config.cacheTTL });

const BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Fetch current price of a coin
 * @param {string} coinId - The ID of the coin (e.g., 'bitcoin', 'ethereum')
 * @returns {Promise<Object>} - Price data
 */
exports.getCoinPrice = async (coinId) => {
    // 1. Check if the data exists in cache
    const cachedData = cryptoCache.get(coinId);
    if (cachedData) {
        console.log(`[CACHE] Returning cached data for: ${coinId}`);
        return cachedData;
    }

    try {
        console.log(`[API] Fetching fresh data from CoinGecko for: ${coinId}`);
        const response = await axios.get(`${BASE_URL}/simple/price`, {
            params: {
                ids: coinId,
                vs_currencies: 'usd',
                include_24hr_change: true
            }
        });

        // Check if the coin exists in the response
        if (!response.data[coinId]) {
            const error = new Error(`Coin with ID '${coinId}' not found`);
            error.statusCode = 404;
            throw error;
        }

        const result = {
            id: coinId,
            price: response.data[coinId].usd,
            change24h: response.data[coinId].usd_24h_change
        };

        // 2. Save to cache
        cryptoCache.set(coinId, result);

        return result;
    } catch (error) {
        // If it's already one of our custom errors, re-throw it
        if (error.statusCode) throw error;

        // Otherwise, wrap external API errors
        const apiError = new Error('External API failure');
        apiError.statusCode = error.response ? error.response.status : 503;
        throw apiError;
    }
};
