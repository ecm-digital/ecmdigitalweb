'use client';

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import NewsletterSection from "@/components/NewsletterSection";
import ContactSection from "@/components/ContactSection";
import AIAgentDemo from "@/components/AIAgentDemo";
import './globals.css';

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
    document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="scroll-progress-bar" />
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="hero bg-grid">
        <div className="container">
          <div className="hero-content" style={{ maxWidth: '100%', textAlign: 'center', marginBottom: '80px' }}>
            <div className="hero-badge fade-in-up" style={{ margin: '0 auto 32px' }}>
              {T('hero.badge')}
            </div>

            <h1 className="hero-title fade-in-up" style={{ animationDelay: '0.1s' }}>
              {isValidService ? T(`personalization.${serviceParam}.title`) : (
                <>
                  {T('hero.title1')} <br />
                  <span className="accent">{T('hero.titleAccent')}</span> {T('hero.title2')}
                </>
              )}
            </h1>

            <p className="hero-subtitle fade-in-up" style={{ animationDelay: '0.2s', margin: '0 auto 48px', maxWidth: '600px' }}>
              {heroSubtitle}
            </p>

            <div className="hero-actions fade-in-up" style={{ animationDelay: '0.3s', justifyContent: 'center' }}>
              <a href="#services" className="btn-primary">{T('hero.cta1')}</a>
              <a href="#contact" className="btn-secondary">{T('hero.cta2')}</a>
            </div>
          </div>

          {/* AI Visual - Centered */}
          <div className="fade-in-up" style={{ animationDelay: '0.4s', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px',
              padding: '24px',
              backdropFilter: 'blur(20px)'
            }}>
              <AIAgentDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ===== TICKER / LOGOS ===== */}
      <div style={{ borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)', padding: '40px 0', background: 'var(--brand-secondary)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-around', opacity: 0.5, flexWrap: 'wrap', gap: '40px' }}>
            <img src="/assets/images/partners/google logo.svg" style={{ height: '30px', filter: 'grayscale(1) invert(1)' }} alt="Google" />
            {/* Add more logos here or reuse placeholders */}
            <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>OPENAI</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>SHOPIFY</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>NEXT.JS</span>
          </div>
        </div>
      </div>

      {/* ===== SERVICES BENTO GRID ===== */}
      <section id="services" className="section">
        <div className="container">
          <div className="section-header fade-in-up">
            <span className="section-label">{T('services.label')}</span>
            <h2 className="section-title">{T('services.title')}</h2>
            <p className="section-subtitle">{T('services.subtitle')}</p>
          </div>

          <div className="services-grid">
            {[
              { key: 'ai', icon: '🤖', accent: '#3b82f6', slug: 'ai-agents' },
              { key: 'web', icon: '🌐', accent: '#8b5cf6', slug: 'websites' },
              { key: 'shop', icon: '🛍️', accent: '#ec4899', slug: 'ecommerce' },
              { key: 'auto', icon: '⚡', accent: '#10b981', slug: 'automation' },
              { key: 'mvp', icon: '🚀', accent: '#f59e0b', slug: 'mvp' },
              { key: 'audit', icon: '📊', accent: '#6366f1', slug: 'ai-audit' },
            ].map((s, idx) => (
              <a href={`/services/${s.slug}`} key={s.key} className="service-card fade-in-up" style={{ animationDelay: `${0.1 * idx}s` }}>
                <div className="service-icon" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '12px', marginBottom: '24px' }}>
                  {s.icon}
                </div>
                <h3>{T(`services.${s.key}.title`)}</h3>
                <p style={{ marginTop: '12px', marginBottom: '24px' }}>{T(`services.${s.key}.desc`)}</p>
                <div className="service-tag">{T(`services.${s.key}.tag1`)}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      <section id="cases" className="section" style={{ borderTop: '1px solid var(--surface-border)' }}>
        <div className="container">
          <div className="section-header fade-in-up">
            <span className="section-label">{T('cases.label')}</span>
            <h2 className="section-title">{T('cases.title')}</h2>
            <p className="section-subtitle">{T('cases.subtitle')}</p>
          </div>

          <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x-mandatory pb-12" style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '48px', scrollSnapType: 'x mandatory' }}>
            {[
              { i: 1, slug: 'chatbot-ai-ecommerce', color: '#3b82f6' },
              { i: 2, slug: 'sklep-shopify-ai', color: '#ec4899' },
              { i: 3, slug: 'automatyzacja-n8n', color: '#10b981' },
              { i: 4, slug: 'aplikacja-mvp', color: '#f59e0b' },
            ].map(({ i, slug, color }) => (
              <a
                key={i}
                href={`/cases/${slug}`}
                className="service-card snap-center fade-in-up"
                style={{
                  minWidth: '350px',
                  maxWidth: '350px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  animationDelay: `${0.1 * i}s`,
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '16px'
                }}>
                  {T(`cases.case${i}.cat`)}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{T(`cases.case${i}.title`)}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px', flexGrow: 1 }}>{T(`cases.case${i}.desc`)}</p>

                <div style={{ display: 'flex', gap: '24px', borderTop: '1px solid var(--surface-border)', paddingTop: '16px' }}>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>{T(`cases.case${i}.stat1.value`)}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{T(`cases.case${i}.stat1.label`)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>{T(`cases.case${i}.stat2.value`)}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{T(`cases.case${i}.stat2.label`)}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="section bg-grid" style={{ borderTop: '1px solid var(--surface-border)' }}>
        <div className="container">
          <div className="section-header fade-in-up">
            <span className="section-label">{T('testimonials.label')}</span>
            <h2 className="section-title">{T('testimonials.title')}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="service-card fade-in-up" style={{ animationDelay: `${0.2 * i}s`, background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '4px', color: '#f59e0b' }}>★★★★★</div>
                <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '24px' }}>"{T(`testimonials.t${i}.text`)}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.9rem', color: 'white'
                  }}>
                    {T(`testimonials.t${i}.name`).charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{T(`testimonials.t${i}.name`)}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{T(`testimonials.t${i}.role`)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="section bg-grid" style={{ padding: '80px 0', borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)' }}>
        <div className="container">
          <div className="hero-stats" style={{ justifyContent: 'center' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="hero-stat" style={{ border: 'none', textAlign: 'center' }}>
                <div className="hero-stat-value" style={{ fontSize: '3rem', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {T(`hero.stat${i}.value`)}
                </div>
                <div className="hero-stat-label" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                  {T(`hero.stat${i}.label`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
