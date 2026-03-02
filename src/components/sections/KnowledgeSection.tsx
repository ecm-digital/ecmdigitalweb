'use client';

const ITEMS = [
  { slug: 'ai-agents', title: 'Agenci AI', desc: 'Autonomiczne programy AI, które wykonują zadania za Ciebie.', icon: '🤖', gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' },
  { slug: 'rag-retrieval-augmented-generation', title: 'RAG', desc: 'Jak AI szuka i łączy wiedzę z dokumentów firmy.', icon: '🔍', gradient: 'linear-gradient(135deg, #10b981, #3b82f6)' },
  { slug: 'llm-large-language-model', title: 'LLM', desc: 'Duże modele językowe – od GPT po Gemini i Claude.', icon: '🧠', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  { slug: 'aios-ai-operating-system', title: 'AIOS', desc: 'AI Operating System – jak zbudować system zarządzania firmą oparty na AI.', icon: '⚡', gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)' },
];

export default function KnowledgeSection() {
  return (
    <section id="wiedza" className="section relative reveal-on-scroll" style={{ padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container relative z-10">
        <div className="section-header fade-in-up">
          <span className="section-label" style={{ padding: '8px 16px', background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', borderRadius: '999px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>📚 Encyklopedia</span>
          <h2 className="section-title">Baza Wiedzy AI</h2>
          <p className="section-subtitle">Wyjaśniamy kluczowe technologie AI. Prosty język, realne przykłady, zero bullshitu.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '50px' }}>
          {ITEMS.map((item, idx) => (
            <a
              key={item.slug}
              href={`/wiedza/${item.slug}`}
              className="premium-glass-panel premium-hover-lift fade-in-up"
              style={{ padding: '32px', borderRadius: '24px', textDecoration: 'none', color: 'inherit', animationDelay: `${0.1 * idx}s`, display: 'flex', flexDirection: 'column', transition: 'all 0.4s ease' }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: item.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px', color: 'white' }}>{item.title}</h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '16px', flexGrow: 1 }}>{item.desc}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#a78bfa', fontWeight: 700, fontSize: '0.85rem' }}>
                Czytaj więcej <span>→</span>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center fade-in-up">
          <a href="/wiedza" className="btn-secondary premium-button-shine" style={{ padding: '14px 40px', borderRadius: '12px', fontSize: '1rem', background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)' }}>
            Pełna Baza Wiedzy AI →
          </a>
        </div>
      </div>
    </section>
  );
}
