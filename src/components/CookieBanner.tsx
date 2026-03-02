'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);
    const { T } = useLanguage();

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setShowBanner(false);
        window.location.reload(); // Reload to activate tracking
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-8 left-8 right-8 z-[9999] animate-fade-in-up">
            <div className="premium-glass-panel p-6 md:p-8 rounded-3xl shadow-2xl border border-white/20 flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
                <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">{T('cookie.title')}</h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                        {T('cookie.desc')} <a href="/privacy" className="text-brand-accent underline">{T('cookie.privacy')}</a>.
                    </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button
                        onClick={handleDecline}
                        className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                    >
                        {T('cookie.decline')}
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-brand-accent hover:text-white transition-all text-sm shadow-xl shadow-white/5"
                    >
                        {T('cookie.accept')}
                    </button>
                </div>
            </div>
            <style jsx>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
