'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function DynamicSEO() {
    const { T, lang } = useLanguage();

    useEffect(() => {
        // Update document title
        const title = T('meta.title');
        if (title) {
            document.title = title;
        }

        // Update meta description
        const description = T('meta.description');
        if (description) {
            let metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            }
        }

        // Update OpenGraph tags
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', T('meta.title'));

        let ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) ogDescription.setAttribute('content', T('meta.description'));

    }, [T, lang]);

    return null; // This component doesn't render anything
}
