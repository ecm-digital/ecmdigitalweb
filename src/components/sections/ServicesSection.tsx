'use client';

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const STATIC_SERVICES = [
  { 
    key: 'audit', 
    icon: '🔎', 
    accent: '#06b6d4', 
    href: '/services/ai-audit',
    metric: '100% odliczane',
    category: '1. Diagnoza & Roadmapa',
    featured: false
  },
  { 
    key: 'ai-agent-sprint', 
    icon: '⏱️', 
    accent: '#7c3aed', 
    href: '/services/ai-agent-sprint',
    metric: '⭐ Bestseller • 14 dni',
    category: '2. Flagowe wdrożenie',
    featured: true
  },
  { 
    key: 'auto', 
    icon: '⚡', 
    accent: '#10b981', 
    href: '/services/automation',
    metric: 'Czas -80%',
    category: '3. Integracje n8n & API',
    featured: false
  },
  { 
    key: 'partner', 
    icon: '📈', 
    accent: '#3b82f6', 
    href: '/services/ai-growth-partner',
    metric: 'Retainer / SLA',
    category: '4. Ciągły rozwój',
    featured: false
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
    <section id="services" className="section section-polish bg-grid reveal-on-scroll relative overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(15, 23, 42, 0.6) 0%, rgba(3, 7, 18, 0.95) 100%)', padding: '100px 0' }}>
      <div style={{ position: 'absolute', top: '20%', right: '5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)', filter: 'blur(120px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

      <div className="container relative z-10">
        
        {/* Section Header */}
        <div className="section-header fade-in-up text-center w-full max-w-none" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '68px' }}>
          <span className="section-label" style={{ padding: '8px 20px', background: 'rgba(59, 130, 246, 0.08)', color: '#60a5fa', borderRadius: '999px', border: '1px solid rgba(59, 130, 246, 0.25)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)' }}>
            {T('services.label')}
          </span>
          <h2 className="section-title" style={{ fontSize: 'clamp(2.3rem, 5vw, 3.6rem)', marginTop: '20px', letterSpacing: '-0.035em', fontWeight: 800, color: '#ffffff' }}>
            {T('services.title')}
          </h2>
          <p className="section-subtitle" style={{ maxWidth: '640px', color: 'rgba(255,255,255,0.6)', marginTop: '18px', fontSize: '1.1rem', lineHeight: 1.65 }}>
            {T('services.subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px' }}>
          {STATIC_SERVICES.map((s: any, idx) => (
            <a
              href={s.href}
              key={s.key}
              onMouseMove={handleMouseMove}
              className={`service-card-polished premium-hover-lift fade-in-up ${s.featured ? 'service-card-featured' : ''}`}
              style={{
                animationDelay: `${0.08 * idx}s`,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                padding: '36px 30px',
                borderRadius: '24px',
                background: s.featured ? 'rgba(124, 58, 237, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                border: s.featured ? '1px solid rgba(124, 58, 237, 0.35)' : '1px solid rgba(255, 255, 255, 0.07)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                overflow: 'hidden',
                boxShadow: s.featured ? '0 12px 36px rgba(124, 58, 237, 0.15)' : 'none'
              }}
            >
              <div className="premium-spotlight" />
              
              {/* Card Meta Header */}
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', zIndex: 2 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: s.featured ? '#c4b5fd' : 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {s.category}
                </span>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 800, 
                  color: s.accent, 
                  background: `${s.accent}14`, 
                  border: `1px solid ${s.accent}35`, 
                  padding: '4px 12px', 
                  borderRadius: '999px',
                  letterSpacing: '0.02em',
                  boxShadow: `0 4px 15px ${s.accent}18`
                }}>
                  {s.metric}
                </span>
              </div>

              {/* Service Icon inside glass box */}
              <div className="service-icon" style={{
                fontSize: '1.8rem',
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                marginBottom: '20px',
                background: `radial-gradient(circle at 30% 30%, ${s.accent}25, rgba(255,255,255,0.02))`,
                border: `1px solid ${s.accent}40`,
                boxShadow: `0 10px 25px ${s.accent}20`,
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
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', letterSpacing: '-0.025em', fontWeight: 700, color: '#f8fafc' }}>
                  {T(`services.${s.key}.title`)}
                </h3>
                <p style={{ marginBottom: '24px', fontSize: '0.92rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, flexGrow: 1 }}>
                  {T(`services.${s.key}.desc`)}
                </p>

                {/* Subtly presented tags/benefits as minimalist pills */}
                <div style={{
                  marginTop: 'auto',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ 
                      background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid rgba(255,255,255,0.08)', 
                      borderRadius: '8px', 
                      padding: '5px 10px', 
                      fontSize: '0.75rem', 
                      color: 'rgba(255,255,255,0.65)', 
                      fontWeight: 500 
                    }}>
                      {T(`services.${s.key}.tag1`)}
                    </span>
                    <span style={{ 
                      background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid rgba(255,255,255,0.08)', 
                      borderRadius: '8px', 
                      padding: '5px 10px', 
                      fontSize: '0.75rem', 
                      color: 'rgba(255,255,255,0.65)', 
                      fontWeight: 500 
                    }}>
                      {T(`services.${s.key}.tag2`)}
                    </span>
                  </div>

                  <span className="learn-more-arrow" style={{ 
                    fontSize: '1.1rem', 
                    color: 'rgba(255,255,255,0.4)', 
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

        {/* Action button leading to all services catalogue */}
        <div style={{ marginTop: '56px', textAlign: 'center' }} className="fade-in-up">
          <a
            href="/services"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 36px',
              borderRadius: '999px',
              fontSize: '0.95rem',
              fontWeight: 700,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
              color: '#ffffff',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {T('services.allServicesBtn')}
          </a>
        </div>

      </div>

      <style jsx>{`
        .service-card-polished:hover {
          border-color: rgba(99, 102, 241, 0.35) !important;
          background: rgba(255, 255, 255, 0.04) !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.15) !important;
          transform: translateY(-6px) !important;
        }
        .service-card-polished:hover .learn-more-arrow {
          transform: translateX(6px);
          color: #60a5fa;
        }
      `}</style>
    </section>
  );
}
