'use client';

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

// Local translations for mock elements to ensure bulletproof performance
const MOCK_TRANSLATIONS = {
  pl: {
    statusWaiting: "Oczekuje na Twoją decyzję",
    statusApproved: "Zatwierdzony przez klienta",
    btnApprove: "Akceptuję makiety i architekturę AI →",
    approvedSuccess: "🎉 Projekt Zaakceptowany!",
    approvedDesc: "Status zaktualizowany w czasie rzeczywistym. System n8n automatycznie uruchomił proces wdrażania frontendu.",
    roadmapTitle: "📍 PROJEKT: KROK 1 — STRATEGIA & MAPA DROGOWA",
    liveTitle: "⚡ PROJEKT: KROK 2 — POSTĘP WDROŻENIA NA ŻYWO",
    approvalsTitle: "✅ PROJEKT: KROK 3 — BŁYSKAWICZNE AKCEPTACJE",
    handoverTitle: "📖 PROJEKT: KROK 4 — BAZA WIEDZY VOD DLA ZESPOŁU",
    progress: "Postęp projektu",
    step1_1: "Warsztat strategiczny & Cele ROI",
    step1_2: "Architektura bazy danych i promptów",
    step1_3: "Projektowanie UI/UX makiet strony",
    step1_4: "Kodowanie frontendu i integracja n8n",
    step1_5: "Testy wydajnościowe & Launch",
    log1: "Zakończono integrację HubSpot CRM API",
    log2: "Wdrożono zaawansowaną bazę wiedzy RAG",
    log3: "Konfiguracja asystenta WhatsApp — OK",
    log4: "Test obciążeniowy modeli LLM — Sukces",
    log5: "Optymalizacja szybkości ładowania (LCP < 0.8s)"
  },
  en: {
    statusWaiting: "Awaiting your decision",
    statusApproved: "Approved by client",
    btnApprove: "Approve designs & AI architecture →",
    approvedSuccess: "🎉 Project Approved!",
    approvedDesc: "Status updated in real-time. n8n workflow has automatically triggered the frontend deployment process.",
    roadmapTitle: "📍 PROJECT: STEP 1 — STRATEGY & ROADMAP",
    liveTitle: "⚡ PROJECT: STEP 2 — LIVE DEVELOPMENT FEED",
    approvalsTitle: "✅ PROJECT: STEP 3 — INSTANT APPROVALS",
    handoverTitle: "📖 PROJECT: STEP 4 — VIDEO VOD KNOWLEDGE BASE",
    progress: "Project Progress",
    step1_1: "Strategic Workshop & ROI Goals Alignment",
    step1_2: "Database Schema & Prompts Architecture",
    step1_3: "UI/UX High-Fidelity Website Design",
    step1_4: "Frontend Development & n8n Integration",
    step1_5: "Performance Testing & Launch",
    log1: "HubSpot CRM API integration completed",
    log2: "Advanced RAG knowledge base deployed",
    log3: "WhatsApp AI agent configuration - OK",
    log4: "LLM model stress testing - Success",
    log5: "LCP speed optimization completed (< 0.8s)"
  },
  de: {
    statusWaiting: "Wartet auf Ihre Entscheidung",
    statusApproved: "Vom Kunden genehmigt",
    btnApprove: "Design & KI-Architektur freigeben →",
    approvedSuccess: "🎉 Projekt Freigegeben!",
    approvedDesc: "Status in Echtzeit aktualisiert. Der n8n-Workflow hat automatisch den Frontend-Deployment-Prozess gestartet.",
    roadmapTitle: "📍 PROJEKT: SCHRITT 1 — STRATEGIE & ROADMAP",
    liveTitle: "⚡ PROJEKT: SCHRITT 2 — LIVE-ENTWICKLUNGSFEED",
    approvalsTitle: "✅ PROJEKT: SCHRITT 3 — SOFORTIGE FREIGABEN",
    handoverTitle: "📖 PROJEKT: SCHRITT 4 — VOD-WISSENSDATENBANK",
    progress: "Projektfortschritt",
    step1_1: "Strategie-Workshop & ROI-Ziele Ausrichtung",
    step1_2: "Datenbankschema & Prompts-Architektur",
    step1_3: "High-Fidelity UI/UX-Webdesign",
    step1_4: "Frontend-Entwicklung & n8n-Integration",
    step1_5: "Leistungstests & Launch",
    log1: "HubSpot CRM API Integration abgeschlossen",
    log2: "Erweiterte RAG-Wissensdatenbank bereitgestellt",
    log3: "WhatsApp KI-Agent Konfiguration - OK",
    log4: "LLM-Modell Stresstest - Erfolg",
    log5: "LCP-Geschwindigkeitsoptimierung abgeschlossen (< 0,8s)"
  },
  es: {
    statusWaiting: "Esperando tu decisión",
    statusApproved: "Aprobado por el cliente",
    btnApprove: "Aprobar diseños y arquitectura de IA →",
    approvedSuccess: "🎉 ¡Proyecto Aprobado!",
    approvedDesc: "Estado actualizado en tiempo real. El flujo de n8n ha activado automáticamente el proceso de despliegue frontend.",
    roadmapTitle: "📍 PROYECTO: PASO 1 — ESTRATEGIA Y RUTA",
    liveTitle: "⚡ PROYECTO: PASO 2 — HISTORIAL DE DESARROLLO EN VIVO",
    approvalsTitle: "✅ PROYECTO: PASO 3 — APROBACIONES AL INSTANTE",
    handoverTitle: "📖 PROYECTO: PASO 4 — BASE O VOD DE CONOCIMIENTO",
    progress: "Progreso del Proyecto",
    step1_1: "Taller estratégico y objetivos de ROI",
    step1_2: "Arquitectura de base de datos y prompts",
    step1_3: "Diseño UI/UX de alta fidelidad",
    step1_4: "Desarrollo frontend e integración de n8n",
    step1_5: "Pruebas de rendimiento y lanzamiento",
    log1: "Integración de API de HubSpot CRM completada",
    log2: "Base de datos RAG avanzada desplegada",
    log3: "Configuración del agente de WhatsApp de IA - OK",
    log4: "Prueba de esfuerzo del modelo LLM - Éxito",
    log5: "Optimización de velocidad LCP completada (< 0.8s)"
  }
};

