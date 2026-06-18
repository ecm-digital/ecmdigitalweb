'use client';

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAgency } from '@/context/AgencyContext';
import { Lang } from "@/translations";
import { trackCTAClick } from "@/lib/ga";
import Image from "next/image";

export default function Navbar() {
    const { T, lang, switchLang } = useLanguage();
    const { settings } = useAgency();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const isHomepage = pathname === '/' || pathname === '';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // On subpages, anchor links like #services should resolve to /#services
    const anchor = (hash: string) => isHomepage ? hash : `/${hash}`;

    return (
        <nav className={`navbar-floating${scrolled ? ' scrolled' : ''}`}>
            <a href="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <Image src="/assets/images/ecm-logo.svg" alt="ECM Digital" className="logo-anim" width={28} height={28} style={{ height: '28px', width: 'auto', marginInlineEnd: '10px' }} />
                <span style={{ fontSize: '1.1rem' }}>{settings?.agencyName?.split(' ')[0] || 'ECM'} <span style={{ opacity: 0.7 }}>{settings?.agencyName?.split(' ')[1] || 'Digital'}</span></span>
            </a>

            {/* Desktop links - hidden below 1024px via CSS */}
            <div className="navbar-links-container" style={{ marginInlineStart: 'auto', marginInlineEnd: '32px' }}>
                <ul className="navbar-links" style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', listStyle: 'none', margin: 0, padding: 0 }}>
                    <li><a href={anchor('#services')} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.services')}</a></li>
                    <li><a href="/wycena" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.pricing')}</a></li>
                    <li><a href="/portfolio" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.caseStudies')}</a></li>
                    <li><a href="/blog" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.blog')}</a></li>
                    <li><a href="/wiedza" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.knowledgeAI')}</a></li>
                    <li><a href="/login" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.portal')}</a></li>
                    <li><a href={anchor('#contact')} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.contact')}</a></li>
                </ul>
            </div>

            <div className="nav-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="lang-switcher" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '999px', padding: '2px', border: '1px solid rgba(255,255,255,0.05)', display: 'inline-flex' }}>
                    {(['pl', 'en', 'de', 'es'] as Lang[]).map(l => {
                        return (
                            <button key={l} className={lang === l ? 'active' : ''} onClick={() => switchLang(l)} style={{
                                background: lang === l ? 'white' : 'transparent',
                                color: lang === l ? 'black' : 'rgba(255,255,255,0.4)',
                                border: 'none',
                                padding: '3px 8px',
                                borderRadius: '999px',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}>
                                {l.toUpperCase()}
                            </button>
                        );
                    })}
                </div>
                <div className="navbar-socials-desktop" style={{ display: 'inline-flex', gap: '6px' }}>
                    <a href="https://www.linkedin.com/company/ecm-digital/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'all 0.3s' }} onMouseOver={e => { e.currentTarget.style.background = '#0a66c2'; e.currentTarget.style.color = 'white'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}>
                        <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                    </a>
                    <a href="https://www.facebook.com/ecmdigital" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'all 0.3s' }} onMouseOver={e => { e.currentTarget.style.background = '#1877f2'; e.currentTarget.style.color = 'white'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}>
                        <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </a>
                </div>
                <a href={anchor('#contact')} className="navbar-cta premium-button-shine" style={{
                    background: 'white',
                    color: 'black',
                    padding: '8px 20px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(255,255,255,0.1)'
                }} onClick={() => {
                    trackCTAClick('MainCTA', 'Navbar');
                }}>{T('nav.cta')}</a>
            </div>

            {/* Hamburger button - visible on mobile only */}
            <button
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
                aria-expanded={mobileMenuOpen}
                style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', padding: '8px', lineHeight: 1 }}
            >
                {mobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* Mobile dropdown menu - direct child of nav so it works even when desktop container is hidden */}
            <div className={`mobile-nav-dropdown${mobileMenuOpen ? ' open' : ''}`}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li><a href={anchor('#services')} onClick={() => setMobileMenuOpen(false)}>{T('nav.services')}</a></li>
                    <li><a href="/wycena" onClick={() => setMobileMenuOpen(false)}>{T('nav.pricing')}</a></li>
                    <li><a href="/portfolio" onClick={() => setMobileMenuOpen(false)}>{T('nav.caseStudies')}</a></li>
                    <li><a href="/blog" onClick={() => setMobileMenuOpen(false)}>{T('nav.blog')}</a></li>
                    <li><a href="/wiedza" onClick={() => setMobileMenuOpen(false)}>{T('nav.knowledgeAI')}</a></li>
                    <li><a href="/login" onClick={() => setMobileMenuOpen(false)}>{T('nav.portal')}</a></li>
                    <li><a href={anchor('#contact')} onClick={() => setMobileMenuOpen(false)}>{T('nav.contact')}</a></li>
                </ul>
                <div className="mobile-nav-footer">
                    <div className="mobile-nav-socials" style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '20px' }}>
                        <a href="https://www.linkedin.com/company/ecm-digital/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none' }}>
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                        </a>
                        <a href="https://www.facebook.com/ecmdigital" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none' }}>
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '16px' }}>
                        {(['pl', 'szl', 'en', 'de', 'es', 'ar'] as Lang[]).map(l => {
                            const label = l === 'szl' ? 'ŚL' : l.toUpperCase();
                            return (
                                <button key={l} onClick={() => { switchLang(l); setMobileMenuOpen(false); }} style={{
                                    background: lang === l ? 'white' : 'rgba(255,255,255,0.08)',
                                    color: lang === l ? 'black' : 'rgba(255,255,255,0.6)',
                                    border: lang === l ? 'none' : '1px solid rgba(255,255,255,0.15)',
                                    padding: '6px 14px',
                                    borderRadius: '999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}>
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                    <a href={anchor('#contact')} onClick={() => { setMobileMenuOpen(false); trackCTAClick('MainCTA', 'MobileNav'); }} style={{
                        display: 'block',
                        background: 'white',
                        color: 'black',
                        padding: '14px 24px',
                        borderRadius: '999px',
                        fontWeight: 700,
                        fontSize: '1rem',
                        textDecoration: 'none',
                        textAlign: 'center',
                    }}>{T('nav.cta')}</a>
                </div>
            </div>
        </nav>
    );
}
