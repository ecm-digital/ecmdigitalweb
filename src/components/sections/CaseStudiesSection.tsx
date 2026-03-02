'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { getCaseStudies, CaseStudy } from "@/lib/firestoreService";

const FALLBACK_CASES = [
  { i: 1, slug: 'chatbot-ai-ecommerce', color: '#3b82f6', img: '/case_study_ai_chatbot_mockup_1772144142535.webp' },
  { i: 2, slug: 'sklep-shopify-ai', color: '#ec4899', img: '/case_study_shopify_ai_mockup_1772144156310.webp' },
  { i: 3, slug: 'automatyzacja-n8n', color: '#10b981', img: '/case_study_automation_n8n_mockup_1772144173711.webp' },
  { i: 4, slug: 'aplikacja-mvp', color: '#f59e0b', img: '/case_study_mvp_startup_mockup_1772144187874.webp' },
];

function resolveImage(item: any, title: string): string {
  if (item.coverImage || item.img || item.image) return item.coverImage || item.img || item.image;
  if (title.includes('Nieruchomości') && title.includes('Automatyzacja')) return '/img_case_real_estate_ai.webp';
  if (title.toLowerCase().includes('doradcy kredytowego')) return '/img_case_credit_advisor.webp';
  if (title.toLowerCase().includes('kingsmith')) return '/img_case_fitness_app.webp';
  if (title.toLowerCase().includes('agencji nieruchomości') && title.toLowerCase().includes('strona')) return '/img_case_real_estate_web.webp';
  if (title.toLowerCase().includes('kursami z zakresu ai')) return '/img_case_ai_education.webp';
  return '/case_study_mvp_startup_mockup_1772144187874.webp';
}

export default function CaseStudiesSection() {
  const { T, lang } = useLanguage();
  const [cases, setCases] = useState<CaseStudy[]>([]);

  useEffect(() => {
    getCaseStudies()
      .then(data => { if (data?.length > 0) setCases(data); })
      .catch(console.error);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const displayCases = cases.length > 0 ? cases : FALLBACK_CASES;

  return (
    <section id="cases" className="section relative" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to bottom, transparent, rgba(5,5,7,0.8))' }}>
      <div className="container">
        <div className="section-header fade-in-up text-center w-full max-w-none" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="section-label" style={{ padding: '8px 16px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', borderRadius: '999px', border: '1px solid rgba(236, 72, 153, 0.2)' }}>{T('cases.label')}</span>
          <h2 className="section-title">{T('cases.title')}</h2>
          <p className="section-subtitle">{T('cases.subtitle')}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '32px', padding: '20px 0 40px', justifyContent: displayCases.length <= 2 ? 'center' : 'start' }}>
          {displayCases.map((item: any, idx) => {
            const i = item.i || (idx + 1);
            const slug = item.slug || `case-${idx}`;
            const color = item.color || '#3b82f6';
            const category = item.translations?.[lang]?.category || item.category || T(`cases.case${i}.cat`) || 'Category';
            const title = item.translations?.[lang]?.title || item.title || T(`cases.case${i}.title`) || 'Project Title';
            const description = item.translations?.[lang]?.description || item.description || T(`cases.case${i}.desc`) || 'Description';
            const image = resolveImage(item, title);

            return (
              <a
                key={slug + idx}
                href={item.translations ? `/cases/view?slug=${slug}` : `/cases/${slug}`}
                onMouseMove={handleMouseMove}
                className="premium-glass-panel premium-card-glow fade-in-up"
                style={{ padding: '40px', display: 'flex', flexDirection: 'column', animationDelay: `${0.1 * i}s`, textDecoration: 'none', color: 'inherit', borderRadius: '28px', position: 'relative', overflow: 'hidden', minHeight: '420px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
              >
                {image && (
                  <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '20px', overflow: 'hidden', marginBottom: '24px' }}>
                    <Image src={image.startsWith('http') || image.startsWith('/') ? image : `/${image}`} alt={title} fill style={{ objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />
                  </div>
                )}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '180px', height: '180px', background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`, filter: 'blur(30px)', pointerEvents: 'none', zIndex: 1 }} />
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 2 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                  {category}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', lineHeight: 1.3, position: 'relative', zIndex: 2, fontWeight: 800 }}>{title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', flexGrow: 1, lineHeight: 1.6, position: 'relative', zIndex: 2 }}>{description}</p>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                  {item.translations?.[lang]?.results ? (
                    <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: 700, lineHeight: 1.5 }}>
                      🚀 {item.translations[lang].results}
                    </div>
                  ) : item.translations?.[lang]?.resultsStats?.length >= 2 ? (
                    <div style={{ display: 'flex', gap: '32px' }}>
                      {item.translations[lang].resultsStats.slice(0, 2).map((stat: any, si: number) => (
                        <div key={si}>
                          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{stat.value}</div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '32px' }}>
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{T(`cases.case${i}.stat1.value`) || '100%'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>{T(`cases.case${i}.stat1.label`) || 'ROI'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{T(`cases.case${i}.stat2.value`) || '2x'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>{T(`cases.case${i}.stat2.label`) || 'Wzrost'}</div>
                      </div>
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>

        <div className="text-center fade-in-up" style={{ marginTop: '40px' }}>
          <a href="/portfolio" className="btn-secondary premium-button-shine" style={{ padding: '14px 40px', borderRadius: '12px', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {T('cases.viewAll')}
          </a>
        </div>
      </div>
    </section>
  );
}
