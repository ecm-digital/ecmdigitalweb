'use client';

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";

const ParticlesBackground = dynamic(() => import('@/components/ParticlesBackground'), { ssr: false });
const AIAgentDemo = dynamic(() => import('@/components/AIAgentDemo'), { ssr: false });

export default function HeroSection() {
  const { T } = useLanguage();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [serviceParam, setServiceParam] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  const isValidService = serviceParam && serviceParam !== 'null' && (T(`personalization.${serviceParam}.title`) !== `personalization.${serviceParam}.title`);
  const heroSubtitle = isValidService ? T(`personalization.${serviceParam}.subtitle`) : T('hero.subtitle');

  return (
    <section
      className="hero-section relative overflow-hidden"
      style={{ minHeight: isMobile ? 'auto' : '100vh', display: 'flex', alignItems: 'center', paddingTop: isMobile ? '120px' : '140px', paddingBottom: '80px' }}
      onMouseMove={handleMouseMove}
    >
      <ParticlesBackground />

      {/* Ambient background glow - extremely subtle behind the dashboard mockup */}
      {!isMobile && (
        <div className="absolute" style={{ right: '10%', top: '20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, transparent 70%)', filter: 'blur(120px)', zIndex: 0, pointerEvents: 'none' }} />
      )}

      <div className="container relative z-10">
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.15fr 1fr', gap: '64px', alignItems: 'center' }}>
          
          {/* Left Column: Text & CTAs */}
          <div style={{ textAlign: isMobile ? 'center' : 'left', display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start' }}>
            <div className="hero-badge fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', borderRadius: '999px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} className="animate-pulse" />
              {T('hero.badge')}
            </div>

            <h1 className="hero-title fade-in-up" style={{ animationDelay: '0.1s', marginBottom: '24px', lineHeight: 1.15, fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)', letterSpacing: '-0.03em', fontWeight: 800, color: '#ffffff' }}>
              {isValidService ? T(`personalization.${serviceParam}.title`) : (
                <>
                  <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.85)' }}>{T('hero.title1')}</span> <br />
                  <span className="premium-text-gradient font-extrabold" style={{ display: 'inline-block', margin: '4px 0' }}>{T('hero.titleAccent')}</span> <br />
                  <span style={{ fontWeight: 700 }}>{T('hero.title2')}</span>
                </>
              )}
            </h1>

            <p className="hero-subtitle fade-in-up" style={{ animationDelay: '0.2s', marginBottom: '36px', maxWidth: '580px', fontSize: '1.08rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, fontWeight: 400 }}>
              {heroSubtitle}
            </p>

            <div className="hero-actions fade-in-up" style={{ animationDelay: '0.3s', display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
              <a href="#services" className="btn-primary">
                  {T('hero.cta1')}
              </a>
              <a href="#contact" className="btn-secondary">
                  {T('hero.cta2')}
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Dashboard Mockup */}
          <div className="fade-in-up" style={{ animationDelay: '0.4s', width: '100%', maxWidth: isMobile ? '600px' : 'none', margin: '0 auto', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.65))', zIndex: 1 }}>
            <div className="premium-animated-border" style={{ borderRadius: '20px' }}>
              <AIAgentDemo />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
