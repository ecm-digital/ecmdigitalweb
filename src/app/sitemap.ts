import { MetadataRoute } from 'next';
import { blogPosts } from './blog/blogData';
import { caseStudies } from './cases/caseData';
import { services } from './services/serviceData';

export default function sitemap(): MetadataRoute.Sitemap {
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

    // Services
    const serviceUrls = Object.values(services).map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // Case Studies
    const caseUrls = caseStudies.map((cs) => ({
        url: `${baseUrl}/cases/${cs.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // Landing Pages (Google Ads)
    const landingPages = ['strony-www', 'ai-chatbot', 'automatyzacja'].map((lp) => ({
        url: `${baseUrl}/lp/${lp}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...basePages, ...blogUrls, ...serviceUrls, ...caseUrls, ...landingPages];
}
