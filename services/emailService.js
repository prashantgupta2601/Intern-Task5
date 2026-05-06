/**
 * Email Service
 * Simulates sending an email with a realistic delay
 */

const sendEmail = async (email, subject, message) => {
    // Simulate network latency/processing time
    const delay = 2000; // 2 seconds

    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('--------------------------------------------------');
            console.log(`📧 EMAIL SENT SUCCESSFULLY`);
            console.log(`To: ${email}`);
            console.log(`Subject: ${subject}`);
            console.log(`Message: ${message}`);
            console.log('--------------------------------------------------');
            resolve({ success: true, timestamp: new Date() });
        }, delay);
    });
};

module.exports = {
    sendEmail,
};
