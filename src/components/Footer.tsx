'use client';

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAgency } from '@/context/AgencyContext';

export default function Footer() {
    const { T } = useLanguage();
    const { settings } = useAgency();

    return (
        <footer className="footer relative overflow-hidden" style={{ background: 'var(--surface-1)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '100px 0 40px' }}>
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '100vw', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 60%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />

            <div className="container relative z-10">
                <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '80px' }}>
                    <div className="footer-brand-col">
                        <div className="footer-brand" style={{ marginBottom: '24px', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'white' }}>
                            {settings?.logoUrl ? (
                                <img src={settings.logoUrl} alt={settings.agencyName} style={{ height: '40px', marginBottom: '16px', display: 'block', filter: 'drop-shadow(0 0 10px rgba(59,130,246,0.3))' }} />
                            ) : null}
                            {settings?.agencyName?.split(' ')[0] || 'ECM'}<span style={{ color: '#3b82f6' }}>{settings?.agencyName?.split(' ')[1] || 'Digital'}</span>
                        </div>
                        <p className="footer-desc" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: '1.05rem', maxWidth: '400px' }}>
                            {settings?.tagline || T('footer.desc')}
                        </p>
                    </div>
                    <div>
                        <h5 style={{ fontSize: '1.2rem', marginBottom: '24px', color: 'white' }}>{T('footer.services')}</h5>
                        <ul className="footer-links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li><a href="#services" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('services.ai.title')}</a></li>
                            <li><a href="#services" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('services.web.title')}</a></li>
                            <li><a href="#services" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('services.shop.title')}</a></li>
                            <li><a href="#services" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('services.mobile.title')}</a></li>
                            <li><a href="#services" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('services.auto.title')}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 style={{ fontSize: '1.2rem', marginBottom: '24px', color: 'white' }}>{T('footer.company')}</h5>
                        <ul className="footer-links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li><a href="#about" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('nav.about')}</a></li>
                            <li><a href="#team" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('nav.team')}</a></li>
                            <li><a href="#cases" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('nav.caseStudies')}</a></li>
                            <li><a href="#contact" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('nav.contact')}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 style={{ fontSize: '1.2rem', marginBottom: '24px', color: 'white' }}>{T('footer.legal')}</h5>
                        <ul className="footer-links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li><a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('footer.privacy')}</a></li>
                            <li><a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('footer.terms')}</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                    <div className="footer-copyright">{T('footer.copyright')}</div>
                    <div className="footer-legal">
                        <span className="footer-legal-item">{T('footer.entity')}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
