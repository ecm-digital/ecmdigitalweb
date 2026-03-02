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

    // On subpages, anchor links like #services should resolve to /#services
    const anchor = (hash: string) => isHomepage ? hash : `/${hash}`;

    return (
        <nav className={`navbar-floating${scrolled ? ' scrolled' : ''}`}>
            <a href="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center' }}>
                <Image src="/assets/images/ecm-logo.svg" alt="ECM Digital" className="logo-anim" width={28} height={28} style={{ height: '28px', width: 'auto', marginInlineEnd: '10px' }} />
                <span style={{ fontSize: '1.1rem' }}>{settings?.agencyName?.split(' ')[0] || 'ECM'} <span style={{ opacity: 0.7 }}>{settings?.agencyName?.split(' ')[1] || 'Digital'}</span></span>
            </a>

            <div className="navbar-links-container" style={{ marginInlineStart: 'auto', marginInlineEnd: '24px' }}>
                <ul className={`navbar-links${mobileMenuOpen ? ' open' : ''}`} style={{ display: 'flex', gap: '20px', fontSize: '0.9rem' }}>
                    <li><a href={anchor('#services')} onClick={() => setMobileMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.services')}</a></li>
                    <li><a href="/pricing" onClick={() => setMobileMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>Pricing</a></li>
                    <li><a href="/portfolio" onClick={() => setMobileMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.caseStudies')}</a></li>
                    <li><a href="/blog" onClick={() => setMobileMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.blog')}</a></li>
                    <li><a href="/wiedza" onClick={() => setMobileMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.knowledgeAI')}</a></li>
                    <li><a href="/login" onClick={() => setMobileMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.portal')}</a></li>
                    <li><a href={anchor('#contact')} onClick={() => setMobileMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}>{T('nav.contact')}</a></li>
                </ul>
            </div>

            <div className="nav-controls" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="lang-switcher" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '999px', padding: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {(['pl', 'szl', 'en', 'de', 'es', 'ar'] as Lang[]).map(l => {
                        const label = l === 'szl' ? 'ŚL' : l.toUpperCase();
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
                                {label}
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
                    setMobileMenuOpen(false);
                    trackCTAClick('MainCTA', 'Navbar');
                }}>{T('nav.cta')}</a>
            </div>

            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu" style={{ marginInlineStart: '16px', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>
                ☰
            </button>
        </nav>
    );
}
