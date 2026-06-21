'use client';

import React, { useState, useEffect } from 'react';

// Steps for the interactive simulation
const SIMULATION_STEPS = [
  {
    phase: 'typing',
    userMessage: 'Cześć, szukam automatyzacji obsługi zapytań z Otodom do CRM. Czy możecie w tym pomóc?',
    agentMessage: '',
    activeNode: 'input',
    log: '📥 14:20:01 - Wykryto nowe zapytanie z portalu Otodom (Lead ID: #4829)',
  },
  {
    phase: 'analyzing',
    userMessage: 'Cześć, szukam automatyzacji obsługi zapytań z Otodom do CRM. Czy możecie w tym pomóc?',
    agentMessage: 'Agent AI analizuje zapytanie...',
    activeNode: 'ai',
    log: '🧠 14:20:02 - Analiza intencji leada (Gemini 1.5 Pro): Kwalifikacja pozytywna',
  },
  {
    phase: 'responding',
    userMessage: 'Cześć, szukam automatyzacji obsługi zapytań z Otodom do CRM. Czy możecie w tym pomóc?',
    agentMessage: 'Oczywiście! Wdrażamy Agentów AI zintegrowanych bezpośrednio z Otodom i CRM-em (np. HubSpot). Agent automatycznie odpowiada na pytania o standard i lokalizację w 2 minuty, a następnie proponuje termin spotkania w kalendarzu. Czy chcesz zobaczyć demo?',
    activeNode: 'ai',
    log: '⚡ 14:20:03 - Wysłano spersonalizowaną odpowiedź e-mail/SMS (Czas: 1.8s)',
  },
  {
    phase: 'integrating',
    userMessage: 'Cześć, szukam automatyzacji obsługi zapytań z Otodom do CRM. Czy możecie w tym pomóc?',
    agentMessage: 'Oczywiście! Wdrażamy Agentów AI zintegrowanych bezpośrednio z Otodom i CRM-em (np. HubSpot). Agent automatycznie odpowiada na pytania o standard i lokalizację w 2 minuty, a następnie proponuje termin spotkania w kalendarzu. Czy chcesz zobaczyć demo?',
    activeNode: 'crm',
    log: '💾 14:20:04 - Zaktualizowano profil klienta w CRM & wysłano zaproszenie Google Calendar',
  },
  {
    phase: 'notifying',
    userMessage: 'Cześć, szukam automatyzacji obsługi zapytań z Otodom do CRM. Czy możecie w tym pomóc?',
    agentMessage: 'Oczywiście! Wdrażamy Agentów AI zintegrowanych bezpośrednio z Otodom i CRM-em (np. HubSpot). Agent automatycznie odpowiada na pytania o standard i lokalizację w 2 minuty, a następnie proponuje termin spotkania w kalendarzu. Czy chcesz zobaczyć demo?',
    activeNode: 'slack',
    log: '📢 14:20:05 - Wysłano alert o zakwalifikowanym leadzie na Slack zespołu (Wzrost ROI: +180%)',
  },
];

