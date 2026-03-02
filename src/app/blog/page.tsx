'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { blogPosts, bt } from './blogData';

export default function BlogPage() {
    const { lang } = useLanguage();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); }),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const T = (key: string) => bt(lang || 'pl', key);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString(lang === 'de' ? 'de-DE' : lang === 'en' ? 'en-US' : 'pl-PL', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    };

    return (
        <div className="lp-wrapper">
            <Navbar />

            {/* Premium Hero */}
            <section className="relative overflow-hidden bg-grid" style={{ padding: '180px 0 100px', minHeight: '40vh', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, animation: 'float 12s infinite alternate', pointerEvents: 'none' }} />
                <div className="container relative z-10 text-center">
                    <div className="fade-in-up">
                        <div className="hero-badge" style={{
                            margin: '0 auto 24px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '10px 24px',
                            borderRadius: '999px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(20px)',
                            color: '#60a5fa',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}>
                            📝 Blog & Insights
                        </div>
                        <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                            {T('blog.title')}
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                            {T('blog.subtitle')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="section bg-grid relative" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'var(--brand-primary)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
                        {blogPosts.map((post, idx) => {
                            const accentColor = post.gradient.match(/#([0-9a-fA-F]{6})/)?.[0] || '#3b82f6';
                            return (
                                <a
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    onMouseMove={handleMouseMove}
                                    className="premium-glass-panel premium-card-glow reveal-on-scroll"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        overflow: 'hidden',
                                        padding: 0,
                                        borderRadius: '24px',
                                        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <div style={{
                                        height: '240px',
                                        background: post.gradient,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,5,7,0.3)', zIndex: 0 }}></div>
                                        <span style={{ fontSize: '5rem', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))', transform: 'translateY(10px)' }}>{post.image}</span>
                                        <div style={{
                                            position: 'absolute',
                                            top: '20px',
                                            right: '20px',
                                            padding: '6px 16px',
                                            background: 'rgba(5,5,7,0.6)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: '999px',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.05em',
                                            textTransform: 'uppercase',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: 'white',
                                            zIndex: 2
                                        }}>{post.category}</div>
                                    </div>
                                    <div style={{ padding: '32px', flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
                                            <span>{formatDate(post.date)}</span>
                                            <span>•</span>
                                            <span>{post.readTime} {T('blog.readTime')}</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.3, color: 'white', letterSpacing: '-0.02em' }}>{T(`${post.slug}.title`)}</h3>
                                        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '24px', flexGrow: 1 }}>{T(`${post.slug}.excerpt`)}</p>

                                        <div className="premium-link" style={{ display: 'inline-flex', alignItems: 'center', fontWeight: 600, color: accentColor, gap: '8px', fontSize: '0.95rem', transition: 'all 0.3s' }}>
                                            {T('blog.readMore')} <span style={{ transition: 'transform 0.3s' }}>→</span>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
