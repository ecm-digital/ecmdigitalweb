'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { knowledgeItems, tkb } from '../wiedzaData';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
    slug: string;
}

export default function ClientKnowledgeBasePost({ slug }: Props) {
    const { lang } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const item = knowledgeItems.find(k => k.slug === slug);
    if (!item) return notFound();

    const currentLang = typeof window !== 'undefined' ? localStorage.getItem('siteLang') as 'pl' | 'en' | 'de' || 'pl' : 'pl';
    const content = item.translations[currentLang] || item.translations.pl || item.translations.en;

    if (!mounted) return null;

    return (
        <div className="lp-wrapper">
            <Navbar />

            {/* Markdown styles */}
            <style jsx global>{`
                .kb-content {
                    color: rgba(255, 255, 255, 0.85);
                    font-size: 1.15rem;
                    line-height: 1.8;
                    font-family: var(--font-system);
                }
                .kb-content h2 {
                    font-size: 2.25rem;
                    font-weight: 700;
                    margin-top: 3rem;
                    margin-bottom: 1.5rem;
                    color: #fff;
                    letter-spacing: -0.02em;
                }
                .kb-content h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    color: rgba(255,255,255,0.95);
                }
                .kb-content p {
                    margin-bottom: 1.5rem;
                }
                .kb-content ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin-bottom: 2rem;
                }
                .kb-content li {
                    margin-bottom: 0.75rem;
                }
                .kb-content strong {
                    color: #fff;
                    font-weight: 600;
                }
            `}</style>

            <article style={{ paddingTop: '160px', paddingBottom: '100px', minHeight: '80vh' }}>
                <div className="container relative z-10" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <button
                        onClick={() => window.location.href = '/wiedza'}
                        className="premium-glass-panel"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: 'rgba(255,255,255,0.6)',
                            textDecoration: 'none',
                            marginBottom: '48px',
                            padding: '10px 20px',
                            borderRadius: '999px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            background: 'rgba(255,255,255,0.03)',
                            transition: 'color 0.3s'
                        }}
                    >
                        ← {tkb(lang, 'kb.back')}
                    </button>

                    <div style={{ marginBottom: '48px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '24px',
                            borderRadius: '32px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            marginBottom: '32px',
                            fontSize: '4rem',
                            boxShadow: `0 0 40px ${item.gradient.split(',')[1].trim()}33`
                        }}>
                            {item.icon}
                        </div>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            fontWeight: 900,
                            color: 'white',
                            marginBottom: '24px',
                            lineHeight: 1.1,
                            letterSpacing: '-0.03em',
                            backgroundImage: item.gradient,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}>
                            {content.title}
                        </h1>
                        <p style={{
                            fontSize: '1.25rem',
                            color: 'rgba(255,255,255,0.6)',
                            lineHeight: 1.6,
                            maxWidth: '90%'
                        }}>
                            {content.shortDesc}
                        </p>
                    </div>

                    <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', margin: '48px 0' }} />

                    <div className="kb-content font-light">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    );
}
