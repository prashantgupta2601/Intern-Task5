const express = require('express');
const router = express.Router();
const Joi = require('joi');
const cryptoController = require('../controllers/cryptoController');
const rateLimiter = require('../middleware/rateLimiter');
const validate = require('../middleware/validator');

/**
 * Route Schemas
 */
const coinPriceSchema = Joi.object({
    id: Joi.string().alphanum().min(3).max(30).required()
});

/**
 * Route: /api/v1/crypto
 */

// Fetch price by coin ID
router.get('/price/:id', rateLimiter, validate(coinPriceSchema, 'params'), cryptoController.getPrice);

module.exports = router;
