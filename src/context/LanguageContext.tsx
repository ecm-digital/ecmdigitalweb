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
        if (savedLang && (savedLang === 'pl' || savedLang === 'en' || savedLang === 'de')) {
            setLang(savedLang);
            document.documentElement.lang = savedLang;
        }
    }, []);

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
