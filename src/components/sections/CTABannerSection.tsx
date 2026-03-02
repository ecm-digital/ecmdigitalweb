'use client';

import { useLanguage } from "@/context/LanguageContext";

export default function CTABannerSection() {
  const { T } = useLanguage();

  return (
    <section className="section relative reveal-on-scroll" style={{ padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container relative z-10">
        <div className="premium-glass-panel" style={{ padding: '60px 40px', borderRadius: '32px', textAlign: 'center', background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, rgba(15, 15, 25, 0.95) 80%)', border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 2px 20px rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.02em', color: 'white' }}>{T('bannercta.title')}</h2>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.6 }}>{T('bannercta.desc')}</p>
          <a href="#contact" className="btn-primary premium-button-shine" style={{ display: 'inline-block', padding: '18px 48px', fontSize: '1.1rem', borderRadius: '999px', fontWeight: 700 }}>
            {T('bannercta.button')}
          </a>
        </div>
      </div>
    </section>
  );
}
