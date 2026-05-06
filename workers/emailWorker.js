const { Worker } = require('bullmq');
const connection = require('../config/redisConfig');
const emailService = require('../services/emailService');

/**
 * Email Worker
 * Listens for jobs on the 'emailQueue' and processes them
 */

const emailWorker = new Worker('emailQueue', async (job) => {
    console.log(`🔨 Processing Job: ${job.id} (Attempt: ${job.attemptsMade + 1})`);
    
    const { email, subject, message } = job.data;
    
    try {
        await emailService.sendEmail(email, subject, message);
        console.log(`✨ Job ${job.id} completed successfully`);
    } catch (error) {
        console.error(`❌ Job ${job.id} failed:`, error.message);
        throw error; // Throwing ensures BullMQ handles retries
    }
}, {
    connection,
    concurrency: 5, // Process up to 5 jobs at once
});

emailWorker.on('ready', () => {
    console.log('👷 Worker is ready and listening for jobs...');
});

emailWorker.on('failed', (job, error) => {
    console.error(`🚨 Job ${job.id} definitively failed after retries:`, error.message);
});

module.exports = emailWorker;
