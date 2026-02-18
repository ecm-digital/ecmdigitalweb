'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { caseStudies, ct } from './caseData';

export default function CaseStudyPage({ slug }: { slug: string }) {
    const { lang } = useLanguage();
    const cs = caseStudies.find(c => c.slug === slug);

    const T = (key: string) => ct(lang || 'pl', key);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    if (!cs) return <div>Case study not found</div>;

    const techs = T(`${slug}.techs`).split(',');

    return (
        <>
            <Navbar />

            {/* Hero */}
            <section className="cs-hero" style={{ background: cs.gradient }}>
                <div className="hero-bg-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="cs-hero-content">
                        <div className="sp-icon" style={{ fontSize: '4rem', marginBottom: '16px' }}>{cs.icon}</div>
                        <h1 className="sp-title">{T(`${slug}.title`)}</h1>
                        <p className="sp-subtitle">{T(`${slug}.subtitle`)}</p>
                        <div className="cs-meta-row">
                            <span className="cs-meta-badge">{T(`${slug}.client`)}</span>
                            <span className="cs-meta-badge">⏱ {T(`${slug}.timeline`)}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="section">
                <div className="container">
                    <div className="section-header fade-in">
                        <h2 className="section-title">{T('cs.results')}</h2>
                    </div>
                    <div className="cs-results-grid fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="cs-result-card" style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid var(--border)',
                                borderRadius: '24px',
                                padding: '32px 24px',
                                textAlign: 'center'
                            }}>
                                <div className="cs-result-value" style={{
                                    fontSize: '2rem',
                                    fontWeight: 800,
                                    color: 'var(--brand-accent)',
                                    marginBottom: '8px'
                                }}>{T(`${slug}.result${i}.value`)}</div>
                                <div className="cs-result-label" style={{
                                    fontSize: '0.9rem',
                                    color: 'var(--text-secondary)',
                                    fontWeight: 500
                                }}>{T(`${slug}.result${i}.label`)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Challenge & Solution */}
            <section className="section" style={{ background: 'var(--surface-1)' }}>
                <div className="container">
                    <div className="sp-desc-grid">
                        <div className="fade-in-left">
                            <h2 className="cs-section-h2" style={{ marginBottom: '24px' }}>{T('cs.challenge')}</h2>
                            <p className="sp-long-text">{T(`${slug}.challenge`)}</p>
                        </div>
                        <div className="fade-in-right">
                            <h2 className="cs-section-h2" style={{ marginBottom: '24px' }}>{T('cs.solution')}</h2>
                            <p className="sp-long-text">{T(`${slug}.solution`)}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technologies */}
            <section className="section">
                <div className="container">
                    <div className="section-header fade-in">
                        <h2 className="section-title">{T('cs.techs')}</h2>
                    </div>
                    <div className="sp-tech-row fade-in" style={{ justifyContent: 'center' }}>
                        {techs.map(tech => (
                            <span key={tech} className="sp-tech-badge" style={{
                                padding: '8px 20px',
                                background: 'var(--surface-1)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontWeight: 600
                            }}>{tech}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="sp-cta" style={{ background: cs.gradient, padding: '100px 0' }}>
                <div className="container">
                    <div className="sp-cta-content fade-in" style={{ textAlign: 'center', color: 'white' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '32px' }}>{T('cs.cta.title')}</h2>
                        <a href="/#contact" className="btn-primary" style={{ background: 'white', color: cs.gradient.includes('#e94560') ? '#e94560' : '#0f3460' }}>{T('cs.cta.button')} →</a>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
