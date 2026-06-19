'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { services } from './serviceData';
import { st } from './serviceTranslations';
import Link from 'next/link';

const tPage: Record<string, Record<string, string>> = {
    pl: {
        'services.hero.label': '🛠️ Oferta ECM Digital',
        'services.hero.title': 'Usługi AI & Software',
        'services.hero.subtitle': 'Wdrażamy zaawansowaną sztuczną inteligencję, automatyzujemy powtarzalne procesy i budujemy dedykowane oprogramowanie.',
        'services.details': 'Szczegóły usługi',
        'services.priceLabel': 'Wycena:',
        'services.techs': 'Główne technologie:',
        'services.cta.title': 'Gotowy na transformację cyfrową?',
        'services.cta.subtitle': 'Porozmawiajmy o wdrożeniu AI i automatyzacji w Twoim biznesie. Umów bezpłatną 30-minutową konsultację.',
        'services.cta.button': 'Zarezerwuj bezpłatną konsultację'
    },
    en: {
        'services.hero.label': '🛠️ ECM Digital Offer',
        'services.hero.title': 'AI & Software Services',
        'services.hero.subtitle': 'We implement advanced artificial intelligence, automate repetitive workflows, and build custom software.',
        'services.details': 'Service details',
        'services.priceLabel': 'Pricing:',
        'services.techs': 'Core technologies:',
        'services.cta.title': 'Ready for digital transformation?',
        'services.cta.subtitle': 'Let\'s talk about implementing AI and automation in your business. Book a free 30-minute consultation.',
        'services.cta.button': 'Book a free consultation'
    }
};

export default function ServicesPage() {
    const { lang } = useLanguage();

    const tp = (key: string): string => {
        return tPage[lang]?.[key] || tPage.en[key] || tPage.pl[key] || key;
    };

    return (
        <div className="lp-wrapper">
            <Navbar />

            {/* Hero Section */}
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
                            {tp('services.hero.label')}
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                            fontWeight: 800,
                            marginBottom: '28px',
                            letterSpacing: '-0.04em',
                            lineHeight: 1.1,
                            textAlign: 'center'
                        }}>
                            {tp('services.hero.title')}
                        </h1>
                        <p style={{
                            fontSize: '1.25rem',
                            color: 'rgba(255,255,255,0.6)',
                            maxWidth: '680px',
                            margin: '0 auto',
                            lineHeight: 1.7,
                            textAlign: 'center'
                        }}>
                            {tp('services.hero.subtitle')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="section bg-grid relative" style={{
                borderTop: '1px solid rgba(255,255,255,0.05)',
                background: 'transparent',
                padding: '80px 0 120px'
            }}>
                <div className="container relative z-10">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
                        gap: '32px',
                        justifyContent: 'center'
                    }}>
                        {Object.values(services).map((item, idx) => {
                            const title = st(lang, `${item.slug}.title`);
                            const subtitle = st(lang, `${item.slug}.subtitle`);
                            const price = st(lang, `${item.slug}.price`);

                            return (
                                <div key={item.slug} className="premium-glass-panel premium-card-glow fade-in-up" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '44px',
                                    borderRadius: '32px',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    background: 'rgba(255,255,255,0.02)',
                                    animationDelay: `${idx * 0.05}s`
                                }}>
                                    {/* Icon & Title */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
                                        <div style={{
                                            width: '56px', height: '56px', borderRadius: '16px',
                                            background: item.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.8rem', boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                                        }}>
                                            {item.icon}
                                        </div>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>
                                            {title}
                                        </h3>
                                    </div>

                                    {/* Description */}
                                    <p style={{ fontSize: '0.98rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '28px', flexGrow: 1 }}>
                                        {subtitle}
                                    </p>

                                    {/* Technologies */}
                                    <div style={{ marginBottom: '28px' }}>
                                        <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', fontWeight: 700 }}>
                                            {tp('services.techs')}
                                        </h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {item.techs.slice(0, 4).map((tech) => (
                                                <span key={tech} style={{
                                                    fontSize: '0.78rem',
                                                    padding: '6px 12px',
                                                    borderRadius: '8px',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    color: 'rgba(255,255,255,0.8)',
                                                    fontWeight: 500
                                                }}>
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price and Details link */}
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                                {tp('services.priceLabel')}
                                            </div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginTop: '2px' }}>
                                                {price}
                                            </div>
                                        </div>

                                        <Link href={`/services/${item.slug}`} className="btn-secondary premium-button-shine" style={{
                                            padding: '12px 20px', fontSize: '0.85rem', borderRadius: '12px', fontWeight: 700
                                        }}>
                                            {tp('services.details')} →
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="section relative" style={{
                borderTop: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.01)',
                padding: '100px 20px'
            }}>
                <div className="container relative z-10">
                    <div className="premium-glass-panel" style={{
                        maxWidth: '900px',
                        margin: '0 auto',
                        padding: '60px 40px',
                        borderRadius: '32px',
                        textAlign: 'center',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
                    }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, color: 'white', marginBottom: '16px', letterSpacing: '-0.03em' }}>
                            {tp('services.cta.title')}
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 36px', lineHeight: 1.6 }}>
                            {tp('services.cta.subtitle')}
                        </p>
                        <a href="/kontakt" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1rem', display: 'inline-block', textDecoration: 'none' }}>
                            {tp('services.cta.button')}
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
