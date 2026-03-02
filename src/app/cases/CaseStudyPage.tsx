'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { caseStudies, ct } from './caseData';
import ContactSection from '@/components/ContactSection';

export default function CaseStudyPage({ slug }: { slug: string }) {
    const { lang } = useLanguage();
    const cs = caseStudies.find(c => c.slug === slug);

    const T = (key: string) => ct(lang || 'pl', key);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    if (!cs) return <div>Case study not found</div>;

    const techs = T(`${slug}.techs`).split(',');
    const accentColor = cs.gradient.match(/#([0-9a-fA-F]{6})/)?.[0] || '#3b82f6';

    return (
        <div className="lp-wrapper">
            <div className="scroll-progress-bar" />
            <Navbar />

            {/* Premium Hero */}
            <section className="relative overflow-hidden" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', paddingTop: '160px', paddingBottom: '80px', background: 'var(--brand-primary)' }}>
                {/* Animated Background Orbs */}
                <div style={{ position: 'absolute', top: '10%', left: '10%', width: '40vw', height: '40vw', background: `radial-gradient(circle, ${accentColor}25 0%, transparent 70%)`, filter: 'blur(80px)', zIndex: 0, animation: 'float 10s infinite alternate', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-20%', right: '10%', width: '30vw', height: '30vw', background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`, filter: 'blur(100px)', zIndex: 0, animation: 'float 14s infinite alternate-reverse', pointerEvents: 'none' }} />

                <div className="container relative z-10">
                    <div className="fade-in-up" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{
                            fontSize: '4rem',
                            width: '100px',
                            height: '100px',
                            margin: '0 auto 32px',
                            background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))`,
                            border: `1px solid rgba(255,255,255,0.1)`,
                            boxShadow: `0 0 30px ${accentColor}40`,
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(10px)'
                        }}>
                            {cs.icon}
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px' }}>
                            {T(`${slug}.title`)}
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '32px' }}>{T(`${slug}.subtitle`)}</p>

                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 24px', background: `${accentColor}15`, border: `1px solid ${accentColor}30`, borderRadius: '999px', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
                                {T('cs.clientLabel')}: {T(`${slug}.client`)}
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 24px', background: `rgba(255,255,255,0.05)`, border: `1px solid rgba(255,255,255,0.1)`, borderRadius: '999px', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
                                ⏱ {T(`${slug}.timeline`)}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Results KPI Panel */}
            <section className="section bg-grid relative" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to bottom, transparent, rgba(5,5,7,0.8))' }}>
                <div className="container">
                    <div className="section-header fade-in-up">
                        <span className="section-label" style={{ padding: '8px 16px', background: `${accentColor}15`, color: accentColor, borderRadius: '999px', border: `1px solid ${accentColor}30` }}>KPI</span>
                        <h2 className="section-title">{T('cs.results')}</h2>
                    </div>
                    <div className="fade-in-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="premium-glass-panel" style={{
                                padding: '40px 24px',
                                textAlign: 'center',
                                borderRadius: '24px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60px', height: '20px', background: `${accentColor}`, filter: 'blur(30px)' }}></div>
                                <div style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 800,
                                    color: 'white',
                                    marginBottom: '8px',
                                    letterSpacing: '-0.02em'
                                }}>{T(`${slug}.result${i}.value`)}</div>
                                <div style={{
                                    fontSize: '0.9rem',
                                    color: 'rgba(255,255,255,0.6)',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>{T(`${slug}.result${i}.label`)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Challenge & Solution */}
            <section className="section relative">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
                        <div className="premium-glass-panel fade-in-up" style={{ padding: '48px', borderRadius: '32px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>{T('cs.challenge')}</h2>
                            </div>
                            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>{T(`${slug}.challenge`)}</p>
                        </div>
                        <div className="premium-glass-panel fade-in-up" style={{ padding: '48px', borderRadius: '32px', border: `1px solid ${accentColor}30`, background: `linear-gradient(145deg, ${accentColor}05 0%, rgba(255,255,255,0.01) 100%)` }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>{T('cs.solution')}</h2>
                            </div>
                            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>{T(`${slug}.solution`)}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technologies */}
            <section className="section">
                <div className="container text-center">
                    <h2 className="section-title fade-in-up" style={{ fontSize: '2rem', marginBottom: '40px' }}>{T('cs.techs')}</h2>
                    <div className="fade-in-up" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                        {techs.map((tech) => (
                            <span key={tech} className="premium-glass-panel" style={{
                                padding: '12px 24px',
                                borderRadius: '16px',
                                fontSize: '1rem',
                                fontWeight: 700,
                                letterSpacing: '0.05em',
                                color: 'white',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                            }}>{tech}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium CTA */}
            <section className="relative overflow-hidden" style={{ padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: cs.gradient, opacity: 0.15, zIndex: 0 }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '100vw', background: `radial-gradient(circle, ${accentColor}30 0%, transparent 60%)`, filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

                <div className="container relative z-10 text-center fade-in-up">
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '48px', letterSpacing: '-0.02em', color: 'white' }}>{T('cs.cta.title')}</h2>
                    <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary" style={{ padding: '20px 56px', fontSize: '1.2rem', borderRadius: '999px', fontWeight: 700, letterSpacing: '0.05em', background: 'white', color: '#050507', boxShadow: `0 20px 40px ${accentColor}40`, transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', border: 'none', cursor: 'pointer' }}>
                        {T('cs.cta.button')}
                    </button>
                </div>
            </section>

            <section style={{ padding: '40px 0 80px', background: 'transparent', textAlign: 'center' }}>
                <a href="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, color: 'white', textDecoration: 'none', fontWeight: 700 }}>
                    {T('cs.otherCases')}
                </a>
            </section>

            <ContactSection />
            <Footer />
        </div>
    );
}
