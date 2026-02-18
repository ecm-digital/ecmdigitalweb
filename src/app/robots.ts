import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard'],
        },
        sitemap: 'https://www.ecm-digital.com/sitemap.xml',
    };
}
