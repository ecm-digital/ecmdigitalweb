'use client';

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getTestimonials, Testimonial } from "@/lib/firestoreService";

export default function TestimonialsSection() {
  const { T } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    getTestimonials()
      .then(data => {
        if (data.length > 0) setTestimonials(data);
        else setUseFallback(true);
      })
      .catch(() => setUseFallback(true));
  }, []);

  // Fallback to translation-based testimonials if Firestore is empty
  const renderCard = (name: string, role: string, text: string, idx: number) => (
    <div key={idx} className="premium-glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '4px', color: '#fbbf24', fontSize: '1.2rem' }}>★★★★★</div>
      <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', marginBottom: '32px', lineHeight: 1.7 }}>"{text}"</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', color: 'white', boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}>
          {name.charAt(0)}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>{name}</div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>{role}</div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="testimonials" className="section relative bg-grid reveal-on-scroll" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '120px 0' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

      <div className="container relative z-10">
        <div className="section-header">
          <span className="section-label" style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{T('testimonials.label')}</span>
          <h2 className="section-title">{T('testimonials.title')}</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {useFallback
            ? [1, 2, 3].map(i => renderCard(T(`testimonials.t${i}.name`), T(`testimonials.t${i}.role`), T(`testimonials.t${i}.text`), i))
            : testimonials.map((t, idx) => renderCard(t.name, t.role, t.text, idx))
          }
        </div>
      </div>
    </section>
  );
}
