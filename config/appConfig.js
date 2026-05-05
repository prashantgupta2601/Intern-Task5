/**
 * Centralized application configuration
 * Keeping settings in one place makes it easier to manage across environments
 */
require('dotenv').config();

const config = {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    corsOptions: {
        origin: '*', // In production, this should be restricted to specific domains
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204
    }
};

module.exports = config;
