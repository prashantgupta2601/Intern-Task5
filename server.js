/**
 * Server entry point
 * Responsible for loading environment variables and starting the HTTP server
 */
const app = require('./app');
const config = require('./config/appConfig');

const PORT = config.port;

// Start listening for requests
app.listen(PORT, () => {
    console.log('--------------------------------------------------');
    console.log(`🚀 Server is running in ${config.env} mode`);
    console.log(`📡 Listening on: http://localhost:${PORT}`);
    console.log('--------------------------------------------------');
});
