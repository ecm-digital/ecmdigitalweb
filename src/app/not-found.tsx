'use client';

import { useEffect, useState } from 'react';
import DynamicCaseStudyPage from './cases/[slug]/DynamicCaseStudyClient';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
    const [isCasePage, setIsCasePage] = useState<boolean | null>(null);
    const { T } = useLanguage();

    useEffect(() => {
        const path = window.location.pathname;
        setIsCasePage(path.startsWith('/cases/') && path.split('/').filter(Boolean).length === 2);
    }, []);

    // Still deciding
    if (isCasePage === null) return null;

    // It's a /cases/[slug] URL — render the dynamic case study fetcher
    if (isCasePage) return <DynamicCaseStudyPage />;

    // Real 404
    return (
        <div style={{
            minHeight: '100vh', background: '#070710',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <div style={{ textAlign: 'center', color: 'white' }}>
                <div style={{ fontSize: 80, marginBottom: 24, opacity: 0.3 }}>404</div>
                <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>{T('notFound.title')}</h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>
                    {T('notFound.desc')}
                </p>
                <a href="/" style={{
                    padding: '14px 28px', background: '#3b82f6',
                    color: 'white', borderRadius: 14, textDecoration: 'none', fontWeight: 700,
                }}>{T('notFound.button')}</a>
            </div>
        </div>
    );
}
