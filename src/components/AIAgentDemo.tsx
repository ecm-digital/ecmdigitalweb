'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

// Localized content to keep translation self-contained and bulletproof
const LOCAL_TRANSLATIONS = {
  pl: {
    title: "AI CONTROL CENTER — AKTYWNA AUTOMATYZACJA",
    statusActive: "SYSTEM AI: AKTYWNY",
    chatTitle: "MONITOR CZATU AGENTA AI (NA ŻYWO)",
    workflowTitle: "WIZUALIZACJA PRZEPŁYWU N8N",
    metricsTitle: "KLUCZOWE METRYKI OPERACYJNE",
    feedTitle: "STRUMIEŃ ZDARZEŃ CRM & API",
    metricLeads: "Przechwycone leady",
    metricSpeed: "Czas reakcji AI",
    metricAutomation: "Automatyzacja",
    metricIntegrations: "Aktywne systemy",
    metricSpeedSub: "zamiast kilku godzin",
    metricAutomationSub: "bez udziału człowieka",
    metricIntegrationsSub: "HubSpot, Calendar, SMS",
    userMsg1: "Dzień dobry, chciałbym wycenić wdrożenie automatyzacji obsługi klienta. Ile to trwa?",
    aiMsg1: "Cześć! Wdrożenie podstawowych agentów AI i automatyzacji CRM trwa u nas zwykle 14 dni. System przejmuje 90%+ powtarzalnych pytań. Chcesz zobaczyć przykładowy workflow?",
    userMsg2: "Tak, a czy możecie zintegrować formularz z naszym CRM HubSpot i kalendarzem spotkań?",
    aiMsg2: "Oczywiście! Właśnie uruchamiam demonstracyjny proces: sprawdzam dane, zapisuję lead do HubSpot i wysyłam zaproszenie na spotkanie. Spójrz na panel workflow poniżej!",
    log1: "Pobrano zapytanie przez webhook formularza",
    log2: "Klasyfikacja klienta przez AI: Priorytet WYSOKI",
    log3: "Zapisano dane leada w bazie HubSpot CRM",
    log4: "Wygenerowano spersonalizowaną ofertę PDF",
    log5: "Wysłano SMS z potwierdzeniem do klienta",
    log6: "Wpisano termin spotkania do Google Calendar"
  },
  en: {
    title: "AI CONTROL CENTER — ACTIVE AUTOMATION",
    statusActive: "AI SYSTEM: ACTIVE",
    chatTitle: "AI AGENT CHAT MONITOR (LIVE)",
    workflowTitle: "N8N WORKFLOW VISUALIZATION",
    metricsTitle: "KEY OPERATIONAL METRICS",
    feedTitle: "CRM & API EVENT STREAM",
    metricLeads: "Captured Leads",
    metricSpeed: "AI Response Speed",
    metricAutomation: "Automation Rate",
    metricIntegrations: "Active Integrations",
    metricSpeedSub: "instead of hours",
    metricAutomationSub: "fully automated",
    metricIntegrationsSub: "HubSpot, Calendar, SMS",
    userMsg1: "Hi, I'd like to get a quote for implementing customer service automation. How long does it take?",
    aiMsg1: "Hello! Basic AI agent deployment and CRM automation typically takes 14 days. The system automates 90%+ of repetitive inquiries. Would you like to see a sample workflow?",
    userMsg2: "Yes, and can you integrate the form with HubSpot CRM and our team's Google Calendar?",
    aiMsg2: "Absolutely! I'm launching the demo workflow right now: validating data, syncing to HubSpot, and scheduling a call. Check the workflow panel below!",
    log1: "Webhook request received from contact form",
    log2: "Lead classified by Gemini AI: HIGH PRIORITY",
    log3: "Lead contact record created in HubSpot CRM",
    log4: "Personalized PDF proposal generated dynamically",
    log5: "Confirmation SMS dispatched to lead phone number",
    log6: "Appointment booked in Google Calendar successfully"
  },
  de: {
    title: "AI STEUERUNGSZENTRUM — AKTIVE AUTOMATISIERUNG",
    statusActive: "KI-SYSTEM: AKTIV",
    chatTitle: "KI-AGENT CHAT-MONITOR (LIVE)",
    workflowTitle: "N8N WORKFLOW-VISUALISIERUNG",
    metricsTitle: "WICHTIGE BETRIEBSKENNZAHLEN",
    feedTitle: "CRM- & API-EREIGNISSTROM",
    metricLeads: "Erfasste Leads",
    metricSpeed: "KI-Reaktionszeit",
    metricAutomation: "Automatisierungsgrad",
    metricIntegrations: "Aktive Systeme",
    metricSpeedSub: "statt Stunden",
    metricAutomationSub: "ohne manuellen Aufwand",
    metricIntegrationsSub: "HubSpot, Kalender, SMS",
    userMsg1: "Hallo, ich würde gerne ein Angebot für die Implementierung einer Kundenservice-Automatisierung erhalten. Wie lange dauert das?",
    aiMsg1: "Hallo! Die Implementierung von Basis-KI-Agenten und CRM-Automatisierung dauert in der Regel 14 Tage. Das System übernimmt über 90 % der wiederkehrenden Fragen. Möchten Sie einen Beispiel-Workflow sehen?",
    userMsg2: "Ja, und können Sie das Formular mit unserem CRM HubSpot und dem Terminkalender integrieren?",
    aiMsg2: "Natürlich! Ich starte gerade den Demo-Prozess: Daten prüfen, Lead in HubSpot speichern und eine Termineinladung senden. Sehen Sie sich das Workflow-Panel unten an!",
    log1: "Webhook-Anfrage vom Kontaktformular erhalten",
    log2: "Lead-Klassifizierung durch KI: HOHE PRIORITÄT",
    log3: "Lead-Kontaktdaten in HubSpot CRM gespeichert",
    log4: "Personalisiertes PDF-Angebot dynamisch generiert",
    log5: "Bestätigungs-SMS an den Kunden gesendet",
    log6: "Termin erfolgreich in Google Calendar eingetragen"
  },
  es: {
    title: "CENTRO DE CONTROL DE IA — AUTOMATIZACIÓN ACTIVA",
    statusActive: "SISTEMA DE IA: ACTIVO",
    chatTitle: "MONITOR DE CHAT DE AGENTE DE IA (EN VIVO)",
    workflowTitle: "VISUALIZACIÓN DE FLUJO N8N",
    metricsTitle: "MÉTRICAS OPERATIVAS CLAVE",
    feedTitle: "FLUJO DE EVENTOS CRM & API",
    metricLeads: "Leads Capturados",
    metricSpeed: "Velocidad de Respuesta",
    metricAutomation: "Automatización",
    metricIntegrations: "Sistemas Activos",
    metricSpeedSub: "en lugar de horas",
    metricAutomationSub: "completamente autónomo",
    metricIntegrationsSub: "HubSpot, Calendar, SMS",
    userMsg1: "Hola, me gustaría un presupuesto para automatizar la atención al cliente. ¿Cuánto tiempo lleva?",
    aiMsg1: "¡Hola! La implementación de agentes de IA básicos y automatización de CRM suele tardar 14 días. El sistema gestiona más del 90% de las consultas repetitivas. ¿Quieres ver un flujo de trabajo de ejemplo?",
    userMsg2: "Sí, ¿y se puede integrar el formulario con nuestro HubSpot CRM y el calendario de citas?",
    aiMsg2: "¡Por supuesto! Estoy iniciando el proceso de demostración ahora mismo: validando datos, sincronizando con HubSpot y programando la llamada. ¡Mira el panel de flujo abajo!",
    log1: "Petición webhook recibida desde formulario de contacto",
    log2: "Lead clasificado por IA: PRIORIDAD ALTA",
    log3: "Contacto guardado en HubSpot CRM",
    log4: "Propuesta PDF personalizada generada dinámicamente",
    log5: "SMS de confirmación enviado al cliente",
    log6: "Cita programada con éxito en Google Calendar"
  }
};

