'use client';

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import posthog from "posthog-js";
import { useFeatureFlagVariantKey } from "posthog-js/react";

const ParticlesBackground = dynamic(() => import('@/components/ParticlesBackground'), { ssr: false });
const AIAgentDemo = dynamic(() => import('@/components/AIAgentDemo'), { ssr: false });

export default function HeroSection() {
  const { T } = useLanguage();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [serviceParam, setServiceParam] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Retrieve the active variant from PostHog
  const variant = useFeatureFlagVariantKey('homepage-hero-ab-test');
  const isVariantB = variant === 'test-headline';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setServiceParam(params.get('service'));
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    setMousePos({
      x: e.clientX / window.innerWidth - 0.5,
      y: e.clientY / window.innerHeight - 0.5,
    });
  }, [isMobile]);

  const handleCtaClick = (ctaName: string) => {
    posthog.capture('hero_cta_clicked', {
      cta_name: ctaName,
      variant: variant || 'control'
    });
  };

  const isValidService = serviceParam && serviceParam !== 'null' && (T(`personalization.${serviceParam}.title`) !== `personalization.${serviceParam}.title`);
  const heroSubtitle = isValidService ? T(`personalization.${serviceParam}.subtitle`) : T('hero.subtitle');

  const title1Key = isVariantB ? 'hero.variant_b.title1' : 'hero.title1';
  const titleAccentKey = isVariantB ? 'hero.variant_b.titleAccent' : 'hero.titleAccent';
  const title2Key = isVariantB ? 'hero.variant_b.title2' : 'hero.title2';

  return (
    <section
      className="hero-section relative overflow-hidden"
      style={{ minHeight: isMobile ? 'auto' : '100vh', display: 'flex', alignItems: 'center', paddingTop: isMobile ? '120px' : '150px', paddingBottom: '90px' }}
      onMouseMove={handleMouseMove}
    >
      <ParticlesBackground />

      {/* Dynamic Ambient Background Glows */}
      {!isMobile && (
        <>
          <div
            className="absolute transition-transform duration-700 ease-out"
            style={{
              left: '20%',
              top: '15%',
              width: '500px',
              height: '500px',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%)',
              filter: 'blur(100px)',
              zIndex: 0,
              pointerEvents: 'none',
              transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`
            }}
          />
          <div
            className="absolute transition-transform duration-700 ease-out"
            style={{
              right: '15%',
              top: '30%',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, rgba(139, 92, 246, 0.06) 40%, transparent 70%)',
              filter: 'blur(120px)',
              zIndex: 0,
              pointerEvents: 'none',
              transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)`
            }}
          />
        </>
      )}

      <div className="container relative z-10">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '56px', alignItems: 'center', width: '100%' }}>
          
          {/* Top Column: Text & CTAs */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '840px', margin: '0 auto' }}>
            
            {/* Elevated Pill Badge */}
            <div className="hero-badge fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(99, 102, 241, 0.25)', backdropFilter: 'blur(20px)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)', marginBottom: '24px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 12px #3b82f6', flexShrink: 0 }} className="animate-pulse" />
              <span>{T('hero.badge')}</span>
            </div>

            {/* Elevated Title */}
            <h1 className="hero-title fade-in-up" style={{ animationDelay: '0.1s', marginBottom: '20px', lineHeight: 1.15, fontSize: 'clamp(1.85rem, 5.5vw, 3.8rem)', letterSpacing: '-0.035em', fontWeight: 800, color: '#ffffff' }}>
              {isValidService ? T(`personalization.${serviceParam}.title`) : (
                <>
                  <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.9)' }}>{T(title1Key)}</span> <br className="hidden md:inline" />
                  <span
                    className="font-extrabold"
                    style={{
                      display: 'inline-block',
                      margin: '4px 0',
                      background: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 40%, #c084fc 80%, #f472b6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 4px 15px rgba(99, 102, 241, 0.3))'
                    }}
                  >
                    {T(titleAccentKey)}
                  </span> <br className="hidden md:inline" />
                  <span style={{ fontWeight: 700 }}>{T(title2Key)}</span>
                </>
              )}
            </h1>

            {/* Elevated Subtitle */}
            <p className="hero-subtitle fade-in-up" style={{ animationDelay: '0.2s', marginBottom: '32px', maxWidth: '660px', fontSize: 'clamp(1rem, 2.5vw, 1.12rem)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, fontWeight: 400 }}>
              {heroSubtitle}
            </p>

            {/* Elevated Action Buttons */}
            <div className="hero-actions fade-in-up" style={{ animationDelay: '0.3s', display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a
                href="#services"
                className="btn-primary premium-button-shine"
                style={{ padding: '14px 28px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={() => handleCtaClick('explore_services')}
              >
                <span>{T('hero.cta1')}</span>
                <span style={{ fontSize: '1.1rem' }}>→</span>
              </a>
              <a
                href="#contact"
                className="btn-secondary"
                style={{ padding: '16px 36px', fontSize: '1.02rem' }}
                onClick={() => handleCtaClick('book_analysis')}
              >
                {T('hero.cta2')}
              </a>
            </div>
          </div>

          {/* Bottom Column: Interactive Dashboard Mockup Frame */}
          <div className="fade-in-up" style={{ animationDelay: '0.4s', width: '100%', maxWidth: '900px', margin: '0 auto', filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.75))', zIndex: 1 }}>
            <div className="premium-animated-border" style={{ borderRadius: '24px', padding: '1px', background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(255,255,255,0.05) 50%, rgba(236,72,153,0.3))' }}>
              <div style={{ borderRadius: '23px', overflow: 'hidden', background: '#080c14' }}>
                <AIAgentDemo />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
