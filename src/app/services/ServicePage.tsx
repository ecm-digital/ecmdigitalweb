'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { services as staticServices } from './serviceData';
import { st } from './serviceTranslations';
import ContactSection from '@/components/ContactSection';
import { getAgencyService, ServiceData } from '@/lib/firestoreService';

export default function ServicePage({ serviceKey }: { serviceKey: string }) {
    const { lang } = useLanguage();
    const [dynamicService, setDynamicService] = useState<ServiceData | null>(null);
    const [loading, setLoading] = useState(true);

    const staticService = staticServices[serviceKey];

    // T function that delegates to dynamic or static translations
    const T = (key: string) => {
        if (dynamicService?.translations) {
            const l = lang as 'pl' | 'en';
            const trans = dynamicService.translations[l] || dynamicService.translations.pl;

            if (key.includes('features.')) {
                const idx = parseInt(key.split('.')[1]) - 1;
                return trans.features[idx] || st(lang, key);
            }
            if (key.endsWith('.title')) return trans.title;
            if (key.endsWith('.subtitle')) return trans.subtitle;
            if (key.endsWith('.long')) return trans.long;
            if (key.endsWith('.price')) return dynamicService.price;
        }
        return st(lang, key);
    };

    useEffect(() => {
        const fetchDynamic = async () => {
            try {
                const data = await getAgencyService(serviceKey);
                if (data) setDynamicService(data);
            } catch (error) {
                console.warn('Could not load dynamic service data, using fallback.', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDynamic();

        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [serviceKey]);

    if (!staticService && !dynamicService) return <div>Service not found</div>;

    // Use dynamic data if available, otherwise static
    const displayIcon = dynamicService?.icon || staticService?.icon;
    const displayGradient = dynamicService?.gradient || staticService?.gradient;
    const displayTechs = dynamicService?.techs || staticService?.techs || [];
    const accentColor = displayGradient.match(/#([0-9a-fA-F]{6})/)?.[0] || '#3b82f6';

    return (
        <>
            <div className="scroll-progress-bar" />
            <Navbar />

            {/* Premium Hero */}
            <section className="relative overflow-hidden" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', paddingTop: '160px', paddingBottom: '80px', background: 'var(--brand-primary)' }}>
                <div style={{ position: 'absolute', top: '10%', left: '20%', width: '40vw', height: '40vw', background: `radial-gradient(circle, ${accentColor}25 0%, transparent 70%)`, filter: 'blur(80px)', zIndex: 0, animation: 'float 10s infinite alternate', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-20%', right: '10%', width: '30vw', height: '30vw', background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`, filter: 'blur(100px)', zIndex: 0, animation: 'float 14s infinite alternate-reverse', pointerEvents: 'none' }} />

                <div className="container relative z-10">
                    <div className="fade-in-up" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{
                            fontSize: '4rem', width: '100px', height: '100px', margin: '0 auto 32px',
                            background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))`,
                            border: `1px solid rgba(255,255,255,0.1)`,
                            boxShadow: `0 0 30px ${accentColor}40`,
                            borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(10px)'
                        }}>
                            {displayIcon}
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px' }}>
                            {T(`${serviceKey}.title`)}
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '32px' }}>
                            {T(`${serviceKey}.subtitle`)}
                        </p>

                        <div style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 24px', background: `${accentColor}15`, border: `1px solid ${accentColor}30`, borderRadius: '999px', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
                            {T(`${serviceKey}.price`)}
                        </div>
                    </div>
                </div>
            </section>

            {/* Description & Process */}
            <section className="section relative">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px' }}>
                        <div className="fade-in-up" style={{ gridColumn: 'span 12', gridArea: 'auto/span 7' }}>
                            <div className="premium-glass-panel" style={{ padding: '48px', borderRadius: '32px', height: '100%' }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: '24px', color: 'white' }}>O usłudze</h2>
                                <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                                    {T(`${serviceKey}.long`)}
                                </p>
                            </div>
                        </div>

                        <div className="fade-in-up" style={{ gridColumn: 'span 12', gridArea: 'auto/span 5', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', paddingLeft: '16px' }}>{st(lang, 'process.title')}</h3>
                            {[1, 2, 3, 4].map((idx) => (
                                <div key={idx} className="premium-glass-panel" style={{
                                    padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px', transitionDelay: `${idx * 0.1}s`
                                }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: accentColor }}>0{idx}.</span>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>{st(lang, `process.step${idx}`)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Glass Bento */}
            <section className="section bg-grid relative" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to bottom, transparent, rgba(5,5,7,0.8))' }}>
                <div className="container">
                    <div className="section-header fade-in-up">
                        <span className="section-label" style={{ padding: '8px 16px', background: `${accentColor}15`, color: accentColor, borderRadius: '999px', border: `1px solid ${accentColor}30` }}>Odkryj</span>
                        <h2 className="section-title">{st(lang, 'features.title')}</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="premium-glass-panel fade-in-up" style={{ padding: '32px', borderRadius: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start', animationDelay: `${i * 0.1}s` }}>
                                <div style={{
                                    minWidth: '32px', height: '32px', borderRadius: '50%',
                                    background: `${accentColor}20`, color: accentColor,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '14px', fontWeight: 'bold', border: `1px solid ${accentColor}50`
                                }}>✓</div>
                                <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                                    {T(`${serviceKey}.features.${i}`)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technologies */}
            <section className="section">
                <div className="container text-center">
                    <h2 className="section-title fade-in-up" style={{ fontSize: '2rem', marginBottom: '40px' }}>{st(lang, 'techs.title')}</h2>
                    <div className="fade-in-up" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                        {displayTechs.map((tech: string) => (
                            <span key={tech} className="premium-glass-panel" style={{
                                padding: '12px 24px', borderRadius: '16px', fontSize: '1rem',
                                fontWeight: 700, letterSpacing: '0.05em', color: 'white',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                            }}>{tech}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium CTA */}
            <section className="relative overflow-hidden" style={{ padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: displayGradient, opacity: 0.15, zIndex: 0 }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '100vw', background: `radial-gradient(circle, ${accentColor}30 0%, transparent 60%)`, filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

                <div className="container relative z-10 text-center fade-in-up">
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.02em', color: 'white' }}>{st(lang, 'cta.title')}</h2>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>{st(lang, 'cta.subtitle')}</p>
                    <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary" style={{ padding: '20px 56px', fontSize: '1.2rem', borderRadius: '999px', fontWeight: 700, letterSpacing: '0.05em', background: 'white', color: '#050507', boxShadow: `0 20px 40px ${accentColor}40`, transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', border: 'none', cursor: 'pointer' }}>
                        {st(lang, 'cta.button')}
                    </button>
                </div>
            </section>

            <ContactSection />
            <Footer />
        </>
    );
}
