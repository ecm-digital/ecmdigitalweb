'use client';

import { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { services } from './serviceData';
import { st } from './serviceTranslations';

export default function ServicePage({ serviceKey }: { serviceKey: string }) {
    const { T: tGlobal, lang } = useLanguage();
    const service = services[serviceKey];

    const T = (key: string) => st(lang, key);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    if (!service) return <div>Service not found</div>;

    return (
        <>
            <Navbar />

            {/* Hero */}
            <section className="sp-hero" style={{ background: service.gradient }}>
                <div className="hero-bg-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="sp-hero-content">
                        <div className="sp-icon">{service.icon}</div>
                        <h1 className="sp-title">{T(`${serviceKey}.title`)}</h1>
                        <p className="sp-subtitle">{T(`${serviceKey}.subtitle`)}</p>
                        <div className="sp-price">{T(`${serviceKey}.price`)}</div>
                    </div>
                </div>
            </section>

            {/* Description */}
            <section className="section">
                <div className="container">
                    <div className="sp-desc-grid">
                        <div className="sp-desc fade-in-left">
                            <p className="sp-long-text">{T(`${serviceKey}.long`)}</p>
                        </div>
                        <div className="sp-process fade-in-right">
                            <h3 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>{T('process.title')}</h3>
                            {[1, 2, 3, 4].map(idx => (
                                <div key={idx} className="sp-process-step" style={{
                                    padding: '16px',
                                    background: 'var(--surface-1)',
                                    borderRadius: '12px',
                                    marginBottom: '12px',
                                    border: '1px solid var(--border)'
                                }}>
                                    <span style={{ fontWeight: 700, marginRight: '12px', color: 'var(--brand-accent)' }}>0{idx}.</span>
                                    {T(`process.step${idx}`)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section" style={{ background: 'var(--surface-1)' }}>
                <div className="container">
                    <div className="section-header fade-in">
                        <h2 className="section-title">{T('features.title')}</h2>
                    </div>
                    <div className="sp-features-grid">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className={`sp-feature-card fade-in delay-${i}`}>
                                <div className="sp-feature-check" style={{ color: service.gradient.includes('#e94560') ? '#e94560' : '#3b82f6' }}>✓</div>
                                <span>{T(`${serviceKey}.features.${i}`)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technologies */}
            <section className="section">
                <div className="container">
                    <div className="section-header fade-in">
                        <h2 className="section-title">{T('techs.title')}</h2>
                    </div>
                    <div className="sp-tech-row fade-in" style={{ justifyContent: 'center' }}>
                        {service.techs.map(tech => (
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
            <section className="sp-cta" style={{ background: service.gradient, padding: '100px 0' }}>
                <div className="container">
                    <div className="sp-cta-content fade-in" style={{ textAlign: 'center', color: 'white' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{T('cta.title')}</h2>
                        <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '32px' }}>{T('cta.subtitle')}</p>
                        <a href="/#contact" className="btn-primary" style={{ background: 'white', color: service.gradient.includes('#e94560') ? '#e94560' : '#0f3460' }}>{T('cta.button')} →</a>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
