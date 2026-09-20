'use client';

import { useLanguage } from "@/context/LanguageContext";

export default function CTABannerSection() {
  const { T } = useLanguage();

  return (
    <section className="cta-banner-section reveal-on-scroll relative overflow-hidden" style={{ padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container relative z-10">
        <div
          className="cta-banner-panel relative overflow-hidden"
          style={{
            padding: '72px 32px',
            borderRadius: '32px',
            textAlign: 'center',
            background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.2) 0%, rgba(59, 130, 246, 0.1) 40%, rgba(3, 7, 18, 0.95) 90%)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)'
          }}
        >
          {/* Ambient Glow spot */}
          <div className="absolute" style={{ top: '-30%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '300px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.035em', color: '#ffffff', position: 'relative', zIndex: 2 }}>
            {T('bannercta.title')}
          </h2>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.7)', maxWidth: '680px', margin: '0 auto 40px', lineHeight: 1.65, position: 'relative', zIndex: 2 }}>
            {T('bannercta.desc')}
          </p>
          <a
            href="#contact"
            className="btn-primary premium-button-shine cta-banner-btn"
            style={{
              padding: '18px 44px',
              fontSize: '1.08rem',
              borderRadius: '999px',
              position: 'relative',
              zIndex: 2,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span>{T('bannercta.button')}</span>
            <span style={{ fontSize: '1.2rem' }}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
