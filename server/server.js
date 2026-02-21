/**
 * Local server – run with: node server.js or npm start
 * For Vercel, the app is served via api/index.js (see server/app.js).
 */
const { getDb } = require('./config/firebase');
const app = require('./app');
const PORT = process.env.PORT || 500;

getDb(); // validate Firebase at startup when running locally
app.listen(PORT, () => {
  console.log(`NutriLife API running at http://localhost:${PORT}`);
});
