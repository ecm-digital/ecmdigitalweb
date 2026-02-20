'use client';

import React, { useState, useEffect, useRef } from 'react';

const TASKS = [
  { id: 1, text: "Analyzing business requirements...", duration: 2000, color: "#e94560" },
  { id: 2, text: "Mapping AI automation workflow...", duration: 2500, color: "#3b82f6" },
  { id: 3, text: "Optimizing Google Gemini LLM prompts...", duration: 3000, color: "#10b981" },
  { id: 4, text: "Integrating CRM with N8N...", duration: 2000, color: "#f59e0b" },
  { id: 5, text: "Generating real-time analytics...", duration: 2500, color: "#8b5cf6" },
  { id: 6, text: "System scaling complete. Performance +45%", duration: 3000, color: "#e94560", final: true },
];

export default function AIAgentDemo() {
  const [activeTasks, setActiveTasks] = useState<number[]>([]);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentTaskIndex < TASKS.length) {
      const task = TASKS[currentTaskIndex];
      setActiveTasks(prev => [...prev, task.id]);

      const timer = setTimeout(() => {
        setActiveTasks(prev => prev.filter(id => id !== task.id));
        setCompletedTasks(prev => [...prev, task.id]);
        setCurrentTaskIndex(prev => prev + 1);
      }, task.duration);

      return () => clearTimeout(timer);
    } else {
      // Loop with delay
      const loopTimer = setTimeout(() => {
        setCompletedTasks([]);
        setCurrentTaskIndex(0);
      }, 5000);
      return () => clearTimeout(loopTimer);
    }
  }, [currentTaskIndex]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeTasks, completedTasks]);

  return (
    <div className="ai-demo-terminal">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span></span><span></span><span></span>
        </div>
        <div className="terminal-title">AI Agent Terminal — v2.4.0</div>
      </div>
      <div className="terminal-body" ref={scrollRef}>
        <div className="terminal-system-status">
          <span className="pulse"></span> System Active: ECM Core Engine
        </div>

        {completedTasks.map((id) => {
          const task = TASKS.find(t => t.id === id);
          return (
            <div key={id} className="terminal-line completed">
              <span className="prefix">[DONE]</span>
              <span className="text">{task?.text}</span>
              <span className="status">✓</span>
            </div>
          );
        })}

        {activeTasks.map((id) => {
          const task = TASKS.find(t => t.id === id);
          return (
            <div key={id} className="terminal-line active">
              <span className="prefix" style={{ color: task?.color }}>[RUN]</span>
              <span className="text">{task?.text}</span>
              <span className="loader"></span>
            </div>
          );
        })}

        {currentTaskIndex < TASKS.length && (
          <div className="terminal-line active blinking">
            <span className="cursor">_</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .ai-demo-terminal {
          background: rgba(15, 23, 42, 0.85); /* Dark blue-grey slate */
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          overflow: hidden;
          font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          height: 480px;
          display: flex;
          flex-direction: column;
          font-size: 16px;
          position: relative;
          color: #e2e8f0;
        }

        .ai-demo-terminal:hover {
          transform: translateY(-5px) scale(1.01);
          box-shadow: 
            0 30px 60px -15px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.15);
        }

        /* Subtle noise texture */
        .ai-demo-terminal::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.15;
          pointer-events: none;
          z-index: 0;
        }

        /* Scanline effect */
        .ai-demo-terminal::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0) 50%,
            rgba(0, 0, 0, 0.25) 50%
          );
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 10;
          opacity: 0.15;
        }

        .terminal-header {
          background: linear-gradient(to right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
          padding: 18px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
          z-index: 2;
        }

        .terminal-dots {
          display: flex;
          gap: 8px;
        }

        .terminal-dots span {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          transition: transform 0.2s ease;
        }

        .terminal-dots:hover span {
          transform: scale(1.1);
        }

        .terminal-dots span:nth-child(1) { background: #ff5f56; box-shadow: 0 0 10px rgba(255, 95, 86, 0.4); }
        .terminal-dots span:nth-child(2) { background: #ffbd2e; box-shadow: 0 0 10px rgba(255, 189, 46, 0.4); }
        .terminal-dots span:nth-child(3) { background: #27c93f; box-shadow: 0 0 10px rgba(39, 201, 63, 0.4); }

        .terminal-title {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
          letter-spacing: 0.5px;
          margin-left: 4px;
        }

        .terminal-body {
          padding: 32px;
          height: 100%;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
          color: #e2e8f0;
          scrollbar-width: none;
          position: relative;
          z-index: 2;
        }

        .terminal-body::-webkit-scrollbar { display: none; }

        .terminal-system-status {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
          padding-bottom: 12px;
        }

        .pulse {
          width: 6px;
          height: 6px;
          background: #10b981;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px #10b981;
          animation: statusPulse 2s infinite;
        }

        @keyframes statusPulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }

        .terminal-line {
          font-size: 0.9rem;
          line-height: 1.5;
          display: flex;
          align-items: center;
          gap: 12px;
          opacity: 0;
          animation: slideIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .terminal-line.completed { opacity: 0.5; filter: grayscale(0.4); transition: all 0.5s; }
        .terminal-line.completed .text { color: #94a3b8; text-decoration: line-through; text-decoration-color: rgba(255, 255, 255, 0.1); }
        .terminal-line.completed .status { color: #10b981; text-shadow: 0 0 10px rgba(16, 185, 129, 0.3); }
        
        .terminal-line.active { opacity: 1; }
        .terminal-line.active .text { color: #f8fafc; font-weight: 500; }

        .prefix { 
          font-family: 'Fira Code', monospace;
          font-weight: 700; 
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.05);
          min-width: 50px;
          text-align: center;
        }
        
        .terminal-line.completed .prefix { color: #10b981; background: rgba(16, 185, 129, 0.1); }

        .loader {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-top-color: #38bdf8;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-left: auto;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .status { margin-left: auto; color: #10b981; }

        .cursor {
          display: inline-block;
          width: 8px;
          height: 16px;
          background: #e94560;
          margin-left: 8px;
          animation: blink 1s step-end infinite;
          vertical-align: middle;
          box-shadow: 0 0 8px #e94560;
        }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
