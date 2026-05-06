const express = require('express');
const router = express.Router();

// Import individual route modules
const testRoutes = require('./testRoutes');
const cryptoRoutes = require('./cryptoRoutes');

/**
 * Main API Router
 * We prefix all routes here with their respective module paths
 */

// Test Routes - /api/v1/test
router.use('/test', testRoutes);

// Crypto Routes - /api/v1/crypto
router.use('/crypto', cryptoRoutes);

module.exports = router;
