'use client';

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getAgencyServices, ServiceData } from "@/lib/firestoreService";

const STATIC_SERVICES = [
  { key: 'ai', icon: '🤖', accent: '#3b82f6', href: '/services/ai-agents', span: 'col-span-8', featured: true },
  { key: 'web', icon: '🌐', accent: '#8b5cf6', href: '/services/websites', span: 'col-span-4' },
  { key: 'shop', icon: '🛍️', accent: '#ec4899', href: '/services/ecommerce', span: 'col-span-4' },
  { key: 'auto', icon: '⚡', accent: '#10b981', href: '/services/automation', span: 'col-span-4' },
  { key: 'executive', icon: '💼', accent: '#FF2D55', href: '/services/ai-executive', span: 'col-span-4' },
  { key: 'edu', icon: '🎓', accent: '#30D158', href: '/services/edu', span: 'col-span-4' },
  { key: 'mvp', icon: '🚀', accent: '#f59e0b', href: '/services/mvp', span: 'col-span-4' },
  { key: 'audit', icon: '📊', accent: '#6366f1', href: '/services/ai-audit', span: 'col-span-8', wide: true },
];

const EXISTING_SLUGS = ['ai-agents', 'websites', 'ecommerce', 'automation', 'ai-executive', 'edu', 'mvp', 'ai-audit'];

export default function ServicesSection() {
  const { T, lang } = useLanguage();
  const [dynServices, setDynServices] = useState<ServiceData[]>([]);

  useEffect(() => {
    getAgencyServices()
      .then(data => setDynServices(data.filter(s => !EXISTING_SLUGS.includes(s.slug))))
      .catch(console.error);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const allServices = [
    ...STATIC_SERVICES,
    ...dynServices.map(s => ({
      key: s.slug,
      icon: s.icon || '🚀',
      accent: s.gradient.match(/#([0-9a-fA-F]{6})/)?.[0] || '#3b82f6',
      href: `/services/view?slug=${s.slug}`,
      span: 'col-span-4' as const,
      dynamic: true,
      title: s.translations?.[lang as 'pl' | 'en']?.title || s.slug,
      desc: s.translations?.[lang as 'pl' | 'en']?.subtitle || '',
      tag1: s.price || T('services.new'),
    })),
  ];

  return (
    <section id="services" className="section bg-grid reveal-on-scroll" style={{ padding: '140px 0' }}>
      <div style={{ position: 'absolute', top: '30%', right: '0%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

      <div className="container relative z-10">
        <div className="section-header fade-in-up">
          <span className="section-label" style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '999px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>{T('services.label')}</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em' }}>{T('services.title')}</h2>
          <p className="section-subtitle" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>{T('services.subtitle')}</p>
        </div>

        <div className="services-grid bento-grid">
          {allServices.map((s: any, idx) => (
            <a
              href={s.href}
              key={s.key}
              onMouseMove={handleMouseMove}
              className={`service-card premium-hover-lift fade-in-up premium-glass-panel ${s.span}`}
              style={{ animationDelay: `${0.1 * idx}s`, position: 'relative', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: s.wide ? 'row' : 'column', alignItems: s.wide ? 'center' : 'flex-start', gap: s.wide ? '40px' : '0' }}
            >
              <div className="premium-spotlight" />
              <div className="service-icon" style={{ fontSize: '2.5rem', width: '72px', height: '72px', borderRadius: '20px', marginBottom: s.wide ? '0' : '24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.1)', boxShadow: `0 0 20px ${s.accent}30`, position: 'relative', zIndex: 2 }}>
                {s.icon}
              </div>
              <div style={{ flex: 1, position: 'relative', zIndex: 2 }}>
                <h3 style={{ fontSize: s.featured ? '2rem' : '1.5rem', marginBottom: '16px', letterSpacing: '-0.02em' }}>{s.dynamic ? s.title : T(`services.${s.key}.title`)}</h3>
                <p style={{ marginBottom: '24px', fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{s.dynamic ? s.desc : T(`services.${s.key}.desc`)}</p>
                <div className="service-tag" style={{ border: `1px solid ${s.accent}50`, color: s.accent, background: `${s.accent}10` }}>
                  {s.dynamic ? s.tag1 : T(`services.${s.key}.tag1`)}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
