const express = require('express');
const router = express.Router();
const Joi = require('joi');
const testController = require('../controllers/testController');
const validate = require('../middleware/validator');

/**
 * Route Schemas
 */
const echoSchema = Joi.object({
    message: Joi.string().min(1).max(500).required()
});

/**
 * Route: /api/v1/test
 * All routes here are prefixed with /test in the main router
 */

// Route for echoing a message with validation
router.post('/echo', validate(echoSchema), testController.echoMessage);

// Route for triggering an error
router.get('/error', testController.triggerTestError);

module.exports = router;
