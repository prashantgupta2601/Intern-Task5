const Joi = require('joi');

/**
 * Robust Request Validator Middleware using Joi
 * 
 * @param {Object} schema - Joi schema object
 * @param {string} source - Where to look for data ('body', 'query', 'params')
 */
const validate = (schema, source = 'body') => (req, res, next) => {
    const data = req[source];
    
    // Validate data against schema
    // abortEarly: false - return all errors, not just the first one
    const { error, value } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true // Remove fields that are not in the schema
    });

    if (error) {
        // Format Joi error details into a clean array
        const details = error.details.map(err => err.message.replace(/"/g, ''));
        
        return res.status(400).json({
            success: false,
            error: {
                message: 'Validation Failed',
                details,
                status: 400
            }
        });
    }

    // Replace the request data with the validated/stripped value
    req[source] = value;
    next();
};

module.exports = validate;