export default function AIAgentDemo() {
  const [stepIndex, setStepIndex] = useState(0);
  const [leadsCount, setLeadsCount] = useState(1424);
  const [logs, setLogs] = useState<string[]>([
    '⚙️ System Active: ECM Core Engine v3.0.0 initialized',
    '🔌 Webhook listener connected to Otodom/Morizon API',
    '📊 Sync status: 100% operational'
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % SIMULATION_STEPS.length;
        
        // Update logs array
        const currentStep = SIMULATION_STEPS[nextIndex];
        setLogs((prevLogs) => {
          const updated = [...prevLogs, currentStep.log];
          // Keep only last 5 logs for cleaner UI
          if (updated.length > 5) updated.shift();
          return updated;
        });

        // Increment leads count on completion
        if (nextIndex === 0) {
          setLeadsCount((prev) => prev + 1);
        }

        return nextIndex;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const currentStep = SIMULATION_STEPS[stepIndex];

  return (
    <div className="premium-dashboard-mockup flex flex-col md:flex-row h-[420px] md:h-[460px] w-full text-left font-sans">
      
      {/* Sidebar - Desktop only */}
      <div className="hidden md:flex flex-col w-[180px] bg-slate-950/40 border-r border-white/5 p-4 justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2 py-1 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400">Control Unit</span>
          </div>
          
          <div className="dashboard-sidebar-item active">
            <span className="text-xs">⚡ Podgląd Live</span>
          </div>
          <div className="dashboard-sidebar-item">
            <span className="text-xs">🤖 Agenci AI</span>
          </div>
          <div className="dashboard-sidebar-item">
            <span className="text-xs">🔌 Integracje</span>
          </div>
          <div className="dashboard-sidebar-item">
            <span className="text-xs">📊 Analityka</span>
          </div>
        </div>

        <div className="text-[9px] text-white/30 px-2">
          ECM v3.4.1-stable
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col bg-slate-950/15 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/2 border-b border-white/5">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-1.5 mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
            <span className="text-xs font-mono text-white/50 select-none">control-panel.ecm-digital.com</span>
          </div>
          <div className="text-[10px] font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full">
            INTEGRACJA AKTYWNA
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 p-4 gap-4 overflow-hidden min-h-0">
          
          {/* Left Side: Live Agent Simulation (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-3 min-h-0 flex-1">
            
            {/* Live Chat Frame */}
            <div className="flex-1 bg-black/30 border border-white/5 rounded-xl p-3.5 flex flex-col justify-between overflow-hidden min-h-0">
              <div className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-2 flex justify-between items-center">
                <span>Monitor Konwersacji AI</span>
                <span className="text-emerald-500 animate-pulse text-[9px]">● Przetwarzanie</span>
              </div>

              {/* Bubbles Scroll */}
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
                {/* User Message */}
                <div className="chat-bubble user">
                  {currentStep.userMessage}
                </div>

                {/* Agent Response */}
                {currentStep.agentMessage && (
                  <div className={`chat-bubble agent transition-all duration-300 ${
                    currentStep.phase === 'analyzing' ? 'opacity-70 animate-pulse' : 'opacity-100'
                  }`}>
                    {currentStep.agentMessage}
                  </div>
                )}
              </div>

              {/* Automation Flow Visualizer */}
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                <div className={`automation-node ${currentStep.activeNode === 'input' ? 'active' : ''}`}>
                  <span>📥 Otodom</span>
                </div>
                <div className={`automation-connector ${
                  ['analyzing', 'responding', 'integrating', 'notifying'].includes(currentStep.phase) ? 'active' : ''
                }`} />
                <div className={`automation-node ${currentStep.activeNode === 'ai' ? 'active' : ''}`}>
                  <span>🤖 Gemini AI</span>
                </div>
                <div className={`automation-connector ${
                  ['integrating', 'notifying'].includes(currentStep.phase) ? 'active' : ''
                }`} />
                <div className={`automation-node ${currentStep.activeNode === 'crm' ? 'active' : ''}`}>
                  <span>💾 CRM</span>
                </div>
                <div className={`automation-connector ${
                  currentStep.phase === 'notifying' ? 'active' : ''
                }`} />
                <div className={`automation-node ${currentStep.activeNode === 'slack' ? 'active' : ''}`}>
                  <span>📢 Slack</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Metrics & Logs (4 Cols) */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-3">
            
            {/* Lead Counter */}
            <div className="dashboard-metric-card flex flex-col justify-between py-3">
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Zautomatyzowane Leady</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-white tracking-tight tabular-nums">{leadsCount}</span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">+1 nowy</span>
              </div>
            </div>

            {/* Response speed */}
            <div className="dashboard-metric-card flex flex-col justify-between py-3">
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Czas reakcji</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-blue-400 tracking-tight">1.8s</span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">-99.2%</span>
              </div>
            </div>

            {/* Mini Log Console */}
            <div className="flex-1 bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col min-h-[110px] overflow-hidden">
              <div className="text-[9px] text-white/40 font-mono uppercase tracking-wider mb-1.5 border-b border-white/5 pb-1">
                KONSOLA LOGÓW SYSTEMOWYCH
              </div>
              <div className="flex-1 flex flex-col gap-1.5 font-mono text-[9px] text-white/60 overflow-hidden live-log-container">
                {logs.map((log, index) => (
                  <div key={index} className="truncate">
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
