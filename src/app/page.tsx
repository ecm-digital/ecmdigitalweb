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

// Content configuration for personalization
const PERSONALIZATION_CONFIG = {
  shopify: {
    title: "Sklepy Shopify & E-commerce, które Zarabiają",
    subtitle: "Budujemy skalowalne platformy sprzedażowe zintegrowane z AI i automatyzacją marketingu.",
  },
  ai: {
    title: "Agenci AI & Automatyzacje Przyszłości",
    subtitle: "Wdrażamy inteligentnych agentów, którzy pracują za Ciebie 24/7. Oszczędzaj czas i skaluj biznes.",
  },
  web: {
    title: "Nowoczesne Strony & Aplikacje Webowe",
    subtitle: "Projektujemy szybkie, bezpieczne i piękne rozwiązania cyfrowe dopasowane do Twoich potrzeb.",
  }
};

function HomePageContent() {
  const { T } = useLanguage();
  const searchParams = useSearchParams();

  // Detect personalization context
  const serviceParam = searchParams.get('service') as keyof typeof PERSONALIZATION_CONFIG | null;
  const config = serviceParam && PERSONALIZATION_CONFIG[serviceParam] ? PERSONALIZATION_CONFIG[serviceParam] : null;

  const heroSubtitle = config ? config.subtitle : T('hero.subtitle');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale').forEach(el => observer.observe(el));

    console.log("ECM Digital: Premium 2026 Build V3 - Bento & AI Core Active");

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPos = window.scrollY;
      const progress = (scrollPos / scrollHeight) * 100;
      document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress-bar" />
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="container">
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '48px', alignItems: 'center' }}>
            <div className="hero-content">
              <div className="hero-badge">{T('hero.badge')}</div>
              <h1 className="hero-title premium-title">
                {config ? config.title : (
                  <>
                    {T('hero.title1')} <span className="accent">{T('hero.titleAccent')}</span> {T('hero.title2')}
                  </>
                )}
              </h1>
              <p className="hero-subtitle text-balance">{heroSubtitle}</p>
              <div className="hero-actions">
                <a href="#services" className="btn-primary">{T('hero.cta1')} →</a>
                <a href="#contact" className="btn-secondary">{T('hero.cta2')}</a>
              </div>
              <div className="hero-stats">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="hero-stat">
                    <div className="hero-stat-value">{T(`hero.stat${i}.value`)}</div>
                    <div className="hero-stat-label">{T(`hero.stat${i}.label`)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-visual fade-in-right">
              <AIAgentDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="section">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-label">● {T('services.label')}</div>
            <h2 className="section-title">{T('services.title')}</h2>
            <p className="section-subtitle">{T('services.subtitle')}</p>
          </div>
          <div className="services-grid">
            {[
              {
                key: 'ai',
                icon: '/assets/images/3d-icons/ai-agents.png',
                accent: 'linear-gradient(135deg, #e94560, #ff6b81)',
                slug: 'ai-agents'
              },
              {
                key: 'web',
                icon: '/assets/images/3d-icons/web-design.png',
                accent: 'linear-gradient(135deg, #e94560, #ff6b81)',
                slug: 'websites'
              },
              {
                key: 'shop',
                icon: '/assets/images/3d-icons/ecommerce.png',
                accent: 'linear-gradient(135deg, #e94560, #ff6b81)',
                slug: 'ecommerce'
              },
              {
                key: 'auto',
                icon: '/assets/images/3d-icons/automation.png',
                accent: 'linear-gradient(135deg, #e94560, #ff6b81)',
                slug: 'automation'
              },
              {
                key: 'mvp',
                icon: '🚀',
                accent: '#e94560',
                slug: 'mvp'
              },
              {
                key: 'audit',
                icon: '📊',
                accent: '#e94560',
                slug: 'ai-audit'
              },
            ].map((s, idx) => (
              <a
                key={s.key}
                href={`/services/${s.slug}`}
                className={`service-card fade-in delay-${idx + 1}`}
                style={{ '--card-accent': s.accent, textDecoration: 'none', color: 'inherit' } as React.CSSProperties}
              >
                <div className="service-content-overlay">
                  <div className="service-icon">
                    {typeof s.icon === 'string' && s.icon.startsWith('/') ? (
                      <img src={s.icon} alt={s.key} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      s.icon
                    )}
                  </div>
                  <h3>{T(`services.${s.key}.title`)}</h3>
                  <p>{T(`services.${s.key}.desc`)}</p>

                  <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                    <span className="service-tag">{T(`services.${s.key}.tag1`)}</span>
                    <span className="service-tag">{T(`services.${s.key}.tag2`)}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      <section id="cases" className="section">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-label">● {T('cases.label')}</div>
            <h2 className="section-title">{T('cases.title')}</h2>
            <p className="section-subtitle">{T('cases.subtitle')}</p>
          </div>
          <div className="cases-grid">
            {[
              { i: 1, slug: 'chatbot-ai-ecommerce' },
              { i: 2, slug: 'sklep-shopify-ai' },
              { i: 3, slug: 'automatyzacja-n8n' },
              { i: 4, slug: 'aplikacja-mvp' },
            ].map(({ i, slug }) => (
              <a key={i} href={`/cases/${slug}`} className={`case-card fade-in delay-${i}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="case-category">{T(`cases.case${i}.cat`)}</div>
                <h3>{T(`cases.case${i}.title`)}</h3>
                <p>{T(`cases.case${i}.desc`)}</p>
                <div className="case-stats">
                  <div className="case-stat">
                    <div className="case-stat-value">{T(`cases.case${i}.stat1.value`)}</div>
                    <div className="case-stat-label">{T(`cases.case${i}.stat1.label`)}</div>
                  </div>
                  <div className="case-stat">
                    <div className="case-stat-value">{T(`cases.case${i}.stat2.value`)}</div>
                    <div className="case-stat-label">{T(`cases.case${i}.stat2.label`)}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section >

      {/* ===== PROCESS ===== */}
      < section id="process" className="section" >
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-label">● {T('process.label')}</div>
            <h2 className="section-title">{T('process.title')}</h2>
            <p className="section-subtitle">{T('process.subtitle')}</p>
          </div>
          <div className="process-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`process-step fade-in delay-${i}`}>
                <div className="process-number">{i}</div>
                <h4>{T(`process.step${i}.title`)}</h4>
                <p>{T(`process.step${i}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="section">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-label">● {T('testimonials.label')}</div>
            <h2 className="section-title">{T('testimonials.title')}</h2>
            <p className="section-subtitle">{T('testimonials.subtitle')}</p>
          </div>
          <div className="testimonials-carousel-wrapper">
            <button className="carousel-nav prev" onClick={() => {
              const track = document.querySelector('.testimonials-track');
              if (track) (track as HTMLElement).scrollBy({ left: -400, behavior: 'smooth' });
            }}>‹</button>
            <div className="testimonials-track">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`testimonial-card-slide fade-in delay-${i}`}>
                  <div className="testimonial-card">
                    <div className="testimonial-stars">★★★★★</div>
                    <p className="testimonial-text">&ldquo;{T(`testimonials.t${i}.text`)}&rdquo;</p>
                    <div className="testimonial-author">
                      <div className="testimonial-avatar">
                        {T(`testimonials.t${i}.name`).split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="testimonial-name">{T(`testimonials.t${i}.name`)}</div>
                        <div className="testimonial-role">{T(`testimonials.t${i}.role`)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-nav next" onClick={() => {
              const track = document.querySelector('.testimonials-track');
              if (track) (track as HTMLElement).scrollBy({ left: 400, behavior: 'smooth' });
            }}>›</button>
          </div>
        </div>
      </section >

      {/* ===== FAQ ===== */}
      <section id="faq" className="section">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-label">● {T('faq.label')}</div>
            <h2 className="section-title">{T('faq.title')}</h2>
            <p className="section-subtitle">{T('faq.subtitle')}</p>
          </div>
          <div className="faq-list">
            {[1, 2, 3, 4, 5].map(i => (
              <FaqItem key={i} question={T(`faq.q${i}`)} answer={T(`faq.a${i}`)} delay={i} />
            ))}
          </div>
        </div>
      </section >

      {/* ===== PARTNERS ===== */}
      < section className="section" >
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-label">● {T('partners.label')}</div>
          </div>
          <div className="partners-row fade-in">
            <img src="/assets/images/partners/google logo.svg" alt="Google" className="partner-logo" loading="lazy" />
            <img src="/assets/images/partners/Cloudwise Logo.png" alt="Cloudwise" className="partner-logo" loading="lazy" />
          </div>
        </div>
      </section >

      {/* ===== ABOUT ===== */}
      <section id="about" className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-content fade-in-left">
              <div className="section-label">● {T('about.label')}</div>
              <h2 className="section-title" style={{ textAlign: 'left' }}>{T('about.title')}</h2>
              <p>{T('about.p1')}</p>
              <p>{T('about.p2')}</p>
              <div className="about-stats">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="about-stat">
                    <div className="about-stat-value">{T(`about.stat${i}.value`)}</div>
                    <div className="about-stat-label">{T(`about.stat${i}.label`)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-visual fade-in-right">
              <div className="about-card">
                <div className="about-card-badge">{T('about.badge')}</div>
                <h4>{T('about.card.title')}</h4>
                <p>{T('about.card.text')}</p>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* ===== TEAM ===== */}
      < section id="team" className="section" >
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-label">● {T('team.label')}</div>
            <h2 className="section-title">{T('team.title')}</h2>
            <p className="section-subtitle">{T('team.subtitle')}</p>
          </div>
          <div className="team-grid">
            {['tomasz', 'karol', 'marta'].map((member, idx) => (
              <div key={member} className={`team-card fade-in delay-${idx + 1}`}>
                <div className="team-avatar">
                  {member === 'tomasz' ? (
                    <img src="/assets/images/tomasz-profile-optimized.jpg" alt={T(`team.${member}.name`)} loading="lazy" />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      background: 'linear-gradient(135deg, #e94560, #0f3460)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '1.5rem', fontWeight: 700
                    }}>
                      {T(`team.${member}.name`).split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                <h4>{T(`team.${member}.name`)}</h4>
                <div className="team-role">{T(`team.${member}.role`)}</div>
                <p className="team-desc">{T(`team.${member}.desc`)}</p>
                <div className="team-skills">
                  <span className="team-skill">{T(`team.${member}.skill1`)}</span>
                  <span className="team-skill">{T(`team.${member}.skill2`)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      <ContactSection />

      <NewsletterSection lang="pl" />

      <Footer />

      <ScrollToTop />
    </>
  );
}

function FaqItem({ question, answer, delay }: { question: string; answer: string; delay: number }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const itemRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={itemRef}
      className={`faq-item fade-in delay-${delay}${visible ? ' visible' : ''}${open ? ' open' : ''}`}
    >
      <div className="faq-question" onClick={() => setOpen(!open)}>
        <span>{question}</span>
        <span className="faq-toggle">{open ? '−' : '+'}</span>
      </div>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setVisible(window.scrollY > 400);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      className={`scroll-top${visible ? ' visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="loading-screen">Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
