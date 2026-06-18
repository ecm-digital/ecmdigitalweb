'use client';

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const STEPS = [
  { num: '01', titleKey: 'process.step1.title', descKey: 'process.step1.desc', icon: '🎯', color: '#3b82f6' },
  { num: '02', titleKey: 'process.step2.title', descKey: 'process.step2.desc', icon: '🧠', color: '#8b5cf6' },
  { num: '03', titleKey: 'process.step3.title', descKey: 'process.step3.desc', icon: '⚡', color: '#ec4899' },
  { num: '04', titleKey: 'process.step4.title', descKey: 'process.step4.desc', icon: '🚀', color: '#10b981' },
];

export default function ProcessSection() {
  const { T } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [approved, setApproved] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleStepClick = (idx: number) => {
    setActiveStep(idx);
    if (idx !== 2) {
      setApproved(false);
    }
  };

  const handleApprove = () => {
    setApproved(true);
    setClickCount(prev => prev + 1);
  };

  return (
    <section id="process" className="section section-polish relative reveal-on-scroll" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.02) 0%, transparent 80%)' }}>
      <div className="container relative z-10">
        
        {/* Section Header */}
        <div className="section-header text-center fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px' }}>
          <span className="section-label" style={{ padding: '8px 16px', background: 'rgba(99, 102, 241, 0.06)', color: 'rgba(255,255,255,0.7)', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {T('process.label')}
          </span>
          <h2 className="section-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', marginTop: '16px', letterSpacing: '-0.03em', fontWeight: 800 }}>
            {T('process.title')}
          </h2>
          <p className="section-subtitle" style={{ maxWidth: '640px', color: 'rgba(255,255,255,0.45)', marginTop: '16px', fontSize: '1.05rem', lineHeight: 1.6 }}>
            {T('process.subtitle')}
          </p>
        </div>

        {/* Modular Showcase Layout */}
        <div className="portal-showcase-grid">
          
          {/* Left Column: Timeline Step Indicators */}
          <div className="portal-step-nav fade-in-left" style={{ position: 'relative' }}>
            {/* Glowing vertical connector line */}
            <div style={{
              position: 'absolute',
              left: '21px',
              top: '40px',
              bottom: '40px',
              width: '1px',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03))',
              zIndex: 0
            }} />

            {STEPS.map((step, idx) => (
              <button
                key={idx}
                onClick={() => handleStepClick(idx)}
                className={`portal-step-item ${activeStep === idx ? 'active' : ''}`}
                style={{ 
                  width: '100%', 
                  border: 'none', 
                  background: 'none', 
                  color: 'inherit',
                  padding: '24px 24px 24px 48px',
                  marginBottom: '12px',
                  display: 'block',
                  zIndex: 2,
                  position: 'relative'
                }}
              >
                {/* Local Active Indicator Bar - perfectly aligned locally */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '24px',
                  bottom: '24px',
                  width: '3px',
                  background: activeStep === idx ? step.color : 'transparent',
                  boxShadow: activeStep === idx ? `0 0 10px ${step.color}` : 'none',
                  borderRadius: '0 4px 4px 0',
                  transition: 'all 0.3s ease'
                }} />
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {/* Step bubble */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: activeStep === idx ? `${step.color}15` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${activeStep === idx ? step.color : 'rgba(255,255,255,0.05)'}`,
                    color: activeStep === idx ? step.color : 'rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    transition: 'all 0.3s ease',
                    flexShrink: 0
                  }}>
                    {step.num}
                  </div>
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 700, 
                    color: activeStep === idx ? '#ffffff' : 'rgba(255,255,255,0.5)', 
                    margin: 0, 
                    transition: 'color 0.3s',
                    letterSpacing: '-0.01em'
                  }}>
                    {T(step.titleKey)}
                  </h3>
                </div>
                
                <p style={{ 
                  fontSize: '0.86rem', 
                  color: activeStep === idx ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.3)', 
                  lineHeight: 1.5, 
                  marginTop: '10px',
                  textAlign: 'left',
                  transition: 'color 0.3s'
                }}>
                  {T(step.descKey)}
                </p>
              </button>
            ))}
          </div>

          {/* Right Column: High-Fidelity Product Mockup */}
          <div className="portal-preview-container fade-in-right">
            <div className="premium-dashboard-mockup flex flex-col h-[420px] w-full border border-white/5 bg-slate-950/40" style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }}>
              
              {/* Window Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/2">
                <div className="flex items-center gap-2">
                  {/* Mac Buttons */}
                  <div className="flex gap-1.5 mr-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
                    ECM<span style={{ color: '#6366f1' }}>Portal</span>
                  </span>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                  <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>
                    live-project-center
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600 }}>ON TRACK (98%)</span>
                </div>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex border-b border-white/5 bg-[#030306]/60 px-5 py-0.5 gap-4 overflow-x-auto select-none">
                {['Strategia & Cele', 'Sprinty na żywo', 'Akceptacje', 'Handover VOD'].map((tabName, tabIdx) => (
                  <button 
                    key={tabIdx}
                    onClick={() => setActiveStep(tabIdx)} 
                    style={{
                      border: 'none',
                      background: 'none',
                      fontSize: '0.72rem',
                      padding: '10px 4px',
                      color: activeStep === tabIdx ? '#ffffff' : 'rgba(255,255,255,0.35)',
                      borderBottom: activeStep === tabIdx ? `2px solid ${STEPS[tabIdx].color}` : '2px solid transparent',
                      fontWeight: activeStep === tabIdx ? 600 : 500,
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer'
                    }}
                  >
                    {tabName}
                  </button>
                ))}
              </div>

              {/* Active Workspace Area */}
              <div className="flex-1 p-5 overflow-y-auto bg-slate-950/20">
                
                {/* View 1: Roadmap & Strategy */}
                {activeStep === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="fade-in-up">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <div>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Kamień Milowy #1: Analiza & Strategia</h4>
                        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>Data ukończenia: Dzień 5 • Status: Zaakceptowano</p>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>UKOŃCZONE</span>
                    </div>

                    {/* Progress timeline items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[
                        { title: 'Zdefiniowanie person i bazy wiedzy AI', desc: 'Mapowanie scenariuszy obsługi klienta' },
                        { title: 'Schemat architektury integracji CRM & n8n', desc: 'Połączenie systemów i przepływ danych' },
                        { title: 'Audyt wąskich gardeł w lejku sprzedaży', desc: 'Identyfikacja etapów z utratą leadów' }
                      ].map((item, idx) => (
                        <div key={idx} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ color: '#10b981', fontSize: '0.9rem' }}>✓</span>
                          <div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#ffffff' }}>{item.title}</div>
                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* View 2: Live Developer Sprints */}
                {activeStep === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="fade-in-up">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <div>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Sprint #2: Integracja Asystenta AI</h4>
                        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>Bieżący postęp prac programistycznych</p>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8b5cf6' }}>Postęp: 85%</span>
                    </div>

                    {/* Progress indicator */}
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ width: '85%', height: '100%', background: '#8b5cf6' }} />
                    </div>

                    {/* Kanban style visualizer */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px' }}>
                        <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '8px' }}>W TOKU</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>Trening LLM na bazie danych firmy</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                          <span style={{ fontSize: '0.62rem', color: '#8b5cf6', background: 'rgba(139,92,246,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Gemini 1.5</span>
                          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Darek (Dev)</span>
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px' }}>
                        <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '8px' }}>UKOŃCZONE</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textDecoration: 'line-through' }}>Webhooki Morizon i Otodom</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                          <span style={{ fontSize: '0.62rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '4px' }}>API Gateway</span>
                          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>Kamil (Dev)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* View 3: Decision & Approvals Module */}
                {activeStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%', justifyContent: 'center' }} className="fade-in-up">
                    {!approved ? (
                      <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(236,72,153,0.1)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '1.2rem' }}>
                          📝
                        </div>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 6px', color: '#ffffff' }}>Akceptacja Prototypu AI (v1.2)</h4>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: '0 auto 16px', maxWidth: '300px', lineHeight: 1.4 }}>
                          Zapoznaj się z odpowiedziami Agenta AI w bazie testowej i zatwierdź go do integracji z produkcyjnym CRM.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                          <button
                            onClick={handleApprove}
                            className="btn-approve-click"
                            style={{
                              background: '#ffffff',
                              color: '#000000',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            AKCEPTUJĘ PROJEKT
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '10px 0' }} className="fade-in-up">
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '1.2rem' }}>
                          ✓
                        </div>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 4px', color: '#10b981' }}>Etap zaakceptowany!</h4>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: '0 auto', maxWidth: '300px', lineHeight: 1.4 }}>
                          Dziękujemy! Twój Project Manager otrzymał alert. Automatycznie rozpoczęliśmy Etap 4 (Wdrożenie & VOD).
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* View 4: VOD Knowledge Base & Handover */}
                {activeStep === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="fade-in-up">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Szkolenie Zespołu (VOD)</h4>
                        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>Baza wiedzy dostępna na zawsze dla Twoich pracowników</p>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>2 Kursy</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[
                        { title: 'Konfiguracja CRM & powiadomień', duration: '5m 12s', progress: '100% ukończone' },
                        { title: 'Zarządzanie bazą wiedzy AI', duration: '3m 45s', progress: 'Rozpocznij naukę' }
                      ].map((vod, i) => (
                        <div key={i} className="vod-card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '80px', cursor: 'pointer' }}>
                          <div className="vod-thumbnail" style={{ height: '32px', borderRadius: '4px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)', transition: 'all 0.3s' }}>
                            ▶
                          </div>
                          <div style={{ marginTop: '8px' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vod.title}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                              <span>Czas: {vod.duration}</span>
                              <span style={{ color: vod.progress.includes('100%') ? '#10b981' : '#10b981' }}>{vod.progress}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ background: 'rgba(99,102,241,0.04)', border: '1px dashed rgba(99,102,241,0.15)', padding: '10px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Chcesz dodać nowe integracje?</span>
                      <span style={{ color: '#818cf8', fontWeight: 600, cursor: 'pointer' }}>Utwórz zgłoszenie support →</span>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
