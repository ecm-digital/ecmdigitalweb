const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function checkSettings() {
    try {
        const doc = await db.collection('settings').doc('agency').get();
        if (doc.exists) {
            console.log(JSON.stringify(doc.data()));
        } else {
            console.log('No settings found');
        }
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

checkSettings();
