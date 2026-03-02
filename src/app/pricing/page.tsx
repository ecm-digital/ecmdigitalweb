'use client';

import React from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

const PricingCalculator = dynamic(() => import('@/components/PricingCalculator'), { ssr: false });

export default function PricingPage() {
  const { T } = useLanguage();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '24px', color: 'white', letterSpacing: '-0.02em' }}>
            Get Your Custom Quote
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Answer a few quick questions and get an accurate price estimate for your project. No credit card required.
          </p>
        </div>

        <div style={{
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

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
          marginTop: '80px',
          maxWidth: '1000px',
          margin: '80px auto 0',
        }}>
          {[
            { icon: '⚡', title: 'Fast Quotes', desc: 'Get a detailed estimate in minutes, not days.' },
            { icon: '🎯', title: 'Transparent Pricing', desc: 'No hidden fees, exactly what you\'ll pay.' },
            { icon: '🤝', title: 'Expert Review', desc: 'Our team reviews and refines the quote for accuracy.' },
            { icon: '📞', title: 'Personal Contact', desc: 'A specialist will reach out within 24 hours.' },
          ].map((item, idx) => (
            <div
              key={idx}
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

      <Footer />
    </div>
  );
}
