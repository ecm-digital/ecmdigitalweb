'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
    const { T } = useLanguage();

    return (
        <div className="lp-wrapper">
            <Navbar />
            <main className="container py-32">
                <div className="premium-glass-panel p-12 rounded-3xl max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 premium-text-gradient">{T('privacy.title')}</h1>
                    <div className="prose prose-invert max-w-none text-white/70 leading-relaxed">
                        <p className="mb-4">{T('privacy.intro')}</p>

                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">{T('privacy.s1.title')}</h2>
                        <p className="mb-4">{T('privacy.s1.text')}</p>

                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">{T('privacy.s2.title')}</h2>
                        <p className="mb-4">{T('privacy.s2.text')}</p>

                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">{T('privacy.s3.title')}</h2>
                        <p className="mb-4">{T('privacy.s3.text')}</p>

                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">{T('privacy.s4.title')}</h2>
                        <p className="mb-4">{T('privacy.s4.text')}</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
