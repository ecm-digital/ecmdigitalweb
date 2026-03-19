const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firebase Admin correctly using default credentials
initializeApp();
const db = getFirestore();

async function checkDb() {
  try {
    const doc = await db.collection("settings").doc("agency").get();
    console.log(doc.data());
  } catch (e) {
    console.error("Error reading database:", e);
  }
}

checkDb();
