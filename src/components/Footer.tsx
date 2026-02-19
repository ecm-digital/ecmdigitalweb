'use client';

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAgency } from '@/context/AgencyContext';

export default function Footer() {
    const { T } = useLanguage();
    const { settings } = useAgency();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <div className="footer-brand">
                            {settings?.logoUrl ? (
                                <img src={settings.logoUrl} alt={settings.agencyName} style={{ height: '32px', marginBottom: '16px', display: 'block' }} />
                            ) : null}
                            {settings?.agencyName?.split(' ')[0] || 'ECM'}<span>{settings?.agencyName?.split(' ')[1] || 'Digital'}</span>
                        </div>
                        <p className="footer-desc">{settings?.tagline || T('footer.desc')}</p>
                    </div>
                    <div>
                        <h5>{T('footer.services')}</h5>
                        <ul className="footer-links">
                            <li><a href="#services">{T('services.ai.title')}</a></li>
                            <li><a href="#services">{T('services.web.title')}</a></li>
                            <li><a href="#services">{T('services.shop.title')}</a></li>
                            <li><a href="#services">{T('services.mobile.title')}</a></li>
                            <li><a href="#services">{T('services.auto.title')}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5>{T('footer.company')}</h5>
                        <ul className="footer-links">
                            <li><a href="#about">{T('nav.about')}</a></li>
                            <li><a href="#team">{T('nav.team')}</a></li>
                            <li><a href="#cases">{T('nav.caseStudies')}</a></li>
                            <li><a href="#contact">{T('nav.contact')}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5>{T('footer.legal')}</h5>
                        <ul className="footer-links">
                            <li><a href="#">{T('footer.privacy')}</a></li>
                            <li><a href="#">{T('footer.terms')}</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="footer-copyright">{T('footer.copyright')}</div>
                    <div className="footer-legal">
                        <span className="footer-legal-item">{T('footer.entity')}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
