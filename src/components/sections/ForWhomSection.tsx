'use client';

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ForWhomSection() {
  const { T } = useLanguage();

  return (
    <section id="for-whom" className="section relative reveal-on-scroll" style={{ padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'var(--surface-1)' }}>
      {/* Background ambient glow */}
      <div className="absolute" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 80%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="container relative z-10">
        <div className="section-header text-center fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '60px' }}>
          <span className="section-label" style={{ padding: '8px 16px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', borderRadius: '999px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            {T('forwhom.title') || "Dla Kogo Pracujemy"}
          </span>
          <h2 className="section-title" style={{ marginTop: '16px' }}>{T('forwhom.title') || "Dla kogo projektujemy wzrost?"}</h2>
          <p className="section-subtitle" style={{ maxWidth: '600px', margin: '16px auto 0' }}>{T('forwhom.subtitle') || "Dostosowujemy narzędzia do skali i charakteru Twojej działalności usługowej."}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {/* Lokalne Usługi */}
          <div className="premium-glass-panel premium-hover-lift fade-in-left" style={{ padding: 'clamp(24px, 5vw, 48px)', borderRadius: '32px', background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(99, 102, 241, 0.15)', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>📍</div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'white', margin: 0 }}>{T('forwhom.local.title')}</h3>
              </div>
              <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '32px' }}>{T('forwhom.local.desc')}</p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'rgba(255,255,255,0.85)', fontSize: '0.98rem', lineHeight: 1.5 }}>
                  <span style={{ color: '#818cf8', fontWeight: 'bold' }}>✓</span>
                  <span>{T('forwhom.local.bullet1')}</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'rgba(255,255,255,0.85)', fontSize: '0.98rem', lineHeight: 1.5 }}>
                  <span style={{ color: '#818cf8', fontWeight: 'bold' }}>✓</span>
                  <span>{T('forwhom.local.bullet2')}</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'rgba(255,255,255,0.85)', fontSize: '0.98rem', lineHeight: 1.5 }}>
                  <span style={{ color: '#818cf8', fontWeight: 'bold' }}>✓</span>
                  <span>{T('forwhom.local.bullet3')}</span>
                </li>
              </ul>
            </div>
            <div style={{ marginTop: '40px' }}>
              <a href="#contact" className="btn-secondary" style={{ display: 'inline-block', width: '100%', textAlign: 'center', padding: '14px 28px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', textDecoration: 'none', fontWeight: 600, transition: 'all 0.3s' }}>
                {T('hero.cta2')}
              </a>
            </div>
          </div>

          {/* Ogólnokrajowe Usługi B2B */}
          <div className="premium-glass-panel premium-hover-lift fade-in-right" style={{ padding: 'clamp(24px, 5vw, 48px)', borderRadius: '32px', background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(59, 130, 246, 0.15)', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>🏢</div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'white', margin: 0 }}>{T('forwhom.b2b.title')}</h3>
              </div>
              <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '32px' }}>{T('forwhom.b2b.desc')}</p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'rgba(255,255,255,0.85)', fontSize: '0.98rem', lineHeight: 1.5 }}>
                  <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>✓</span>
                  <span>{T('forwhom.b2b.bullet1')}</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'rgba(255,255,255,0.85)', fontSize: '0.98rem', lineHeight: 1.5 }}>
                  <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>✓</span>
                  <span>{T('forwhom.b2b.bullet2')}</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'rgba(255,255,255,0.85)', fontSize: '0.98rem', lineHeight: 1.5 }}>
                  <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>✓</span>
                  <span>{T('forwhom.b2b.bullet3')}</span>
                </li>
              </ul>
            </div>
            <div style={{ marginTop: '40px' }}>
              <a href="#contact" className="btn-secondary" style={{ display: 'inline-block', width: '100%', textAlign: 'center', padding: '14px 28px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', textDecoration: 'none', fontWeight: 600, transition: 'all 0.3s' }}>
                {T('hero.cta2')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
