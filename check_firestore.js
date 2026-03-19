const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// Try to find service account key
const possiblePaths = [
  path.join(process.env.HOME, '.firebase', 'ecmdigital-28074-adminsdk-*.json'),
  '/Users/tomaszgt/.firebase/*.json',
  '../.firebase/*.json'
];

let serviceAccount = null;
const firebaseDir = path.join(process.env.HOME, '.firebase');

if (fs.existsSync(firebaseDir)) {
  const files = fs.readdirSync(firebaseDir);
  const keyFile = files.find(f => f.includes('adminsdk') && f.endsWith('.json'));
  if (keyFile) {
    const filePath = path.join(firebaseDir, keyFile);
    try {
      serviceAccount = require(filePath);
      console.log(`✅ Found service account: ${keyFile}\n`);
    } catch (e) {
      console.log('Could not load service account');
    }
  }
}

if (!serviceAccount) {
  console.error('❌ Service account key not found');
  console.log('Try running: firebase init to set up your project');
  process.exit(1);
}

try {
  const app = initializeApp({
    credential: cert(serviceAccount),
  });

  const db = getFirestore(app);

  async function checkBids() {
    try {
      const snapshot = await db.collection('useme_bids').orderBy('sentAt', 'desc').get();
      
      console.log(`\n📊 USEME BIDS IN FIRESTORE: ${snapshot.size} ofert\n`);
      console.log('─'.repeat(80));
      
      if (snapshot.empty) {
        console.log('❌ Nie znaleziono żadnych ofert w Firestore');
      } else {
        snapshot.forEach((doc, idx) => {
          const data = doc.data();
          console.log(`\n${idx + 1}. ${data.client.toUpperCase()}`);
          console.log(`   Opis: ${data.description}`);
          console.log(`   💰 Cena: ${data.price.toLocaleString('pl-PL')} PLN`);
          console.log(`   ⏱️  Dni: ${data.days}`);
          console.log(`   Status: ${data.status}`);
          console.log(`   Data: ${data.sentAt.toDate().toLocaleString('pl-PL')}`);
        });
      }
      
      console.log('\n' + '─'.repeat(80));
    } catch (err) {
      console.error('❌ Błąd querowania Firestore:', err.message);
    }
    process.exit(0);
  }

  checkBids();
} catch (err) {
  console.error('❌ Firebase init error:', err.message);
  process.exit(1);
}
