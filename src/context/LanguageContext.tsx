'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Lang, t } from '@/translations';

interface LanguageContextType {
    lang: Lang;
    switchLang: (newLang: Lang) => void;
    T: (key: string, params?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Lang>('pl');

    const detectUserLanguage = useCallback(async () => {
        try {
            // 1. Browser Preference (Fastest Fallback)
            const browserLang = navigator.language.split('-')[0];
            let detected: Lang = 'en';

            if (browserLang === 'pl') detected = 'pl';
            else if (browserLang === 'de') detected = 'de';
            else if (browserLang === 'es') detected = 'es';
            else if (browserLang === 'ar') detected = 'ar';
            else if (browserLang === 'en') detected = 'en';

            // Set initial guess from browser to avoid layout shift
            setLang(detected);
            document.documentElement.lang = detected;
            document.documentElement.dir = detected === 'ar' ? 'rtl' : 'ltr';

            // 2. IP Geolocation (Refinement for Silesian / Proper Location)
            const res = await fetch('https://ipapi.co/json/');
            if (!res.ok) throw new Error('IP API Error');
            const data = await res.json();

            if (data && data.country_code) {
                const country = data.country_code.toUpperCase();
                const region = (data.region || '').toLowerCase();

                let geoLang: Lang = detected;

                // Priority Logic:
                // 1. Silesia Region -> 'szl' (Overrides 'pl')
                if (country === 'PL') {
                    if (region.includes('silesia') || region.includes('śląsk') || region.includes('slask')) {
                        geoLang = 'szl';
                    } else {
                        geoLang = 'pl';
                    }
                }
                // 2. If browser language is NOT supported, use Country language
                else if (['DE', 'AT', 'CH'].includes(country)) {
                    if (!['pl', 'en', 'es', 'ar'].includes(browserLang)) geoLang = 'de';
                }
                else if (['ES', 'MX', 'AR', 'CO', 'PE', 'CL', 'VE', 'EC', 'GT', 'CU'].includes(country)) {
                    if (!['pl', 'en', 'de', 'ar'].includes(browserLang)) geoLang = 'es';
                }
                else if (['SA', 'AE', 'EG', 'QA', 'KW', 'OM', 'BH', 'JO', 'LB', 'IQ'].includes(country)) {
                    if (!['pl', 'en', 'de', 'es'].includes(browserLang)) geoLang = 'ar';
                }
                else if (['GB', 'US', 'CA', 'AU', 'NZ', 'IE'].includes(country)) {
                    if (!['pl', 'de', 'es', 'ar'].includes(browserLang)) geoLang = 'en';
                }

                // Apply update if different
                if (geoLang !== detected) {
                    setLang(geoLang);
                    document.documentElement.lang = geoLang;
                    document.documentElement.dir = geoLang === 'ar' ? 'rtl' : 'ltr';
                }
            }
        } catch (error) {
            console.warn('Language auto-detect failed:', error);
        }
    }, []);

    useEffect(() => {
        const savedLang = localStorage.getItem('ecm-lang') as Lang;
        if (savedLang && ['pl', 'en', 'de', 'szl', 'es', 'ar'].includes(savedLang)) {
            setLang(savedLang);
            document.documentElement.lang = savedLang;
            document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
        } else {
            detectUserLanguage();
        }
    }, [detectUserLanguage]);

    const switchLang = useCallback((newLang: Lang) => {
        setLang(newLang);
        localStorage.setItem('ecm-lang', newLang);
        document.documentElement.lang = newLang;
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    }, []);

    const T = useCallback((key: string, params?: Record<string, any>) => t(lang, key, params), [lang]);

    return (
        <LanguageContext.Provider value={{ lang, switchLang, T }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
