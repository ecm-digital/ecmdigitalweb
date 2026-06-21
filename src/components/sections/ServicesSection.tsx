'use client';

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const STATIC_SERVICES = [
  { 
    key: 'audit', 
    icon: '🔎', 
    accent: '#ff2d55', 
    href: '/services/ai-audit',
    metric: 'ROI 300%+',
    category: 'Analiza Biznesowa'
  },
  { 
    key: 'auto', 
    icon: '⚡', 
    accent: '#10b981', 
    href: '/services/automation',
    metric: 'Czas -80%',
    category: 'Integracje n8n'
  },
  { 
    key: 'ai', 
    icon: '🤖', 
    accent: '#3b82f6', 
    href: '/services/ai-agents',
    metric: '24/7 Active',
    category: 'Generative AI'
  },
  { 
    key: 'web', 
    icon: '🌐', 
    accent: '#8b5cf6', 
    href: '/services/websites',
    metric: 'Konwersja x2',
    category: 'Custom Web Dev'
  },
  { 
    key: 'shop', 
    icon: '🛒', 
    accent: '#ec4899', 
    href: '/services/ecommerce',
    metric: 'Skalowanie',
    category: 'E-commerce'
  },
  { 
    key: 'mvp', 
    icon: '🚀', 
    accent: '#f59e0b', 
    href: '/services/mvp',
    metric: '8-12 Tygodni',
    category: 'SaaS Prototyping'
  },
];

export default function ServicesSection() {
  const { T } = useLanguage();

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section id="services" className="section section-polish bg-grid reveal-on-scroll" style={{ background: 'radial-gradient(circle at 50% 10%, rgba(5,5,10,0.3) 0%, transparent 100%)' }}>
      <div style={{ position: 'absolute', top: '30%', right: '0%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%)', filter: 'blur(120px)', zIndex: 0, pointerEvents: 'none' }} />

      <div className="container relative z-10">
        
        {/* Section Header */}
        <div className="section-header fade-in-up text-center w-full max-w-none" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px' }}>
          <span className="section-label" style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.06)', color: 'rgba(255,255,255,0.7)', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {T('services.label')}
          </span>
          <h2 className="section-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', marginTop: '16px', letterSpacing: '-0.03em', fontWeight: 800 }}>
            {T('services.title')}
          </h2>
          <p className="section-subtitle" style={{ maxWidth: '600px', color: 'rgba(255,255,255,0.45)', marginTop: '16px', fontSize: '1.05rem', lineHeight: 1.6 }}>
            {T('services.subtitle')}
          </p>
        </div>

        {/* 6 Services Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px' }}>
          {STATIC_SERVICES.map((s: any, idx) => (
            <a
              href={s.href}
              key={s.key}
              onMouseMove={handleMouseMove}
              className="service-card-polished premium-hover-lift fade-in-up premium-glass-panel"
              style={{
                animationDelay: `${0.05 * idx}s`,
              }}
            >
              <div className="premium-spotlight" />
              
              {/* Card Meta Header */}
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', zIndex: 2 }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {s.category}
                </span>
                <span style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 700, 
                  color: s.accent, 
                  background: `${s.accent}08`, 
                  border: `1px solid ${s.accent}15`, 
                  padding: '3px 10px', 
                  borderRadius: '999px',
                  letterSpacing: '0.02em'
                }}>
                  {s.metric}
                </span>
              </div>

              {/* Service Icon inside glass box */}
              <div className="service-icon" style={{
                fontSize: '1.6rem',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                marginBottom: '20px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: `0 8px 20px ${s.accent}08`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 2
              }}>
                {s.icon}
              </div>

              {/* Title & Description */}
              <div style={{ flex: 1, position: 'relative', zIndex: 2, width: '100%', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', letterSpacing: '-0.02em', fontWeight: 700, color: '#f8fafc' }}>
                  {T(`services.${s.key}.title`)}
                </h3>
                <p style={{ marginBottom: '24px', fontSize: '0.86rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, flexGrow: 1 }}>
                  {T(`services.${s.key}.desc`)}
                </p>

                {/* Subtly presented tags/benefits as minimalist pills */}
                <div style={{
                  marginTop: 'auto',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ 
                      background: 'rgba(255,255,255,0.02)', 
                      border: '1px solid rgba(255,255,255,0.05)', 
                      borderRadius: '6px', 
                      padding: '4px 8px', 
                      fontSize: '0.72rem', 
                      color: 'rgba(255,255,255,0.5)', 
                      fontWeight: 500 
                    }}>
                      {T(`services.${s.key}.tag1`)}
                    </span>
                    <span style={{ 
                      background: 'rgba(255,255,255,0.02)', 
                      border: '1px solid rgba(255,255,255,0.05)', 
                      borderRadius: '6px', 
                      padding: '4px 8px', 
                      fontSize: '0.72rem', 
                      color: 'rgba(255,255,255,0.5)', 
                      fontWeight: 500 
                    }}>
                      {T(`services.${s.key}.tag2`)}
                    </span>
                  </div>

                  <span className="learn-more-arrow" style={{ 
                    fontSize: '0.9rem', 
                    color: 'rgba(255,255,255,0.3)', 
                    transition: 'all 0.3s ease',
                    fontWeight: 600
                  }}>
                    →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>

      <style jsx>{`
        .service-card:hover .learn-more-arrow {
          transform: translateX(4px);
          color: white;
        }
      `}</style>
    </section>
  );
}