export default function AIAgentDemo() {
  const { lang } = useLanguage();
  // Safe fallback if language is not supported
  const t = LOCAL_TRANSLATIONS[lang as keyof typeof LOCAL_TRANSLATIONS] || LOCAL_TRANSLATIONS.pl;

  const [leadsCount, setLeadsCount] = useState(1482);
  const [chatStep, setChatStep] = useState(0);
  const [activeNode, setActiveNode] = useState(-1);
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Chat message script sync
  const chatMessages = [
    { sender: 'user', text: t.userMsg1, delay: 1500, node: 0 },
    { sender: 'ai', text: t.aiMsg1, delay: 3500, node: 1 },
    { sender: 'user', text: t.userMsg2, delay: 3000, node: -1 },
    { sender: 'ai', text: t.aiMsg2, delay: 4000, node: 2 },
  ];

  // Logs stream generator
  useEffect(() => {
    const systemLogs = [t.log1, t.log2, t.log3, t.log4, t.log5, t.log6];
    let logIndex = 0;

    const interval = setInterval(() => {
      if (logIndex < systemLogs.length) {
        const time = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLogs(prev => [...prev.slice(-6), `[${time}] ${systemLogs[logIndex]}`]);
        logIndex++;
      } else {
        // Clear and repeat logs loop
        logIndex = 0;
        setLogs([]);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [t]);

  // Lead Counter Increment
  useEffect(() => {
    const counterTimer = setInterval(() => {
      setLeadsCount(prev => prev + (Math.random() > 0.6 ? 1 : 0));
    }, 8000);
    return () => clearInterval(counterTimer);
  }, []);

  // Chat step loop
  useEffect(() => {
    const currentMsg = chatMessages[chatStep];
    const timer = setTimeout(() => {
      // Advance step
      if (chatStep < chatMessages.length - 1) {
        setChatStep(prev => prev + 1);
      } else {
        // Reset Chat Loop
        setTimeout(() => {
          setChatStep(0);
          setActiveNode(-1);
        }, 5000);
      }
    }, currentMsg.delay);

    // Sync node highlighting
    if (currentMsg.node !== -1) {
      setActiveNode(currentMsg.node);
    } else {
      setActiveNode(-1);
    }

    return () => clearTimeout(timer);
  }, [chatStep, t]);

  // Scroll event log
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="ai-dashboard-container">
      {/* Top Bar */}
      <div className="dashboard-header">
        <div className="header-status">
          <span className="status-dot"></span>
          <span className="status-text">{t.statusActive}</span>
        </div>
        <div className="dashboard-title">{t.title}</div>
        <div className="window-controls">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div className="dashboard-body">
        {/* Left Column: Interactive Chat & Workflow */}
        <div className="dashboard-col-left">
          <div className="panel-box">
            <div className="panel-tag">{t.chatTitle}</div>
            <div className="chat-window">
              <div className="chat-messages-container">
                {chatMessages.slice(0, chatStep + 1).map((msg, index) => (
                  <div key={index} className={`chat-bubble-row ${msg.sender}`}>
                    <div className="avatar">
                      {msg.sender === 'user' ? '👤' : '🤖'}
                    </div>
                    <div className="bubble">
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Workflow Diagram */}
          <div className="panel-box workflow-box">
            <div className="panel-tag">{t.workflowTitle}</div>
            <div className="n8n-canvas">
              {[
                { name: "Webhook", label: "Trigger", icon: "🔌" },
                { name: "Gemini AI", label: "Classifier", icon: "🧠" },
                { name: "HubSpot", label: "CRM Sync", icon: "💼" },
                { name: "GCalendar", label: "Calendar", icon: "📅" }
              ].map((node, index) => {
                const isActive = activeNode === index;
                return (
                  <React.Fragment key={index}>
                    <div className={`node-item ${isActive ? 'active' : ''}`}>
                      <div className="node-icon">{node.icon}</div>
                      <div className="node-name">{node.name}</div>
                      <div className="node-label">{node.label}</div>
                    </div>
                    {index < 3 && (
                      <div className={`node-connector ${activeNode >= index ? 'active' : ''}`}>
                        <div className="connector-pulse"></div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Key Metrics & Logs */}
        <div className="dashboard-col-right">
          <div className="panel-box metrics-box">
            <div className="panel-tag">{t.metricsTitle}</div>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-value leads-val">{leadsCount.toLocaleString()}</div>
                <div className="metric-title">{t.metricLeads}</div>
                <div className="metric-badge green">+14.2% today</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">1.8s</div>
                <div className="metric-title">{t.metricSpeed}</div>
                <div className="metric-subtitle">{t.metricSpeedSub}</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">94.2%</div>
                <div className="metric-title">{t.metricAutomation}</div>
                <div className="metric-subtitle">{t.metricAutomationSub}</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">Active</div>
                <div className="metric-title">{t.metricIntegrations}</div>
                <div className="metric-subtitle">{t.metricIntegrationsSub}</div>
              </div>
            </div>
          </div>

          {/* CRM logs */}
          <div className="panel-box log-box">
            <div className="panel-tag">{t.feedTitle}</div>
            <div className="log-viewer" ref={scrollRef}>
              {logs.length === 0 ? (
                <div className="log-placeholder">Waiting for workflow triggers...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="log-line">
                    <span className="log-bullet">●</span>
                    <span className="log-text">{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ai-dashboard-container {
          background: rgba(8, 8, 12, 0.85);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
          width: 100%;
          font-family: 'Inter', sans-serif;
          color: rgba(255, 255, 255, 0.9);
          transition: all 0.4s ease;
        }

        .ai-dashboard-container:hover {
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .dashboard-header {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-status {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 10px #10b981;
          animation: pulseGreen 2s infinite;
        }

        @keyframes pulseGreen {
          0% { transform: scale(0.95); opacity: 0.9; }
          50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 14px #10b981; }
          100% { transform: scale(0.95); opacity: 0.9; }
        }

        .status-text {
          font-size: 0.7rem;
          font-weight: 800;
          color: #10b981;
          letter-spacing: 0.05em;
        }

        .dashboard-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .window-controls {
          display: flex;
          gap: 6px;
        }

        .window-controls span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
        }

        .dashboard-body {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 20px;
          padding: 24px;
        }

        .dashboard-col-left, .dashboard-col-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .panel-box {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 20px;
          position: relative;
        }

        .panel-tag {
          font-size: 0.68rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }

        /* Chat design */
        .chat-window {
          height: 230px;
          overflow-y: auto;
          scrollbar-width: none;
        }

        .chat-window::-webkit-scrollbar {
          display: none;
        }

        .chat-messages-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chat-bubble-row {
          display: flex;
          gap: 12px;
          max-width: 85%;
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chat-bubble-row.user {
          align-self: flex-start;
        }

        .chat-bubble-row.ai {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .bubble {
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 0.88rem;
          line-height: 1.4;
        }

        .chat-bubble-row.user .bubble {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-top-left-radius: 2px;
        }

        .chat-bubble-row.ai .bubble {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
          border: 1px solid rgba(139, 92, 246, 0.25);
          border-top-right-radius: 2px;
          color: white;
        }

        /* n8n canvas */
        .n8n-canvas {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
        }

        .node-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 10px;
          width: 76px;
          text-align: center;
          position: relative;
          transition: all 0.4s ease;
        }

        .node-item.active {
          border-color: rgba(96, 165, 250, 0.5);
          background: rgba(96, 165, 250, 0.08);
          box-shadow: 0 0 15px rgba(96, 165, 250, 0.2);
          transform: translateY(-2px);
        }

        .node-icon {
          font-size: 1.2rem;
          margin-bottom: 4px;
        }

        .node-name {
          font-size: 0.72rem;
          font-weight: 700;
          color: white;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .node-label {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .node-connector {
          flex-grow: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 0 6px;
          position: relative;
        }

        .node-connector.active {
          background: rgba(96, 165, 250, 0.3);
        }

        .connector-pulse {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #60a5fa;
          top: -1.5px;
          left: 0;
          opacity: 0;
        }

        .node-connector.active .connector-pulse {
          animation: pulseConnect 2s infinite linear;
          opacity: 1;
        }

        @keyframes pulseConnect {
          0% { left: 0%; }
          100% { left: 100%; }
        }

        /* Metrics */
        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 14px;
          transition: all 0.3s;
        }

        .metric-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .metric-value {
          font-size: 1.4rem;
          font-weight: 800;
          color: white;
          margin-bottom: 2px;
        }

        .metric-value.leads-val {
          color: #60a5fa;
          text-shadow: 0 0 10px rgba(96, 165, 250, 0.2);
        }

        .metric-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
        }

        .metric-subtitle {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.35);
          margin-top: 2px;
        }

        .metric-badge {
          display: inline-block;
          font-size: 0.58rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          margin-top: 4px;
        }

        .metric-badge.green {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        /* Log view */
        .log-viewer {
          height: 120px;
          overflow-y: auto;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.72rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
          scrollbar-width: none;
        }

        .log-viewer::-webkit-scrollbar {
          display: none;
        }

        .log-line {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          line-height: 1.3;
          animation: slideUp 0.3s ease forwards;
        }

        .log-bullet {
          color: #a78bfa;
          font-size: 0.5rem;
          margin-top: 2px;
        }

        .log-text {
          color: rgba(255, 255, 255, 0.6);
        }

        .log-placeholder {
          color: rgba(255, 255, 255, 0.25);
          text-align: center;
          padding-top: 40px;
          font-style: italic;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .dashboard-body {
            grid-template-columns: 1fr;
            padding: 16px;
            gap: 16px;
          }

          .panel-box {
            padding: 16px;
          }

          .chat-window {
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
}
