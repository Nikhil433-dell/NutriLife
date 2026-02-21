const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let db = null;

function initFirebase() {
  if (admin.apps.length > 0) {
    return admin.firestore();
  }

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (json) {
    try {
      const credentials = JSON.parse(json);
      admin.initializeApp({ credential: admin.credential.cert(credentials) });
    } catch (e) {
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON: ' + e.message);
    }
  } else if (credPath) {
    const resolved = path.isAbsolute(credPath) ? credPath : path.resolve(process.cwd(), credPath);
    const credentials = JSON.parse(fs.readFileSync(resolved, 'utf8'));
    admin.initializeApp({ credential: admin.credential.cert(credentials) });
  } else {
    throw new Error('Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON');
  }

  return admin.firestore();
}

function getDb() {
  if (!db) {
    db = initFirebase();
  }
  return db;
}

module.exports = { getDb, admin };
