'use client';

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const STATIC_SERVICES = [
  { key: 'web', icon: '🌐', accent: '#8b5cf6', href: '/services/websites' },
  { key: 'auto', icon: '⚡', accent: '#10b981', href: '/services/automation' },
  { key: 'ai', icon: '🤖', accent: '#3b82f6', href: '/services/ai-agents' },
];

export default function ServicesSection() {
  const { T } = useLanguage();

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section id="services" className="section bg-grid reveal-on-scroll" style={{ padding: '140px 0' }}>
      <div style={{ position: 'absolute', top: '30%', right: '0%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

      <div className="container relative z-10">
        <div className="section-header fade-in-up">
          <span className="section-label" style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '999px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>{T('services.label')}</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em' }}>{T('services.title')}</h2>
          <p className="section-subtitle" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>{T('services.subtitle')}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {STATIC_SERVICES.map((s: any, idx) => (
            <a
              href={s.href}
              key={s.key}
              onMouseMove={handleMouseMove}
              className="service-card premium-hover-lift fade-in-up premium-glass-panel"
              style={{ animationDelay: `${0.1 * idx}s`, position: 'relative', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '40px', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="premium-spotlight" />
              <div className="service-icon" style={{ fontSize: '2.5rem', width: '72px', height: '72px', borderRadius: '20px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.1)', boxShadow: `0 0 20px ${s.accent}30`, position: 'relative', zIndex: 2 }}>
                {s.icon}
              </div>
              <div style={{ flex: 1, position: 'relative', zIndex: 2, width: '100%' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', letterSpacing: '-0.02em', fontWeight: 800 }}>{T(`services.${s.key}.title`)}</h3>
                <p style={{ marginBottom: '24px', fontSize: '1.02rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{T(`services.${s.key}.desc`)}</p>

                {/* Decision Format Block */}
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: s.accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{T(`services.${s.key}.when`)}</div>
                    <div style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{T(`services.${s.key}.when.desc`)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'white', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{T(`services.${s.key}.what`)}</div>
                    <div style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{T(`services.${s.key}.what.desc`)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{T(`services.${s.key}.effect`)}</div>
                    <div style={{ fontSize: '0.92rem', color: 'white', fontWeight: 700, lineHeight: 1.4 }}>🏆 {T(`services.${s.key}.effect.desc`)}</div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Horizontal AI Audit Banner */}
        <div className="premium-glass-panel fade-in-up" style={{ marginTop: '48px', padding: '40px', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(255, 45, 85, 0.08) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
          <div style={{ flex: '1 1 500px', position: 'relative', zIndex: 2 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '6px 16px', borderRadius: '999px', background: 'rgba(255, 45, 85, 0.1)', color: '#FF2D55', border: '1px solid rgba(255, 45, 85, 0.2)', marginBottom: '16px', display: 'inline-block' }}>🔎 {T('services.audit.title')}</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '12px', letterSpacing: '-0.02em' }}>Nie wiesz, od czego zacząć wdrożenie automatyzacji i AI?</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>Mapujemy procesy operacyjne w Twojej firmie i wskazujemy, które wdrożenia przyniosą najwyższy zwrot z inwestycji (ROI). Otrzymujesz kompletną, gotową mapę drogową wdrożeń.</p>
          </div>
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '220px', position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>Projekty startują zwykle od:</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.01em' }}>od 3 000 PLN</div>
            <a href="/services/ai-audit" className="btn-secondary premium-button-shine" style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 700, textAlign: 'center', background: 'rgba(255,255,255,0.05)', textDecoration: 'none', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
              Szczegóły Audytu →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
