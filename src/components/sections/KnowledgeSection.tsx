'use client';

import { useLanguage } from '@/context/LanguageContext';
import { knowledgeItems, tkb } from '@/app/wiedza/wiedzaData';

export default function KnowledgeSection() {
  const { T, lang } = useLanguage();
  const displayItems = knowledgeItems.slice(0, 6);

  return (
    <section id="wiedza" className="section section-polish relative reveal-on-scroll" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container relative z-10">
        <div className="section-header fade-in-up">
          <span className="section-label" style={{ padding: '8px 16px', background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', borderRadius: '999px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            📚 {T('knowledge.label')}
          </span>
          <h2 className="section-title">{T('knowledge.title')}</h2>
          <p className="section-subtitle">{T('knowledge.subtitle')}</p>
        </div>

        <div className="knowledge-grid">
          {displayItems.map((item, idx) => {
            const content = item.translations[lang] || item.translations.pl || item.translations.en;
            if (!content) return null;

            return (
              <a
                key={item.slug}
                href={`/wiedza/${item.slug}`}
                className="premium-glass-panel premium-hover-lift fade-in-up"
                style={{ padding: '32px', animationDelay: `${0.1 * idx}s`, display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: item.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px', color: 'white' }}>{content.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '16px', flexGrow: 1 }}>{content.shortDesc}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#a78bfa', fontWeight: 700, fontSize: '0.85rem' }}>
                  {tkb(lang, 'kb.read')} <span>→</span>
                </div>
              </a>
            );
          })}
        </div>

        <div className="text-center fade-in-up">
          <a href="/wiedza" className="btn-secondary premium-button-shine">
            {T('knowledge.cta')} →
          </a>
        </div>
      </div>
    </section>
  );
}
