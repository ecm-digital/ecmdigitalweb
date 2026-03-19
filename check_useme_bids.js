const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, 'firebaseServiceAccount.json');
try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://ecmdigital-28074.firebaseio.com'
  });
} catch (err) {
  console.error('Firebase init error (trying default creds):', err.message);
  admin.initializeApp();
}

const db = admin.firestore();

async function checkBids() {
  try {
    const snapshot = await db.collection('useme_bids').get();
    console.log(`\n📊 Total Useme Bids: ${snapshot.size}\n`);
    
    if (snapshot.empty) {
      console.log('❌ No bids found in Firestore');
    } else {
      console.log('✅ Bids found:');
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`\n  ID: ${doc.id}`);
        console.log(`  Klient: ${data.client}`);
        console.log(`  Opis: ${data.description}`);
        console.log(`  Cena: ${data.price} PLN`);
        console.log(`  Dni: ${data.days}`);
        console.log(`  Status: ${data.status}`);
        console.log(`  Wysłana: ${data.sentAt?.toDate?.()?.toLocaleString?.('pl-PL') || data.sentAt}`);
      });
    }
  } catch (err) {
    console.error('Error checking bids:', err.message);
  }
  process.exit(0);
}

checkBids();
