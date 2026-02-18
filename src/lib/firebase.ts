import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBXWWeTo7kzedHynbVHrpR_7cUWHljqRZo",
    authDomain: "ecmdigital-28074.firebaseapp.com",
    projectId: "ecmdigital-28074",
    storageBucket: "ecmdigital-28074.firebasestorage.app",
    messagingSenderId: "780205830091",
    appId: "1:780205830091:web:067fd063adace1ea55d04e",
    measurementId: "G-LC6Q3MQNDL"
};

// Initialize Firebase (prevent re-initialization in dev)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
