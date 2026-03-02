'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const faqKeys = [
    { q: 'faq.q6', a: 'faq.a6' },
    { q: 'faq.q7', a: 'faq.a7' },
    { q: 'faq.q8', a: 'faq.a8' },
    { q: 'faq.q9', a: 'faq.a9' },
    { q: 'faq.q10', a: 'faq.a10' },
    { q: 'faq.q11', a: 'faq.a11' },
    { q: 'faq.q12', a: 'faq.a12' },
];

export default function FAQSection() {
    const { T } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="section relative" style={{ padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to bottom, rgba(5,5,7,0.8), transparent)' }}>
            <div className="container relative z-10">
                <div className="section-header fade-in-up text-center w-full max-w-none" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '80px' }}>
                    <span className="section-label" style={{ padding: '10px 24px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '999px', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>
                        ? FAQ
                    </span>
                    <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.03em', fontWeight: 800 }}>{T('faq.sectionTitle')}</h2>
                    <p className="section-subtitle" style={{ maxWidth: '600px', fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)' }}>
                        {T('faq.sectionSubtitle')}
                    </p>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {faqKeys.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <button
                                key={index}
                                className="premium-glass-panel fade-in-up"
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    animationDelay: `${0.1 * index}s`,
                                    padding: isOpen ? 'clamp(20px, 4vw, 32px)' : 'clamp(16px, 3vw, 24px) clamp(20px, 4vw, 32px)',
                                    borderRadius: '24px',
                                    cursor: 'pointer',
                                    border: isOpen ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255,255,255,0.05)',
                                    background: isOpen ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255,255,255,0.02)',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                    display: 'block',
                                    outline: 'none'
                                }}
                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                aria-expanded={isOpen}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: isOpen ? 'white' : 'rgba(255,255,255,0.8)', margin: 0, transition: 'color 0.3s' }}>
                                        {T(faq.q)}
                                    </h3>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: isOpen ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                        color: isOpen ? 'white' : 'rgba(255,255,255,0.5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.4s',
                                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        fontSize: '1.1rem',
                                        lineHeight: 1
                                    }} aria-hidden="true">
                                        ▼
                                    </div>
                                </div>

                                <div style={{
                                    maxHeight: isOpen ? '300px' : '0',
                                    opacity: isOpen ? 1 : 0,
                                    overflow: 'hidden',
                                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                    marginTop: isOpen ? '24px' : '0'
                                }}>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                                        {T(faq.a)}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section >
    );
}
