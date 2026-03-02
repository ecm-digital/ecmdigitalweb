'use client';

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";

const ParticlesBackground = dynamic(() => import('@/components/ParticlesBackground'), { ssr: false });
const AIAgentDemo = dynamic(() => import('@/components/AIAgentDemo'), { ssr: false });

export default function HeroSection() {
  const { T } = useLanguage();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [serviceParam, setServiceParam] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setServiceParam(params.get('service'));
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      x: e.clientX / window.innerWidth - 0.5,
      y: e.clientY / window.innerHeight - 0.5,
    });
  };

  const isValidService = serviceParam && serviceParam !== 'null' && (T(`personalization.${serviceParam}.title`) !== `personalization.${serviceParam}.title`);
  const heroSubtitle = isValidService ? T(`personalization.${serviceParam}.subtitle`) : T('hero.subtitle');

  return (
    <section
      className="hero-section relative overflow-hidden"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '100px' }}
      onMouseMove={handleMouseMove}
    >
      <ParticlesBackground />

      <div className="absolute" style={{ top: '20%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0, transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`, transition: 'transform 0.2s ease-out' }} />
      <div className="absolute" style={{ bottom: '10%', right: '5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`, transition: 'transform 0.2s ease-out' }} />

      <div className="container relative z-10">
        <div className="hero-content" style={{ maxWidth: '1000px', margin: '0 auto 80px', textAlign: 'center' }}>
          <div className="hero-badge fade-in-up" style={{ margin: '0 auto 40px', display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '10px 28px', borderRadius: '999px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 0 30px rgba(59, 130, 246, 0.15)', backdropFilter: 'blur(20px)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60a5fa', boxShadow: '0 0 15px #60a5fa' }} className="animate-pulse" />
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

        <div className="fade-in-up" style={{ animationDelay: '0.4s', maxWidth: '1000px', margin: '0 auto', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))' }}>
          <div className="premium-animated-border">
            <AIAgentDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
