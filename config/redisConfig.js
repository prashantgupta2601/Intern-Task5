const Redis = require('ioredis');
require('dotenv').config();

/**
 * Redis Connection Configuration
 * Reusable connection object for BullMQ and other services
 */

const redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null, // Required by BullMQ
};

// Create a reusable connection instance
const connection = new Redis(redisConfig);

connection.on('connect', () => {
    console.log(`📡 Connected to Redis at ${redisConfig.host}:${redisConfig.port}`);
});

connection.on('error', (error) => {
    console.error('❌ Redis Connection Error:', error.message);
});

module.exports = connection;
