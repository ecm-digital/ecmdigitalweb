'use client';

import { useLanguage } from "@/context/LanguageContext";

const STEPS = [
  { num: '01', icon: '🎯', color: '#3b82f6' },
  { num: '02', icon: '🧠', color: '#8b5cf6' },
  { num: '03', icon: '⚡', color: '#ec4899' },
  { num: '04', icon: '🚀', color: '#10b981' },
];

export default function ProcessSection() {
  const { T } = useLanguage();

  return (
    <section id="process" className="section relative reveal-on-scroll" style={{ padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'radial-gradient(ellipse at center, rgba(30, 58, 138, 0.05) 0%, transparent 70%)' }}>
      <div className="container relative z-10">
        <div className="section-header text-center fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="section-label" style={{ padding: '8px 16px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '999px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>{T('process.label')}</span>
          <h2 className="section-title">{T('process.title')}</h2>
          <p className="section-subtitle">{T('process.subtitle')}</p>
        </div>

        <div className="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginTop: '60px', position: 'relative' }}>
          <div className="process-line" style={{ position: 'absolute', top: '40px', left: '10%', right: '10%', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)', zIndex: 0 }} />

          {STEPS.map((step, idx) => (
            <div key={idx} className="process-card premium-glass-panel fade-in-up" style={{ padding: '40px 30px', textAlign: 'center', position: 'relative', zIndex: 1, animationDelay: `${idx * 0.15}s` }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))', border: `1px solid ${step.color}50`, boxShadow: `0 0 30px ${step.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '28px', height: '28px', borderRadius: '50%', background: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: 'white', border: '2px solid rgba(10,10,15,1)' }}>
                  {step.num}
                </div>
                {step.icon}
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'white' }}>{T(`process.step${idx + 1}.title`)}</h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{T(`process.step${idx + 1}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
