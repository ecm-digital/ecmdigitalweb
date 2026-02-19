'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Lang, t } from '@/translations';

interface LanguageContextType {
    lang: Lang;
    switchLang: (newLang: Lang) => void;
    T: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Lang>('pl');

    useEffect(() => {
        const savedLang = localStorage.getItem('ecm-lang') as Lang;
        if (savedLang && (['pl', 'en', 'de', 'szl', 'es', 'ar'].includes(savedLang))) {
            setLang(savedLang);
            document.documentElement.lang = savedLang;
        } else {
            // Auto-detect language if no preference validation
            detectUserLanguage();
        }
    }, []);

    const detectUserLanguage = async () => {
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
                // 3. Or if we want to strictly follow location:
                else if (['DE', 'AT', 'CH'].includes(country)) {
                    // Start in German if in DACH region (unless browser is specifically something else supported?)
                    // Let's stick to: If browser is supported, keep it. If not, use Geo.
                    // EXCEPT for Silesia which is a "super-polish" mode.
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
                    // Don't save to localStorage automatically, let user explicitly switch to save preference
                }
            }
        } catch (error) {
            console.warn('Language auto-detect failed:', error);
        }
    };

    const switchLang = useCallback((newLang: Lang) => {
        setLang(newLang);
        localStorage.setItem('ecm-lang', newLang);
        document.documentElement.lang = newLang;
    }, []);

    const T = useCallback((key: string) => t(lang, key), [lang]);

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
