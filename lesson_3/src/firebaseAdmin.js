const admin = require('firebase-admin');

const serviceAccount = require('./ako-ofw-fbf7a-firebase-adminsdk-5kcx0-97999b2ac7.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
