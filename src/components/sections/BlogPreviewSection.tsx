'use client';

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getFeaturedBlogPosts, BlogPost } from "@/lib/firestoreService";

const FALLBACK_POSTS = [
  { slug: 'ai-agents-biznes-2025', title: 'Jak Agenci AI Zmienią Twój Biznes w 2025', icon: '🤖', color: '#3b82f6' },
  { slug: 'automatyzacja-n8n-przewodnik', title: 'Automatyzacja z N8N: Kompletny Przewodnik', icon: '⚡', color: '#f59e0b' },
  { slug: 'ile-kosztuje-strona-www-2025', title: 'Ile Kosztuje Strona WWW w 2025?', icon: '💰', color: '#8b5cf6' },
];

export default function BlogPreviewSection() {
  const { T } = useLanguage();
  const [posts, setPosts] = useState<Array<{ slug: string; title: string; icon: string; color: string }>>([]);

  useEffect(() => {
    getFeaturedBlogPosts(3)
      .then(data => setPosts(data.length > 0 ? data : FALLBACK_POSTS))
      .catch(() => setPosts(FALLBACK_POSTS));
  }, []);

  const displayPosts = posts.length > 0 ? posts : FALLBACK_POSTS;

  return (
    <section id="blog" className="section relative bg-grid reveal-on-scroll" style={{ padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container relative z-10">
        <div className="section-header fade-in-up">
          <span className="section-label" style={{ padding: '8px 16px', background: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa', borderRadius: '999px', border: '1px solid rgba(96, 165, 250, 0.2)' }}>📝 {T('blog.label')}</span>
          <h2 className="section-title">{T('blog.title')}</h2>
          <p className="section-subtitle">{T('blog.subtitle')}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          {displayPosts.map((post, idx) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="premium-glass-panel premium-card-glow fade-in-up"
              style={{ padding: '40px', borderRadius: '28px', overflow: 'hidden', textDecoration: 'none', color: 'inherit', animationDelay: `${0.1 * idx}s`, display: 'flex', flexDirection: 'column', position: 'relative', minHeight: '380px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, width: '180px', height: '180px', background: `radial-gradient(circle, ${post.color}30 0%, transparent 70%)`, filter: 'blur(30px)', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ width: '72px', height: '72px', borderRadius: '20px', marginBottom: '32px', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.1)', boxShadow: `0 0 20px ${post.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', position: 'relative', zIndex: 2 }}>
                {post.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', lineHeight: 1.4, color: 'white', position: 'relative', zIndex: 2, flexGrow: 1 }}>
                {post.title}
              </h3>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: post.color, fontWeight: 700, fontSize: '0.9rem', position: 'relative', zIndex: 2, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', width: '100%' }}>
                {T('blog.readArticle')} <span style={{ transition: 'transform 0.3s' }}>→</span>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center fade-in-up">
          <a href="/blog" className="btn-secondary premium-button-shine" style={{ padding: '14px 40px', borderRadius: '12px', fontSize: '1rem', background: 'rgba(255,255,255,0.05)' }}>
            {T('blog.viewAll')}
          </a>
        </div>
      </div>
    </section>
  );
}
