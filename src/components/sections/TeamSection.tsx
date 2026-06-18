'use client';

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const TEAM_MEMBERS = [
  {
    key: 'tomasz',
    initials: 'TG',
    color: '#3b82f6',
    skills: ['Business Analysis', 'AI Strategy']
  },
  {
    key: 'karol',
    initials: 'KC',
    color: '#8b5cf6',
    skills: ['AI Testing', 'Quality Assurance']
  },
  {
    key: 'marta',
    initials: 'MG',
    color: '#ec4899',
    skills: ['UX Research', 'AI/UX Design']
  },
  {
    key: 'roman',
    initials: 'RD',
    color: '#10b981',
    skills: ['Automation', 'AI Analytics']
  }
];

export default function TeamSection() {
  const { T } = useLanguage();

  return (
    <section id="team" className="section relative reveal-on-scroll" style={{ padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(10,10,15,0.3)' }}>
      <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="container relative z-10">
        <div className="section-header text-center fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '60px' }}>
          <span className="section-label" style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '999px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            {T('team.label')}
          </span>
          <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em', fontWeight: 800 }}>
            {T('team.title')}
          </h2>
          <p className="section-subtitle" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', color: 'rgba(255,255,255,0.6)' }}>
            {T('team.subtitle')}
          </p>
        </div>

        <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', marginTop: '40px' }}>
          {TEAM_MEMBERS.map((member, idx) => (
            <div
              key={member.key}
              className="team-card premium-glass-panel fade-in-up"
              style={{
                padding: '40px 30px',
                borderRadius: '24px',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.01)',
                animationDelay: `${idx * 0.1}s`,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: `radial-gradient(circle, ${member.color}15 0%, transparent 70%)`, filter: 'blur(20px)', pointerEvents: 'none' }} />
              
              {/* Avatar Icon / Initials */}
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  margin: '0 auto 24px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.01))',
                  border: `1px solid ${member.color}40`,
                  boxShadow: `0 0 20px ${member.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: 'white'
                }}
              >
                {member.initials}
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
                {T(`team.${member.key}.name`)}
              </h3>
              <div style={{ fontSize: '0.9rem', color: member.color, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>
                {T(`team.${member.key}.role`)}
              </div>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '24px' }}>
                {T(`team.${member.key}.desc`)}
              </p>

              {/* Skills Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {member.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    style={{
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.7)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {T(`team.${member.key}.skill${sIdx + 1}`) || skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
