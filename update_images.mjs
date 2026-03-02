import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
    const querySnapshot = await getDocs(collection(db, 'agency_case_studies'));
    const ops = [];

    querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        const title = data.translations?.pl?.title || data.slug;
        console.log(`Checking DB ID: ${docSnap.id}, Title: ${title}, Slug: ${data.slug}`);

        let img = null;
        if (title.includes('Agencji Nieruchomości') && title.includes('Automatyzacja')) img = '/img_case_real_estate_ai.webp';
        else if (title.includes('Strona internetowa dla agencji nieruchomości')) img = '/img_case_real_estate_web.webp';
        else if (title.includes('Rozwiązanie dla doradcy kredytowego')) img = '/img_case_credit_advisor.webp';
        else if (title.includes('Kingsmith')) img = '/img_case_fitness_app.webp';

        // Also fix any slugs matching
        if (!img) {
            if (data.slug === 'automatyzacja-nieruchomosci') img = '/img_case_real_estate_ai.webp';
            if (data.slug === 'doradztwo-kredytowe-ai') img = '/img_case_credit_advisor.webp';
            if (data.slug === 'aplikacja-kingsmith') img = '/img_case_fitness_app.webp';
            if (data.slug === 'agencja-nieruchomosci-web') img = '/img_case_real_estate_web.webp';
        }

        if (img) {
            console.log(`-> Updating ${docSnap.id} with img: ${img}`);
            ops.push(updateDoc(doc(db, 'agency_case_studies', docSnap.id), { img }));
        }
    });

    await Promise.all(ops);
    console.log('Update complete.');
    process.exit(0);
}
run();
