'use client';

import React from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

const PricingCalculator = dynamic(() => import('@/components/PricingCalculator'), { ssr: false });

export default function PricingPage() {
  const { T, lang } = useLanguage();

  return (
    <div className="lp-wrapper">
      <Navbar />

      {/* Premium Hero */}
      <section className="relative overflow-hidden bg-grid" style={{ padding: '160px 0 60px', minHeight: '30vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />
        
        <div className="container relative z-10 text-center">
          <div className="fade-in-up">
            <div className="hero-badge" style={{
              margin: '0 auto 24px',
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 24px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)'
            }}>
              💰 {lang === 'pl' ? 'Cennik i Kalkulator' : 'Pricing & Estimates'}
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              {lang === 'pl' ? 'Wycena Twojego Projektu' : 'Get Your Custom Quote'}
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              {lang === 'pl' 
                ? 'Odpowiedz na kilka szybkich pytań i otrzymaj wstępną wycenę swojego projektu. Bez zobowiązań.' 
                : 'Answer a few quick questions and get an accurate price estimate for your project. No commitment.'}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Calculator Section */}
      <section className="section bg-grid relative" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'transparent', paddingTop: '40px' }}>
        <div className="container">
          <div className="fade-in-up" style={{
            maxWidth: '700px',
            margin: '0 auto',
            padding: '40px',
            borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(20px)',
          }}>
            <PricingCalculator />
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px',
            marginTop: '80px',
            maxWidth: '1000px',
            margin: '80px auto 0',
          }}>
            {[
              { icon: '⚡', title: lang === 'pl' ? 'Szybka wycena' : 'Fast Quotes', desc: lang === 'pl' ? 'Otrzymaj wstępną wycenę w kilka minut, a nie dni.' : 'Get a detailed estimate in minutes, not days.' },
              { icon: '🎯', title: lang === 'pl' ? 'Jasne warunki' : 'Transparent Pricing', desc: lang === 'pl' ? 'Brak ukrytych kosztów, wiesz dokładnie za co płacisz.' : 'No hidden fees, exactly what you\'ll pay.' },
              { icon: '🤝', title: lang === 'pl' ? 'Analiza eksperta' : 'Expert Review', desc: lang === 'pl' ? 'Nasz zespół analizuje każde zapytanie w celu doprecyzowania szczegółów.' : 'Our team reviews and refines the quote for accuracy.' },
              { icon: '📞', title: lang === 'pl' ? 'Kontakt w 24h' : 'Personal Contact', desc: lang === 'pl' ? 'Nasz specjalista skontaktuje się z Tobą w ciągu 24 godzin.' : 'A specialist will reach out within 24 hours.' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="premium-glass-panel premium-hover-lift"
                style={{
                  padding: '32px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.02)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
