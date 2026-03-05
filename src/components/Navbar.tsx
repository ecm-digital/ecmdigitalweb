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
            <div className="navbar-links-container" style={{ marginInlineStart: 'auto', marginInlineEnd: '24px' }}>
                <ul className="navbar-links" style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', listStyle: 'none', margin: 0, padding: 0 }}>
                    <li><a href={anchor('#services')} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.services')}</a></li>
                    <li><a href="/pricing" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>Pricing</a></li>
                    <li><a href="/portfolio" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.caseStudies')}</a></li>
                    <li><a href="/blog" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.blog')}</a></li>
                    <li><a href="/wiedza" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.knowledgeAI')}</a></li>
                    <li><a href="/login" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.portal')}</a></li>
                    <li><a href={anchor('#contact')} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.contact')}</a></li>
                </ul>
            </div>

            <div className="nav-controls" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginInlineStart: 'auto' }}>
                <div className="lang-switcher" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '999px', padding: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {(['pl', 'en', 'de', 'es'] as Lang[]).map(l => {
                        return (
                            <button key={l} className={lang === l ? 'active' : ''} onClick={() => switchLang(l)} style={{
                                background: lang === l ? 'white' : 'transparent',
                                color: lang === l ? 'black' : 'rgba(255,255,255,0.4)',
                                border: 'none',
                                padding: '4px 10px',
                                borderRadius: '999px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}>
                                {l.toUpperCase()}
                            </button>
                        );
                    })}
                </div>
                <a href={anchor('#contact')} className="navbar-cta premium-button-shine" style={{
                    background: 'white',
                    color: 'black',
                    padding: '12px 28px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
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
                    <li><a href="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a></li>
                    <li><a href="/portfolio" onClick={() => setMobileMenuOpen(false)}>{T('nav.caseStudies')}</a></li>
                    <li><a href="/blog" onClick={() => setMobileMenuOpen(false)}>{T('nav.blog')}</a></li>
                    <li><a href="/wiedza" onClick={() => setMobileMenuOpen(false)}>{T('nav.knowledgeAI')}</a></li>
                    <li><a href="/login" onClick={() => setMobileMenuOpen(false)}>{T('nav.portal')}</a></li>
                    <li><a href={anchor('#contact')} onClick={() => setMobileMenuOpen(false)}>{T('nav.contact')}</a></li>
                </ul>
                <div className="mobile-nav-footer">
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
