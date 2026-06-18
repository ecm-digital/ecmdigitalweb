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
                        <div className="footer-socials" style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                            <a href="https://www.linkedin.com/company/ecm-digital/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none', transition: 'all 0.3s' }} onMouseOver={e => { e.currentTarget.style.background = '#0a66c2'; e.currentTarget.style.borderColor = '#0a66c2'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                            </a>
                            <a href="https://www.facebook.com/ecmdigital" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none', transition: 'all 0.3s' }} onMouseOver={e => { e.currentTarget.style.background = '#1877f2'; e.currentTarget.style.borderColor = '#1877f2'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h5 style={{ fontSize: '1.2rem', marginBottom: '24px', color: 'white' }}>{T('footer.services')}</h5>
                        <ul className="footer-links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li><a href="/services/ai-audit" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('services.audit.title')}</a></li>
                            <li><a href="/services/automation" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('services.auto.title')}</a></li>
                            <li><a href="/services/ai-agents" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('services.ai.title')}</a></li>
                            <li><a href="/services/websites" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('services.web.title')}</a></li>
                            <li><a href="/services/ecommerce" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('services.shop.title')}</a></li>
                            <li><a href="/services/mvp" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('services.mvp.title')}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 style={{ fontSize: '1.2rem', marginBottom: '24px', color: 'white' }}>{T('footer.company')}</h5>
                        <ul className="footer-links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li><a href="/#team" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('nav.team')}</a></li>
                            <li><a href="/#cases" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('nav.caseStudies')}</a></li>
                            <li><a href="/blog" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('nav.blog')}</a></li>
                            <li><a href="/wiedza" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('footer.knowledgeBase')}</a></li>
                            <li><a href="/#contact" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('nav.contact')}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 style={{ fontSize: '1.2rem', marginBottom: '24px', color: 'white' }}>{T('footer.legal')}</h5>
                        <ul className="footer-links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li><a href="/privacy" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('footer.privacy')}</a></li>
                            <li><a href="/terms" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{T('footer.terms')}</a></li>
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
