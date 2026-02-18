'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { blogPosts, bt } from './blogData';

export default function BlogPostPage({ slug }: { slug: string }) {
    const { lang } = useLanguage();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const T = (key: string) => bt(lang || 'pl', key);
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) return <div>Post not found</div>;

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString(lang === 'de' ? 'de-DE' : lang === 'en' ? 'en-US' : 'pl-PL', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    };

    const content = T(`${slug}.content`);

    // Simple markdown-to-HTML converter
    const renderContent = (md: string) => {
        return md
            .split('\n\n')
            .map((block, i) => {
                if (block.startsWith('### ')) return <h3 key={i}>{block.replace('### ', '')}</h3>;
                if (block.startsWith('## ')) return <h2 key={i}>{block.replace('## ', '')}</h2>;
                if (block.startsWith('- **')) {
                    const items = block.split('\n').map((line, j) => {
                        const match = line.match(/^- \*\*(.+?)\*\* — (.+)$/);
                        if (match) return <li key={j}><strong>{match[1]}</strong> — {match[2]}</li>;
                        const match2 = line.match(/^- (.+)$/);
                        if (match2) return <li key={j}>{match2[1]}</li>;
                        return <li key={j}>{line}</li>;
                    });
                    return <ul key={i}>{items}</ul>;
                }
                if (block.startsWith('- ')) {
                    const items = block.split('\n').map((line, j) => {
                        const m = line.match(/^- (.+)$/);
                        return <li key={j}>{m ? m[1] : line}</li>;
                    });
                    return <ul key={i}>{items}</ul>;
                }
                if (block.match(/^\d\./)) {
                    const items = block.split('\n').map((line, j) => {
                        const m = line.match(/^\d+\.\s*(.+)$/);
                        return <li key={j}>{m ? m[1] : line}</li>;
                    });
                    return <ol key={i}>{items}</ol>;
                }
                if (block.startsWith('| ')) {
                    const rows = block.split('\n').filter(r => !r.match(/^\|[-\s|]+\|$/));
                    const headers = rows[0]?.split('|').filter(Boolean).map(c => c.trim());
                    const body = rows.slice(1).map(r => r.split('|').filter(Boolean).map(c => c.trim()));
                    return (
                        <div key={i} className="blog-table-wrap" style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid var(--border)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            margin: '32px 0'
                        }}>
                            <table className="blog-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                                    <tr>{headers?.map((h, hi) => <th key={hi} style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {body.map((row, ri) => (
                                        <tr key={ri}>{row.map((c, ci) => <td key={ci} style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>{c}</td>)}</tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                }
                if (block.startsWith('**')) {
                    const match = block.match(/^\*\*(.+?)\*\*([\s\S]*)$/);
                    if (match) return <p key={i}><strong>{match[1]}</strong>{match[2]}</p>;
                }
                return <p key={i}>{block}</p>;
            });
    };

    const related = blogPosts.filter(p => p.slug !== slug).slice(0, 3);

    return (
        <div className="lp-wrapper">
            <Navbar />

            {/* Hero */}
            <section className="bp-hero" style={{ background: post.gradient }}>
                <div className="hero-bg-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
                <div className="container">
                    <div className="bp-hero-content fade-in">
                        <span className="bp-category">{post.category}</span>
                        <h1 className="bp-title">{T(`${slug}.title`)}</h1>
                        <div className="bp-meta">
                            <span>{formatDate(post.date)}</span>
                            <span style={{ opacity: 0.3 }}>•</span>
                            <span>{post.readTime} {T('blog.readTime')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="section">
                <div className="container">
                    <article className="bp-content fade-in">
                        {renderContent(content)}
                    </article>
                </div>
            </section>

            {/* Related */}
            <section className="section" style={{ background: 'var(--surface-1)' }}>
                <div className="container">
                    <div className="section-header fade-in">
                        <h2 className="section-title">{T('blog.related')}</h2>
                    </div>
                    <div className="blog-grid">
                        {related.map((rp, idx) => (
                            <a key={rp.slug} href={`/blog/${rp.slug}`} className={`blog-card fade-in delay-${idx + 1}`}>
                                <div className="blog-card-image" style={{ background: rp.gradient }}>
                                    <span className="blog-card-emoji">{rp.image}</span>
                                    <span className="blog-card-category">{rp.category}</span>
                                </div>
                                <div className="blog-card-body">
                                    <h3>{T(`${rp.slug}.title`)}</h3>
                                    <span className="blog-card-link">{T('blog.readMore')} →</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
