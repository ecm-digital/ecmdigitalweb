import { db } from './firebase';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { services } from '@/app/services/serviceData';
import { st } from '@/app/services/serviceTranslations';

export async function seedAgencyServices(force = false) {
    const AGENCY_SERVICES = 'agency_services';
    try {
        console.log('Checking for existing services in Firestore...');
        const querySnapshot = await getDocs(collection(db, AGENCY_SERVICES));

        if (!querySnapshot.empty && !force) {
            console.log(`Services already seeded (${querySnapshot.size} found). Use force=true to overwrite.`);
            return { success: true, count: querySnapshot.size, message: 'Already seeded' };
        }

        console.log('Seeding services to Firestore...');
        let seededCount = 0;

        for (const slug in services) {
            const service = services[slug];

            // Get translations for PL
            const plFeatures = [1, 2, 3, 4, 5, 6].map(i => {
                try {
                    return st('pl', `${slug}.features.${i}`);
                } catch (e) {
                    return `Feature ${i}`;
                }
            });

            const serviceData = {
                slug: service.slug,
                icon: service.icon,
                gradient: service.gradient,
                techs: service.techs,
                price: st('pl', `${slug}.price`),
                translations: {
                    pl: {
                        title: st('pl', `${slug}.title`),
                        subtitle: st('pl', `${slug}.subtitle`),
                        long: st('pl', `${slug}.long`),
                        features: plFeatures
                    }
                },
                updatedAt: serverTimestamp()
            };

            await setDoc(doc(db, AGENCY_SERVICES, slug), serviceData);
            console.log(`Seeded: ${slug}`);
            seededCount++;
        }

        console.log('Seeding complete.');
        return { success: true, count: seededCount, message: 'Seeding complete' };
    } catch (error: any) {
        console.error('Error seeding services:', error);
        return { success: false, error: error.message };
    }
}
