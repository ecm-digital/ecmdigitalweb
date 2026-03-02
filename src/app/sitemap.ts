import { MetadataRoute } from 'next';
import { blogPosts } from './blog/blogData';
import { caseStudies } from './cases/caseData';
import { services } from './services/serviceData';
import { knowledgeItems } from './wiedza/wiedzaData';

async function fetchDynamicSlugs(collectionName: string) {
    try {
        const res = await fetch(`https://firestore.googleapis.com/v1/projects/ecmdigital-28074/databases/(default)/documents/${collectionName}`, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        const data = await res.json();
        if (!data.documents) return [];
        return data.documents.map((d: any) => {
            const slug = d.fields?.slug?.stringValue || d.name.split('/').pop();
            return { slug };
        });
    } catch (e) {
        console.error(`Error fetching dynamic slugs for ${collectionName}:`, e);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.ecm-digital.com';

    // Base pages
    const basePages = [
        '',
        '/blog',
    ].map((url) => ({
        url: `${baseUrl}${url}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Blog posts
    const blogUrls = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    try {
        // Services
        let firestoreServices: any[] = [];
        try { firestoreServices = await fetchDynamicSlugs('agency_services'); } catch (e) { console.error('Error fetching services:', e); }

        const dynamicServiceUrls = firestoreServices.map((service) => ({
            url: `${baseUrl}/services/${service.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }));
        const staticServiceUrls = Object.values(services).map((service) => ({
            url: `${baseUrl}/services/${service.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }));
        const allServiceUrls = [...staticServiceUrls, ...dynamicServiceUrls].filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);

        // Case Studies
        let firestoreCases: any[] = [];
        try { firestoreCases = await fetchDynamicSlugs('agency_case_studies'); } catch (e) { console.error('Error fetching cases:', e); }

        const dynamicCaseUrls = firestoreCases.map((cs) => ({
            url: `${baseUrl}/cases/${cs.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }));
        const staticCaseUrls = caseStudies.map((cs) => ({
            url: `${baseUrl}/cases/${cs.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }));
        const allCaseUrls = [...staticCaseUrls, ...dynamicCaseUrls].filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);

        // Landing Pages (Google Ads)
        const landingPages = ['strony-www', 'ai-chatbot', 'automatyzacja'].map((lp) => ({
            url: `${baseUrl}/lp/${lp}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));

        // Knowledge Base urls
        const wiedzaUrls = knowledgeItems.map((item) => ({
            url: `${baseUrl}/wiedza/${item.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }));

        const sitemapResult = [...basePages, ...blogUrls, ...allServiceUrls, ...allCaseUrls, ...landingPages, ...wiedzaUrls];
        console.log('SITEMAP GENERATION SUCCESS');
        return sitemapResult;
    } catch (error) {
        console.error('SITEMAP ERROR:', error);
        return [...basePages, ...blogUrls];
    }
}
