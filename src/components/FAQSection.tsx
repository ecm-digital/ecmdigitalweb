'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const faqData = [
    {
        q: "Jakie korzyści przyniesie mojej firmie wdrożenie Agenta AI?",
        a: "Nasi Agenci AI automatyzują od 60% do 80% powtarzalnych zadań takich jak obsługa klienta, generowanie leadów na stronie czy procesy HR. Dzięki integracji z systemami (np. CRM, ERP) działają 24/7, co pozwala Twojemu zespołowi skupić się na strategicznych celach i docelowo redukuje koszty operacyjne."
    },
    {
        q: "Ile potrwa stworzenie dla mnie dedykowanej strony internetowej lub sklepu?",
        a: "Standardowa strona wizerunkowa (w architekturze MACH lub Next.js) zajmuje nam około 2-4 tygodni. Złożone platformy e-commerce oparte o Shopify Plus lub headless commerce tworzymy zazwyczaj w 6-10 tygodni, koncentrując się na ekstremalnej wydajności i personalizacji UI."
    },
    {
        q: "Czy po zakończeniu tworzenia aplikacji i stron zapewniacie ich utrzymanie?",
        a: "Zdecydowanie tak. Świadczymy pełne wsparcie powdrożeniowe. Monitorujemy stabilność, bezpieczeństwo infrastruktury (najczęściej Google Cloud / Vercel) oraz dbamy o aktualizacje, aby Twój produkt skalował się wraz z Twoim rozwojem."
    },
    {
        q: "Jak wyglądają koszty automatyzacji N8N lub zbudowania MVP?",
        a: "Każdy projekt wyceniamy indywidualnie bazując na złożoności środowiska. Proste flows automatyzacji zaczynają się od niewielkich kwot, a potężne architektury MVP budowane od zera to inwestycje rzędu kilkunastu ułamków tradycyjnych kosztów dzięki wykorzystaniu AI na etapie pisania kodu."
    }
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
                    <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.03em', fontWeight: 800 }}>Mity i Fakty</h2>
                    <p className="section-subtitle" style={{ maxWidth: '600px', fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)' }}>
                        Odpowiedzi na najczęściej zadawane pytania przez liderów wkraczających w cyfrową transformację 2026.
                    </p>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {faqData.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="premium-glass-panel fade-in-up"
                                style={{
                                    animationDelay: `${0.1 * index}s`,
                                    padding: isOpen ? 'clamp(20px, 4vw, 32px)' : 'clamp(16px, 3vw, 24px) clamp(20px, 4vw, 32px)',
                                    borderRadius: '24px',
                                    cursor: 'pointer',
                                    border: isOpen ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255,255,255,0.05)',
                                    background: isOpen ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255,255,255,0.02)',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                onClick={() => setOpenIndex(isOpen ? null : index)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: isOpen ? 'white' : 'rgba(255,255,255,0.8)', margin: 0, transition: 'color 0.3s' }}>
                                        {faq.q}
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
                                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                    }}>
                                        ↓
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
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section >
    );
}
