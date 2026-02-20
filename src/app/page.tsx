'use client';

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import NewsletterSection from "@/components/NewsletterSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import AIAgentDemo from "@/components/AIAgentDemo";
import './globals.css';
import './nextgen2026.css';

function HomePageContent() {
  const { T, lang } = useLanguage();
  const searchParams = useSearchParams();

  // Detect Personalization
  const serviceParam = searchParams.get('service');
  const validServices = ['shopify', 'ai', 'web'];
  const isValidService = serviceParam && validServices.includes(serviceParam);
  const heroSubtitle = isValidService ? T(`personalization.${serviceParam}.subtitle`) : T('hero.subtitle');

  useEffect(() => {
    // Scroll Progress
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
    };
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for fade-ins
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="scroll-progress-bar" />
      <Navbar />

      {/* ===== HERO SECTION Feb 2026 ===== */}
      <section className="hero bg-grid relative overflow-hidden" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '160px', paddingBottom: '120px' }}>
        {/* Animated Background Orbs */}
        <div style={{ position: 'absolute', top: '5%', left: '15%', width: '60vw', height: '60vw', maxWidth: '800px', maxHeight: '800px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, animation: 'float 12s infinite alternate', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '5%', width: '50vw', height: '50vw', maxWidth: '700px', maxHeight: '700px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', filter: 'blur(120px)', zIndex: 0, animation: 'float 15s infinite alternate-reverse', pointerEvents: 'none' }} />

        <div className="container relative z-10">
          <div className="hero-content" style={{ maxWidth: '1000px', margin: '0 auto 80px', textAlign: 'center' }}>

            <div className="hero-badge fade-in-up" style={{
              margin: '0 auto 40px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 28px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.15)',
              backdropFilter: 'blur(20px)'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60a5fa', boxShadow: '0 0 15px #60a5fa' }} className="animate-pulse"></span>
              {T('hero.badge')}
            </div>

            <h1 className="hero-title fade-in-up" style={{ animationDelay: '0.1s', marginBottom: '32px', lineHeight: 1.1 }}>
              {isValidService ? T(`personalization.${serviceParam}.title`) : (
                <>
                  <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.9)' }}>{T('hero.title1')}</span> <br />
                  <span className="premium-text-gradient font-extrabold" style={{ display: 'inline-block', transform: 'scale(1.02)' }}>{T('hero.titleAccent')}</span> <br />
                  <span style={{ fontWeight: 700 }}>{T('hero.title2')}</span>
                </>
              )}
            </h1>

            <p className="hero-subtitle fade-in-up text-balance" style={{ animationDelay: '0.2s', margin: '0 auto 48px', maxWidth: '740px', fontSize: '1.3rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              {heroSubtitle}
            </p>

            <div className="hero-actions fade-in-up" style={{ animationDelay: '0.3s', justifyContent: 'center', gap: '24px', display: 'flex', flexWrap: 'wrap' }}>
              <a href="#services" className="btn-primary premium-button-shine" style={{ padding: '16px 48px', fontSize: '1.1rem', borderRadius: '16px', fontWeight: 600, letterSpacing: '0.02em', transition: 'all 0.3s' }}>{T('hero.cta1')}</a>
              <a href="#contact" className="btn-secondary premium-button-shine" style={{ padding: '16px 48px', fontSize: '1.1rem', borderRadius: '16px', fontWeight: 600, letterSpacing: '0.02em', transition: 'all 0.3s', background: 'rgba(255,255,255,0.05)' }}>{T('hero.cta2')}</a>
            </div>
          </div>

          {/* AI Visual - Premium Glass Terminal */}
          <div className="fade-in-up" style={{ animationDelay: '0.4s', maxWidth: '1000px', margin: '0 auto', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))' }}>
            <div className="premium-animated-border">
              <AIAgentDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ===== INFINITE MARQUEE LOGOS ===== */}
      <div className="premium-marquee-wrapper" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '50px 0', background: 'rgba(5, 5, 7, 0.4)', backdropFilter: 'blur(10px)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '250px', background: 'linear-gradient(to right, rgba(5,5,7,1) 0%, transparent 100%)', zIndex: 1, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '250px', background: 'linear-gradient(to left, rgba(5,5,7,1) 0%, transparent 100%)', zIndex: 1, pointerEvents: 'none' }} />

        <div className="premium-marquee-animated">
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="premium-pill" style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)' }}>GOOGLE CLOUD</span>
              <span className="premium-pill" style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)' }}>OPENAI GPT-4</span>
              <span className="premium-pill" style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)' }}>SHOPIFY PLUS</span>
              <span className="premium-pill" style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)' }}>NEXT.JS 15</span>
              <span className="premium-pill" style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)' }}>N8N CORE</span>
              <span className="premium-pill" style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)' }}>ANTHROPIC CLAUDE</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ===== SERVICES BENTO GRID 2026 ===== */}
      <section id="services" className="section relative">
        <div style={{ position: 'absolute', top: '30%', right: '0%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

        <div className="container relative z-10">
          <div className="section-header fade-in-up">
            <span className="section-label" style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '999px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>{T('services.label')}</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em' }}>{T('services.title')}</h2>
            <p className="section-subtitle" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>{T('services.subtitle')}</p>
          </div>

          <style>{`
            .bento-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 24px;
              grid-auto-rows: minmax(360px, auto);
            }
            @media (min-width: 768px) {
              .bento-grid {
                grid-template-columns: repeat(12, 1fr);
              }
              .col-span-4 { grid-column: span 4; }
              .col-span-8 { grid-column: span 8; }
              .col-span-12 { grid-column: span 12; }
            }
          `}</style>
          <div className="services-grid bento-grid">
            {[
              { key: 'ai', icon: '🤖', accent: '#3b82f6', href: '/services/ai-agents', span: 'col-span-8', featured: true },
              { key: 'web', icon: '🌐', accent: '#8b5cf6', href: '/services/websites', span: 'col-span-4' },
              { key: 'shop', icon: '🛍️', accent: '#ec4899', href: '/services/ecommerce', span: 'col-span-4' },
              { key: 'auto', icon: '⚡', accent: '#10b981', href: '/services/automation', span: 'col-span-4' },
              { key: 'executive', icon: '💼', accent: '#FF2D55', href: '/services/ai-executive', span: 'col-span-4' },
              { key: 'edu', icon: '🎓', accent: '#30D158', href: '/services/edu', span: 'col-span-4' },
              { key: 'mvp', icon: '🚀', accent: '#f59e0b', href: '/services/mvp', span: 'col-span-4' },
              { key: 'audit', icon: '📊', accent: '#6366f1', href: '/services/ai-audit', span: 'col-span-8', wide: true },
            ].map((s, idx) => (
              <a href={s.href} key={s.key} className={`service-card premium-hover-lift fade-in-up premium-glass-panel ${s.span}`} style={{
                animationDelay: `${0.1 * idx}s`,
                position: 'relative',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: s.wide ? 'row' : 'column',
                alignItems: s.wide ? 'center' : 'flex-start',
                gap: s.wide ? '40px' : '0'
              }}>
                <div className="service-icon" style={{
                  fontSize: '2.5rem',
                  width: '72px',
                  height: '72px',
                  borderRadius: '20px',
                  marginBottom: s.wide ? '0' : '24px',
                  background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))`,
                  border: `1px solid rgba(255,255,255,0.1)`,
                  boxShadow: `0 0 20px ${s.accent}30`
                }}>
                  {s.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: s.featured ? '2rem' : '1.5rem', marginBottom: '16px', letterSpacing: '-0.02em' }}>{T(`services.${s.key}.title`)}</h3>
                  <p style={{ marginBottom: '24px', fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{T(`services.${s.key}.desc`)}</p>
                  <div className="service-tag" style={{ border: `1px solid ${s.accent}50`, color: s.accent, background: `${s.accent}10` }}>
                    {T(`services.${s.key}.tag1`)}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      <section id="cases" className="section relative" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to bottom, transparent, rgba(5,5,7,0.8))' }}>
        <div className="container">
          <div className="section-header fade-in-up text-center w-full max-w-none" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="section-label" style={{ padding: '8px 16px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', borderRadius: '999px', border: '1px solid rgba(236, 72, 153, 0.2)' }}>{T('cases.label')}</span>
            <h2 className="section-title">{T('cases.title')}</h2>
            <p className="section-subtitle">{T('cases.subtitle')}</p>
          </div>

          <div style={{ display: 'flex', gap: '32px', overflowX: 'auto', padding: '20px 0 60px', scrollSnapType: 'x mandatory', maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }} className="no-scrollbar">
            {[
              { i: 1, slug: 'chatbot-ai-ecommerce', color: '#3b82f6' },
              { i: 2, slug: 'sklep-shopify-ai', color: '#ec4899' },
              { i: 3, slug: 'automatyzacja-n8n', color: '#10b981' },
              { i: 4, slug: 'aplikacja-mvp', color: '#f59e0b' },
            ].map(({ i, slug, color }) => (
              <a
                key={i}
                href={`/cases/${slug}`}
                className="premium-glass-panel snap-center fade-in-up"
                style={{
                  minWidth: '400px',
                  maxWidth: '400px',
                  padding: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  animationDelay: `${0.1 * i}s`,
                  textDecoration: 'none',
                  color: 'inherit',
                  borderRadius: '28px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`, filter: 'blur(30px)' }}></div>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }}></span>
                  {T(`cases.case${i}.cat`)}
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', lineHeight: 1.3 }}>{T(`cases.case${i}.title`)}</h3>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', flexGrow: 1, lineHeight: 1.6 }}>{T(`cases.case${i}.desc`)}</p>

                <div style={{ display: 'flex', gap: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{T(`cases.case${i}.stat1.value`)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>{T(`cases.case${i}.stat1.label`)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{T(`cases.case${i}.stat2.value`)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>{T(`cases.case${i}.stat2.label`)}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS 2026 ===== */}
      <section id="testimonials" className="section relative bg-grid" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '120px 0' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

        <div className="container relative z-10">
          <div className="section-header fade-in-up">
            <span className="section-label" style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{T('testimonials.label')}</span>
            <h2 className="section-title">{T('testimonials.title')}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="premium-glass-panel fade-in-up" style={{ animationDelay: `${0.2 * i}s`, padding: '40px', borderRadius: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '4px', color: '#fbbf24', fontSize: '1.2rem' }}>★★★★★</div>
                <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', marginBottom: '32px', lineHeight: 1.7 }}>"{T(`testimonials.t${i}.text`)}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '1.1rem', color: 'white',
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)'
                  }}>
                    {T(`testimonials.t${i}.name`).charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>{T(`testimonials.t${i}.name`)}</div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>{T(`testimonials.t${i}.role`)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS 2026 ===== */}
      <section className="section relative" style={{ padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
        <div className="container relative z-10">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'center' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="fade-in-up" style={{ animationDelay: `${0.1 * i}s` }}>
                <div style={{ fontSize: '4rem', fontWeight: 800, background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px', letterSpacing: '-0.03em', filter: 'drop-shadow(0 10px 20px rgba(139, 92, 246, 0.2))' }}>
                  {T(`hero.stat${i}.value`)}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {T(`hero.stat${i}.label`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <FAQSection />

      {/* ===== CONTACT CTA ===== */}
      <section className="section">
        <ContactSection />
      </section>

      {/* ===== FOOTER ===== */}
      <NewsletterSection lang={lang} />
      <Footer />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
