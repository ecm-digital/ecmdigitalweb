import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK only once
let adminApp: admin.app.App;

export function getAdminApp(): admin.app.App {
  if (adminApp) {
    return adminApp;
  }

  // Parse the service account from environment variable
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
  }

  const serviceAccount = JSON.parse(serviceAccountJson);

  adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'ecmdigital-28074',
  });

  return adminApp;
}

export function getFirestore() {
  return getAdminApp().firestore();
}

export function getAuth() {
  return getAdminApp().auth();
}
