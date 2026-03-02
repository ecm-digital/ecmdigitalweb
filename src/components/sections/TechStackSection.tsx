'use client';

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const TECHS = [
  { key: 'ai', logo: '/assets/images/partners/google logo.svg', name: 'Google AI', bg: '#ec4899', color: 'rgba(236,72,153,0.1)' },
  { key: 'web', logo: '/assets/images/partners/aws-transparent.svg', name: 'Amazon AWS', bg: '#3b82f6', color: 'rgba(59,130,246,0.1)' },
  { key: 'auto', logo: '/assets/images/partners/Cloudwise Logo.png', name: 'Cloudwise', bg: '#10b981', color: 'rgba(16,185,129,0.1)' },
  { key: 'ecommerce', logo: '/assets/images/partners/shopify-transparent.svg', name: 'Shopify', bg: '#f59e0b', color: 'rgba(245,158,11,0.1)' },
];

export default function TechStackSection() {
  const { T } = useLanguage();

  return (
    <section id="tech-stack" className="section relative reveal-on-scroll" style={{ padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(5, 5, 7, 0.4)' }}>
      <div className="container relative z-10">
        <div className="section-header text-center fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="section-label" style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '999px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>{T('tech.label')}</span>
          <h2 className="section-title">{T('tech.title')}</h2>
          <p className="section-subtitle">{T('tech.subtitle')}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginTop: '60px' }}>
          {TECHS.map((tech, idx) => (
            <div key={idx} className="premium-glass-panel premium-hover-lift fade-in-up" style={{ padding: '32px', borderRadius: '24px', border: `1px solid ${tech.color}`, animationDelay: `${idx * 0.1}s`, textAlign: 'center' }}>
              <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Image
                  src={tech.logo}
                  alt={tech.name}
                  width={140}
                  height={48}
                  style={{
                    maxHeight: tech.name === 'Cloudwise' ? '28px' : '48px',
                    width: 'auto',
                    objectFit: 'contain',
                    filter: tech.name === 'Cloudwise' ? 'none' : 'brightness(0) invert(1)',
                    opacity: 0.85,
                  }}
                />
              </div>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{T(`tech.${tech.key}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