export default function ProcessSection() {
  const { T, lang } = useLanguage();
  const t = MOCK_TRANSLATIONS[lang as keyof typeof MOCK_TRANSLATIONS] || MOCK_TRANSLATIONS.pl;

  const [activeStep, setActiveStep] = useState(0);
  const [approvedProject, setApprovedProject] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 1024);
    }
  }, []);

  const steps = [
    { num: '01', icon: '📍', key: 'step1' },
    { num: '02', icon: '⚡', key: 'step2' },
    { num: '03', icon: '✅', key: 'step3' },
    { num: '04', icon: '📖', key: 'step4' }
  ];

  const handleApprove = () => {
    setApprovedProject(true);
  };

  const renderMockupContent = (stepIdx: number) => {
    switch (stepIdx) {
      case 0:
        return (
          <div className="portal-roadmap animate-fade">
            <div className="portal-mock-header">
              <span className="folder-icon">📂</span>
              <h4>{t.roadmapTitle}</h4>
            </div>
            <div className="roadmap-progress">
              <div className="progress-label">
                <span>{t.progress}</span>
                <span className="percent">40%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '40%' }}></div>
              </div>
            </div>
            <ul className="roadmap-checklist">
              <li className="done">✓ <span>{t.step1_1}</span></li>
              <li className="done">✓ <span>{t.step1_2}</span></li>
              <li className="active"><span className="bullet-active">●</span> <span>{t.step1_3}</span></li>
              <li className="pending">○ <span>{t.step1_4}</span></li>
              <li className="pending">○ <span>{t.step1_5}</span></li>
            </ul>
          </div>
        );
      case 1:
        return (
          <div className="portal-live animate-fade">
            <div className="portal-mock-header">
              <span className="folder-icon">💻</span>
              <h4>{t.liveTitle}</h4>
            </div>
            <div className="live-log-container">
              {[t.log1, t.log2, t.log3, t.log4, t.log5].map((log, idx) => (
                <div key={idx} className="live-log-row">
                  <span className="log-time">[{new Date(Date.now() - (5 - idx) * 3600000).toLocaleTimeString(lang === 'pl' ? 'pl-PL' : 'en-US', { hour: '2-digit', minute: '2-digit' })}]</span>
                  <span className="log-badge">git commit</span>
                  <span className="log-msg">{log}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="portal-approvals animate-fade">
            <div className="portal-mock-header">
              <span className="folder-icon">🛡️</span>
              <h4>{t.approvalsTitle}</h4>
            </div>
            <div className="approval-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className="approval-badge-label">UX/UI Design & Architecture Draft</span>
                <span className={`status-badge ${approvedProject ? 'approved' : 'waiting'}`}>
                  {approvedProject ? t.statusApproved : t.statusWaiting}
                </span>
              </div>
              {!approvedProject ? (
                <div>
                  <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: '20px' }}>
                    Wymagana akceptacja makiety strony głównej oraz struktury asystenta AI przed rozpoczęciem wdrożenia frontendu.
                  </p>
                  <button onClick={handleApprove} className="btn-approve-click">
                    {t.btnApprove}
                  </button>
                </div>
              ) : (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <div>
                    <h5>{t.approvedSuccess}</h5>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, margin: '4px 0 0' }}>
                      {t.approvedDesc}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="portal-handover animate-fade">
            <div className="portal-mock-header">
              <span className="folder-icon">🎥</span>
              <h4>{t.handoverTitle}</h4>
            </div>
            <div className="vod-grid">
              <div className="vod-card">
                <div className="vod-thumbnail">▶ 12:40</div>
                <div className="vod-info">
                  <h5>1. Obsługa AI Agenta w CRM</h5>
                  <p>Instrukcja obsługi wątków i follow-upu</p>
                </div>
              </div>
              <div className="vod-card">
                <div className="vod-thumbnail">▶ 08:15</div>
                <div className="vod-info">
                  <h5>2. Aktualizacja Bazy RAG</h5>
                  <p>Jak dodawać nowe PDF-y i procedury do AI</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="process" className="section relative reveal-on-scroll" style={{ padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'radial-gradient(ellipse at bottom, rgba(99, 102, 241, 0.03) 0%, transparent 70%)' }}>
      <div className="container relative z-10">
        <div className="section-header text-center fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="section-label" style={{ padding: '8px 16px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderRadius: '999px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>{T('process.label')}</span>
          <h2 className="section-title">{T('process.title')}</h2>
          <p className="section-subtitle" style={{ maxWidth: '800px' }}>{T('process.subtitle')}</p>
        </div>

        <div className="portal-showcase-container" style={{ marginTop: '60px' }}>
          {/* Left Column: Navigation Steps */}
          <div className="portal-steps">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`portal-step-card premium-glass-panel ${isActive ? 'active' : ''}`}
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                >
                  <div className="portal-step-num-icon">
                    <span className="step-badge-icon" style={{ filter: isActive ? 'none' : 'grayscale(1) opacity(0.5)' }}>{step.icon}</span>
                    <span className="step-num">{step.num}</span>
                  </div>
                  <div className="portal-step-info">
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: isActive ? 'white' : 'rgba(255,255,255,0.7)', transition: 'color 0.3s' }}>
                      {T(`process.step${idx + 1}.title`)}
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)', lineHeight: 1.5, transition: 'color 0.3s' }}>
                      {T(`process.step${idx + 1}.desc`)}
                    </p>
                  </div>

                  {/* Mobile inline expansion */}
                  {isMobile && isActive && (
                    <div className="mobile-portal-mockup" onClick={(e) => e.stopPropagation()}>
                      {renderMockupContent(idx)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Interactive Desktop Portal Mockup */}
          {!isMobile && (
            <div className="portal-mockup-window premium-glass-panel">
              <div className="portal-window-bar">
                <div className="window-dots">
                  <span className="red"></span><span className="yellow"></span><span className="green"></span>
                </div>
                <div className="window-address">theportal.ecm-digital.com/client-dashboard</div>
              </div>
              <div className="portal-window-body">
                {renderMockupContent(activeStep)}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .portal-showcase-container {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 40px;
          align-items: flex-start;
        }

        .portal-steps {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .portal-step-card {
          padding: 24px;
          display: flex;
          gap: 20px;
          border-color: rgba(255, 255, 255, 0.03) !important;
          background: rgba(255, 255, 255, 0.01) !important;
        }

        .portal-step-card.active {
          border-color: rgba(99, 102, 241, 0.35) !important;
          background: rgba(99, 102, 241, 0.03) !important;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .portal-step-num-icon {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .portal-step-card.active .portal-step-num-icon {
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.15);
        }

        .step-num {
          position: absolute;
          top: -8px;
          right: -8px;
          font-size: 0.6rem;
          font-weight: 900;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.7);
          border-radius: 99px;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .portal-step-card.active .step-num {
          background: #6366f1;
          color: white;
          border-color: #6366f1;
        }

        .portal-step-info {
          flex-grow: 1;
        }

        /* Mockup Window Styling */
        .portal-mockup-window {
          border-color: rgba(255, 255, 255, 0.05) !important;
          background: rgba(8, 8, 12, 0.85) !important;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          height: 420px;
          display: flex;
          flex-direction: column;
        }

        .portal-window-bar {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .window-dots {
          display: flex;
          gap: 6px;
        }

        .window-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .window-dots span.red { background: #ef4444; }
        .window-dots span.yellow { background: #f59e0b; }
        .window-dots span.green { background: #10b981; }

        .window-address {
          font-family: monospace;
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.35);
          background: rgba(0, 0, 0, 0.2);
          padding: 4px 16px;
          border-radius: 6px;
          flex-grow: 1;
          max-width: 380px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .portal-window-body {
          padding: 28px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
        }

        /* Mockup Contents */
        .portal-mock-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .folder-icon {
          font-size: 1.4rem;
        }

        .portal-mock-header h4 {
          font-size: 0.75rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0;
        }

        /* Roadmap step content */
        .roadmap-progress {
          margin-bottom: 24px;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 8px;
          font-weight: 600;
        }

        .progress-bar-bg {
          height: 6px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 99px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #a855f7);
          border-radius: 99px;
        }

        .roadmap-checklist {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .roadmap-checklist li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
          font-weight: 550;
        }

        .roadmap-checklist li.done {
          color: #10b981;
        }

        .roadmap-checklist li.active {
          color: white;
          font-weight: 700;
        }

        .bullet-active {
          color: #6366f1;
          animation: pulseNode 1.5s infinite;
        }

        @keyframes pulseNode {
          0% { opacity: 0.5; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.5; transform: scale(0.9); }
        }

        .roadmap-checklist li.pending {
          color: rgba(255, 255, 255, 0.35);
        }

        /* Live log step content */
        .live-log-container {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 16px;
          font-family: monospace;
          font-size: 0.78rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
          height: 220px;
          overflow-y: auto;
        }

        .live-log-row {
          display: flex;
          gap: 12px;
          line-height: 1.4;
        }

        .log-time {
          color: rgba(255, 255, 255, 0.25);
        }

        .log-badge {
          background: rgba(99, 102, 241, 0.1);
          color: #a5b4fc;
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 0.68rem;
          font-weight: 700;
        }

        .log-msg {
          color: rgba(255, 255, 255, 0.65);
        }

        /* Approval step content */
        .approval-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 24px;
        }

        .approval-badge-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: white;
        }

        .status-badge {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 99px;
          text-transform: uppercase;
        }

        .status-badge.waiting {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.2);
          animation: pulseStatus 2s infinite;
        }

        @keyframes pulseStatus {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        .status-badge.approved {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .btn-approve-click {
          background: white;
          color: black;
          font-weight: 700;
          font-size: 0.88rem;
          padding: 12px 24px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          width: 100%;
        }

        .btn-approve-click:hover {
          background: #e2e8f0;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);
        }

        .success-message {
          display: flex;
          gap: 16px;
          align-items: center;
          animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .success-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          font-weight: 900;
          flex-shrink: 0;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
        }

        .success-message h5 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #10b981;
          margin: 0;
        }

        /* Handover VOD */
        .vod-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .vod-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .vod-card:hover {
          border-color: rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          transform: translateY(-2px);
        }

        .vod-thumbnail {
          height: 90px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.7);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .vod-info {
          padding: 10px 12px;
        }

        .vod-info h5 {
          font-size: 0.82rem;
          font-weight: 700;
          color: white;
          margin: 0 0 4px;
        }

        .vod-info p {
          font-size: 0.68rem;
          color: rgba(255, 255, 255, 0.45);
          margin: 0;
          line-height: 1.3;
        }

        .animate-fade {
          animation: fadeEffect 0.5s ease-out;
        }

        @keyframes fadeEffect {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Mobile specific layouts */
        @media (max-width: 1024px) {
          .portal-showcase-container {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .portal-step-card {
            flex-direction: column;
            gap: 12px;
          }

          .mobile-portal-mockup {
            margin-top: 16px;
            width: 100%;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding-top: 16px;
          }
          
          .vod-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
