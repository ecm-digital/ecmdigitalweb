'use client';

import React, { useEffect } from "react";
import Script from "next/script";
import { useLanguage } from "@/context/LanguageContext";
import { trackCTAClick } from '@/lib/ga';

export default function ContactSection() {
    const { T } = useLanguage();
    const sectionRef = React.useRef<HTMLElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        const elements = sectionRef.current.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up');
        elements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} id="contact" className="section" style={{ background: 'var(--surface-1)' }}>
            <div className="container">
                <div className="section-header fade-in">
                    <div className="section-label">● {T('contact.label')}</div>
                    <h2 className="section-title">{T('contact.title')}</h2>
                    <p className="section-subtitle">{T('contact.subtitle')}</p>
                </div>
                <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '32px', alignItems: 'flex-start' }}>
                    <div className="contact-info premium-glass-panel fade-in-left" style={{ padding: 'clamp(24px, 5vw, 48px)', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }}></div>
                        <h3 style={{ fontSize: '2rem', marginBottom: '32px', color: 'white' }}>{T('contact.callUs')}</h3>
                        <div className="contact-methods" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <a href="mailto:hello@ecm-digital.com" className="contact-method" onClick={() => trackCTAClick('Email', 'ContactSection')} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', textDecoration: 'none', color: 'inherit' }}>
                                <div className="contact-method-icon" style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>✉</div>
                                <div>
                                    <h4 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '4px' }}>{T('contact.email.title')}</h4>
                                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>{T('contact.email.value')}</p>
                                </div>
                            </a>
                            <a href="tel:+48517303400" className="contact-method" onClick={() => trackCTAClick('Phone', 'ContactSection')} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', textDecoration: 'none', color: 'inherit' }}>
                                <div className="contact-method-icon" style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>📞</div>
                                <div>
                                    <h4 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '4px' }}>{T('contact.phone.title')}</h4>
                                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>{T('contact.phone.value')}</p>
                                </div>
                            </a>
                            <div className="contact-method" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div className="contact-method-icon" style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>🕐</div>
                                <div>
                                    <h4 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '4px' }}>{T('contact.hours.title')}</h4>
                                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>{T('contact.hours.value')}</p>
                                </div>
                            </div>
                            <a href="https://maps.app.goo.gl/QNFQFWqBxsWEkNETA" target="_blank" rel="noopener noreferrer" className="contact-method" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', textDecoration: 'none', color: 'inherit' }}>
                                <div className="contact-method-icon" style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid rgba(236, 72, 153, 0.2)' }}>📍</div>
                                <div>
                                    <h4 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '4px' }}>{T('contact.location')}</h4>
                                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>{T('contact.locationValue')}</p>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="contact-form-wrapper premium-glass-panel fade-in-right" style={{ padding: 'clamp(24px, 5vw, 48px)', borderRadius: '32px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', boxShadow: '0 0 60px rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }}></div>
                        <h3 style={{ fontSize: '2rem', marginBottom: '32px', color: 'white', position: 'relative', zIndex: 1 }}>{T('contact.form.title')}</h3>
                        <div className="hs-form-frame" data-region="eu1" data-form-id="fac0d462-6388-49ef-86ea-a34ee139ddb2" data-portal-id="145940599" style={{ position: 'relative', zIndex: 1 }}></div>
                        <Script src="https://js-eu1.hsforms.net/forms/embed/145940599.js" defer />
                    </div>
                </div>
                <div className="map-embed fade-in" style={{ marginTop: '48px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.3447!2d20.9901627!3d52.2326275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecd1bed75d6e5%3A0x7582fe74892c4056!2sECM+Digital!5e0!3m2!1spl!2spl!4v1715854800000!5m2!1spl!2spl"
                        width="100%"
                        height="350"
                        style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.1) brightness(0.8)' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="ECM Digital - Location"
                    />
                </div>
            </div>
        </section>
    );
}


