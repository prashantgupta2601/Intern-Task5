const { Queue } = require('bullmq');
const connection = require('../config/redisConfig');

/**
 * Email Queue Configuration
 * Defines the queue and helper functions to add jobs
 */

const emailQueue = new Queue('emailQueue', {
    connection,
});

/**
 * addEmailJob
 * Enqueues an email job with retry and backoff strategies
 * 
 * @param {Object} data - Email details (email, subject, message)
 */
const addEmailJob = async (data) => {
    try {
        const job = await emailQueue.add('sendEmail', data, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000, // Wait 5s, then 10s, then 20s...
            },
            removeOnComplete: true, // Clean up successful jobs
            removeOnFail: false,   // Keep failed jobs for debugging
        });

        console.log(`✅ Job enqueued: ${job.id}`);
        return job;
    } catch (error) {
        console.error('❌ Failed to enqueue email job:', error.message);
        throw error;
    }
};

module.exports = {
    emailQueue,
    addEmailJob,
};
