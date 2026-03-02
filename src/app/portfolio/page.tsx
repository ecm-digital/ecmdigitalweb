'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { getCaseStudies, CaseStudy } from '@/lib/firestoreService';

export default function PortfolioPage() {
    const { T, lang } = useLanguage();
    const [cases, setCases] = useState<CaseStudy[]>([]);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const data = await getCaseStudies();
                setCases(data);
            } catch (error) {
                console.error('Error fetching cases:', error);
            }
        };
        fetchCases();

        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); }),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('.reveal-on-scroll, .fade-in-up').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    // Dynamic items from database, synced with homepage
    const displayItems = cases.length > 0 ? cases : [
        { id: '1', i: 1, slug: 'chatbot-ai-ecommerce', color: '#3b82f6', img: '/case_study_ai_chatbot_mockup_1772144142535.webp' },
        { id: '2', i: 2, slug: 'sklep-shopify-ai', color: '#ec4899', img: '/case_study_shopify_ai_mockup_1772144156310.webp' },
        { id: '3', i: 3, slug: 'automatyzacja-n8n', color: '#10b981', img: '/case_study_automation_n8n_mockup_1772144173711.webp' },
        { id: '4', i: 4, slug: 'aplikacja-mvp', color: '#f59e0b', img: '/case_study_mvp_startup_mockup_1772144187874.webp' },
    ];

    return (
        <div className="lp-wrapper">
            <Navbar />

            {/* Premium Hero */}
            <section className="relative overflow-hidden bg-grid" style={{ padding: '160px 0 100px', minHeight: '40vh', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />
                <div className="container relative z-10 text-center">
                    <div className="fade-in-up">
                        <div className="hero-badge" style={{
                            margin: '0 auto 24px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '10px 24px',
                            borderRadius: '999px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(20px)'
                        }}>
                            💼 {T('nav.caseStudies')}
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                            {T('cases.title')}
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                            {T('cases.subtitle')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="section bg-grid relative" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'transparent' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '32px' }}>
                        {displayItems.map((item: any, idx) => {
                            const i = item.i || (idx + 1);
                            const slug = item.slug || `case-${idx}`;
                            const color = item.color || '#3b82f6';
                            const category = item.translations?.[lang]?.category || item.category || T(`cases.case${i}.cat`) || T('portfolio.category');
                            const title = item.translations?.[lang]?.title || item.title || T(`cases.case${i}.title`) || T('portfolio.projectTitle');
                            const description = item.translations?.[lang]?.description || item.description || T(`cases.case${i}.desc`) || T('portfolio.description');
                            let image = item.coverImage || item.img || item.image || '';
                            if (!image) {
                                if (title.includes('Nieruchomości') && title.includes('Automatyzacja')) image = '/img_case_real_estate_ai.webp';
                                else if (title.toLowerCase().includes('doradcy kredytowego')) image = '/img_case_credit_advisor.webp';
                                else if (title.toLowerCase().includes('kingsmith')) image = '/img_case_fitness_app.webp';
                                else if (title.toLowerCase().includes('agencji nieruchomości') && title.toLowerCase().includes('strona')) image = '/img_case_real_estate_web.webp';
                                else if (title.toLowerCase().includes('kursami z zakresu ai')) image = '/img_case_ai_education.webp';
                                else image = '/case_study_mvp_startup_mockup_1772144187874.webp'; // Global fallback
                            }

                            const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;
                                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                            };

                            return (
                                <a
                                    key={slug + idx}
                                    href={item.translations ? `/cases/view?slug=${slug}` : `/cases/${slug}`}
                                    onMouseMove={handleMouseMove}
                                    className="premium-glass-panel premium-card-glow fade-in-up"
                                    style={{
                                        padding: '40px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        animationDelay: `${0.1 * idx}s`,
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        borderRadius: '28px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        minHeight: '420px',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        background: 'rgba(255,255,255,0.02)'
                                    }}
                                >
                                    {image && (
                                        <div className="case-card-image-wrapper" style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '20px', overflow: 'hidden', marginBottom: '24px' }}>
                                            <Image src={image.startsWith('/') || image.startsWith('http') ? image : `/${image}`} alt={title} fill style={{ objectFit: 'cover' }} />
                                            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)` }} />
                                        </div>
                                    )}
                                    <div style={{ position: 'absolute', top: 0, right: 0, width: '180px', height: '180px', background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`, filter: 'blur(30px)', pointerEvents: 'none', zIndex: 1 }}></div>
                                    <div style={{
                                        fontSize: '0.8rem', fontWeight: 700, color: color,
                                        textTransform: 'uppercase', letterSpacing: '0.1em',
                                        marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        position: 'relative', zIndex: 2
                                    }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }}></span>
                                        {category}
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', lineHeight: 1.3, position: 'relative', zIndex: 2, fontWeight: 800 }}>{title}</h3>
                                    <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', flexGrow: 1, lineHeight: 1.6, position: 'relative', zIndex: 2 }}>{description}</p>

                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                                        {item.translations?.[lang]?.results ? (
                                            <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: 700 }}>
                                                🚀 {item.translations[lang].results}
                                            </div>
                                        ) : item.translations?.[lang]?.resultsStats && item.translations[lang].resultsStats.length >= 2 ? (
                                            <div style={{ display: 'flex', gap: '32px' }}>
                                                <div>
                                                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>{item.translations[lang].resultsStats[0].value}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{item.translations[lang].resultsStats[0].label}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>{item.translations[lang].resultsStats[1].value}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{item.translations[lang].resultsStats[1].label}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '32px' }}>
                                                <div>
                                                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>{T(`cases.case${i}.stat1.value`) || '100%'}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{T(`cases.case${i}.stat1.label`) || 'ROI'}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>{T(`cases.case${i}.stat2.value`) || '2x'}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{T(`cases.case${i}.stat2.label`) || T('portfolio.growth')}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </a>
                            )
                        })}
                    </div>
                </div>
                <style jsx>{`
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </section>

            <Footer />
        </div>
    );
}
