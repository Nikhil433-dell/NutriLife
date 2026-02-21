/**
 * Vercel serverless catch-all – all /api/* requests are handled by the Express app.
 */
const app = require('../server/app');
module.exports = app;
