'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { getCaseStudies, CaseStudy } from "@/lib/firestoreService";

const FALLBACK_CASES = [
  { i: 1, slug: 'chatbot-ai-ecommerce', color: '#3b82f6', img: '/case_study_ai_chatbot_mockup_1772144142535.webp' },
  { i: 3, slug: 'automatyzacja-n8n', color: '#10b981', img: '/case_study_automation_n8n_mockup_1772144173711.webp' },
  { i: 5, slug: 'automatyzacja-nieruchomosci', color: '#f59e0b', img: '/img_case_real_estate_ai.webp' },
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

// Helper to parse description into challenge and solution for premium scannability
function parseDescription(desc: string) {
  const result = { challenge: '', solution: '' };
  
  if (!desc) return result;
 
  const challengeRegex = /(?:Wyzwanie|🔴 Wyzwanie|🔴):\s*([^.]+)/i;
  const solutionRegex = /(?:Rozwiązanie|🟢 Rozwiązanie|🟢):\s*([^.]+)/i;

  const challengeMatch = desc.match(challengeRegex);
  const solutionMatch = desc.match(solutionRegex);

  if (challengeMatch) {
    result.challenge = challengeMatch[1].trim() + '.';
  }
  if (solutionMatch) {
    result.solution = solutionMatch[1].trim() + '.';
  }

  // Fallback if text doesn't contain matching keywords
  if (!result.challenge && !result.solution) {
    const lines = desc.split('\n').filter(l => l.trim().length > 0);
    result.challenge = lines[0] || '';
    result.solution = lines[1] || '';
  }

  return result;
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

  const TARGET_SLUGS = ['chatbot-ai-ecommerce', 'automatyzacja-n8n', 'automatyzacja-nieruchomosci'];

  const displayCases = (cases.length > 0 ? cases : FALLBACK_CASES)
    .filter((item: any) => TARGET_SLUGS.includes(item.slug))
    .sort((a, b) => TARGET_SLUGS.indexOf(a.slug) - TARGET_SLUGS.indexOf(b.slug));

  return (
    <section id="cases" className="section section-polish relative overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, #030712 0%, #0b0f19 50%, #030712 100%)', padding: '100px 0' }}>
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.04) 0%, transparent 70%)', filter: 'blur(130px)', pointerEvents: 'none' }} />

      <div className="container relative z-10">
        
        {/* Section Header */}
        <div className="section-header fade-in-up text-center w-full max-w-none" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '72px' }}>
          <span className="section-label" style={{ padding: '8px 20px', background: 'rgba(236, 72, 153, 0.08)', color: '#f472b6', borderRadius: '999px', border: '1px solid rgba(236, 72, 153, 0.25)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', boxShadow: '0 4px 20px rgba(236, 72, 153, 0.15)' }}>
            {T('cases.label')}
          </span>
          <h2 className="section-title" style={{ fontSize: 'clamp(2.3rem, 5vw, 3.6rem)', marginTop: '20px', letterSpacing: '-0.035em', fontWeight: 800, color: '#ffffff' }}>
            {T('cases.title')}
          </h2>
          <p className="section-subtitle" style={{ maxWidth: '640px', color: 'rgba(255,255,255,0.6)', marginTop: '18px', fontSize: '1.1rem', lineHeight: 1.65 }}>
            {T('cases.subtitle')}
          </p>
        </div>

        {/* Case Studies Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '32px', padding: '10px 0 30px', justifyContent: displayCases.length <= 2 ? 'center' : 'start' }}>
          {displayCases.map((item: any, idx) => {
            const i = item.i || (idx + 1);
            const slug = item.slug || `case-${idx}`;
            const color = item.color || '#3b82f6';
            const category = item.translations?.[lang]?.category || item.category || T(`cases.case${i}.cat`) || 'Category';
            const title = item.translations?.[lang]?.title || item.title || T(`cases.case${i}.title`) || 'Project Title';
            const description = item.translations?.[lang]?.description || item.description || T(`cases.case${i}.desc`) || 'Description';
            const image = resolveImage(item, title);

            // Parse text
            const parsedText = parseDescription(description);

            return (
              <a
                key={slug + idx}
                href={item.translations ? `/cases/view?slug=${slug}` : `/cases/${slug}`}
                onMouseMove={handleMouseMove}
                className="case-study-card-polished fade-in-up"
                style={{
                  animationDelay: `${0.1 * i}s`,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '28px',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  overflow: 'hidden'
                }}
              >
                {/* Image Container with Inner Border & Hover Scale */}
                {image && (
                  <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Image
                      src={image.startsWith('http') || image.startsWith('/') ? image : `/${image}`}
                      alt={title}
                      fill
                      style={{ objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}
                      className="case-study-img"
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(3,7,18,0.85) 100%)' }} />
                  </div>
                )}
                
                {/* Ambient Highlight */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '180px', height: '180px', background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`, filter: 'blur(30px)', pointerEvents: 'none', zIndex: 1 }} />
                
                {/* Meta Category Tag */}
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px', position: 'relative', zIndex: 2, padding: '5px 12px', background: `${color}10`, border: `1px solid ${color}30`, borderRadius: '999px', width: 'fit-content' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
                  {category}
                </div>

                {/* Case Title */}
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', lineHeight: 1.35, position: 'relative', zIndex: 2, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                  {title}
                </h3>
                
                {/* Parsed Challenge & Solution rows */}
                <div style={{ fontSize: '0.85rem', marginBottom: '28px', flexGrow: 1, position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: '2px solid rgba(255,255,255,0.03)', paddingLeft: '12px' }}>
                  {parsedText.challenge && (
                    <div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', tracking: '0.05em', marginRight: '6px', display: 'inline-block' }}>Wyzwanie:</span>
                      <span style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{parsedText.challenge}</span>
                    </div>
                  )}
                  {parsedText.solution && (
                    <div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', tracking: '0.05em', marginRight: '6px', display: 'inline-block' }}>Rozwiązanie:</span>
                      <span style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{parsedText.solution}</span>
                    </div>
                  )}
                </div>

                {/* Metrics Widget (Bottom area) */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '20px', position: 'relative', zIndex: 2 }}>
                  {item.translations?.[lang]?.results ? (
                    <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 600, lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🚀</span>
                      <span>{item.translations[lang].results}</span>
                    </div>
                  ) : item.translations?.[lang]?.resultsStats?.length >= 2 ? (
                    <div style={{ display: 'flex', gap: '32px' }}>
                      {item.translations[lang].resultsStats.slice(0, 2).map((stat: any, si: number) => (
                        <div key={si}>
                          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>{stat.value}</div>
                          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '32px' }}>
                      <div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>{T(`cases.case${i}.stat1.value`) || '100%'}</div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>{T(`cases.case${i}.stat1.label`) || 'ROI'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>{T(`cases.case${i}.stat2.value`) || '2x'}</div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>{T(`cases.case${i}.stat2.label`) || 'Wzrost'}</div>
                      </div>
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>

        {/* See All Button */}
        <div className="text-center fade-in-up" style={{ marginTop: '48px' }}>
          <a href="/portfolio" className="btn-secondary">
            {T('cases.viewAll')}
          </a>
        </div>
      </div>

      <style jsx>{`
        .case-study-card-polished:hover {
          border-color: rgba(236, 72, 153, 0.35) !important;
          background: rgba(255, 255, 255, 0.04) !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(236, 72, 153, 0.15) !important;
          transform: translateY(-6px) !important;
        }
        .case-study-card-polished:hover .case-study-img {
          transform: scale(1.06) !important;
        }
      `}</style>
    </section>
  );
}
