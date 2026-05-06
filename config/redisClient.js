const Redis = require('ioredis');
require('dotenv').config();

/**
 * Redis Client Configuration
 * Optimized for performance and stability
 */

const redisClient = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    retryStrategy: (times) => {
        // Exponential backoff for connection retries
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redisClient.on('connect', () => {
    console.log('🚀 Redis Client Connected');
});

redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error:', err.message);
});

module.exports = redisClient;
