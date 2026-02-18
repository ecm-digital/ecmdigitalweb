'use client';

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAgency } from '@/context/AgencyContext';
import { Lang } from "@/translations";
import { trackCTAClick } from "@/lib/ga";

export default function Navbar() {
    const { T, lang, switchLang } = useLanguage();
    const { settings } = useAgency();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
            <div className="container navbar-inner">
                <a href="/" className="navbar-logo">
                    {settings?.logoUrl ? (
                        <img src={settings.logoUrl} alt={settings.agencyName} style={{ height: '32px', marginRight: '8px' }} />
                    ) : null}
                    {settings?.agencyName?.split(' ')[0] || 'ECM'}<span>{settings?.agencyName?.split(' ')[1] || 'Digital'}</span>
                </a>

                <ul className={`navbar-links${mobileMenuOpen ? ' open' : ''}`}>
                    <li><a href="#services" onClick={() => setMobileMenuOpen(false)}>{T('nav.services')}</a></li>
                    <li><a href="#cases" onClick={() => setMobileMenuOpen(false)}>{T('nav.caseStudies')}</a></li>
                    <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>{T('nav.about')}</a></li>
                    <li><a href="#team" onClick={() => setMobileMenuOpen(false)}>{T('nav.team')}</a></li>
                    <li><a href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</a></li>
                    <li><a href="/login" onClick={() => setMobileMenuOpen(false)}>{T('nav.portal')}</a></li>
                    <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>{T('nav.contact')}</a></li>
                    <li>
                        <div className="nav-controls">
                            <div className="lang-switcher">
                                {(['pl', 'en', 'de'] as Lang[]).map(l => (
                                    <button key={l} className={lang === l ? 'active' : ''} onClick={() => switchLang(l)}>
                                        {l.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </li>
                    <li><a href="#contact" className="navbar-cta" onClick={() => {
                        setMobileMenuOpen(false);
                        trackCTAClick('MainCTA', 'Navbar');
                    }}>{T('nav.cta')}</a></li>
                </ul>

                <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </nav>
    );
}
