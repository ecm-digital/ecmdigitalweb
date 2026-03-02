'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { knowledgeItems, tkb } from './wiedzaData';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function KnowledgeBasePage() {
    const { lang } = useLanguage();

    return (
        <div className="lp-wrapper">
            <Navbar />

            {/* Premium Hero Section */}
            <section className="relative overflow-hidden bg-grid" style={{
                padding: '180px 20px 100px',
                minHeight: '40vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                background: 'radial-gradient(circle at top, rgba(59, 130, 246, 0.05), transparent 70%)'
            }}>
                <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '100vw', height: '600px', background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

                <div className="container relative z-10">
                    <div className="fade-in-up" style={{ maxWidth: '850px', margin: '0 auto' }}>
                        <div className="hero-badge" style={{
                            margin: '0 auto 32px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '10px 24px',
                            borderRadius: '999px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(20px)',
                            color: '#60a5fa',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}>
                            📚 {tkb(lang, 'kb.back')}
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                            fontWeight: 800,
                            marginBottom: '28px',
                            letterSpacing: '-0.04em',
                            lineHeight: 1.1,
                            textAlign: 'center'
                        }}>
                            {tkb(lang, 'kb.hero.title')}
                        </h1>
                        <p style={{
                            fontSize: '1.25rem',
                            color: 'rgba(255,255,255,0.6)',
                            maxWidth: '680px',
                            margin: '0 auto',
                            lineHeight: 1.7,
                            textAlign: 'center'
                        }}>
                            {tkb(lang, 'kb.hero.subtitle')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Grid */}
            <section className="section bg-grid relative" style={{
                borderTop: '1px solid rgba(255,255,255,0.05)',
                background: 'transparent',
                padding: '80px 0 160px'
            }}>
                <div className="container relative z-10">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                        gap: '32px',
                        justifyContent: 'center'
                    }}>
                        {knowledgeItems.map((item, idx) => {
                            const content = item.translations[lang] || item.translations.pl || item.translations.en;
                            if (!content) return null;

                            return (
                                <Link href={`/wiedza/${item.slug}`} key={item.slug} className="premium-glass-panel premium-card-glow fade-in-up" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '44px',
                                    borderRadius: '32px',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    background: 'rgba(255,255,255,0.02)',
                                    animationDelay: `${idx * 0.1}s`
                                }}>
                                    <div style={{
                                        width: '64px', height: '64px', borderRadius: '18px',
                                        background: item.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '2rem', marginBottom: '32px',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                                    }}>
                                        {item.icon}
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px', color: 'white', letterSpacing: '-0.02em' }}>
                                        {content.title}
                                    </h3>
                                    <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '36px', flexGrow: 1 }}>
                                        {content.shortDesc}
                                    </p>
                                    <div className="item-link" style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: '#60a5fa',
                                        fontWeight: 600,
                                        fontSize: '0.95rem'
                                    }}>
                                        {tkb(lang, 'kb.read')} <span style={{ transition: 'transform 0.3s' }}>→</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
