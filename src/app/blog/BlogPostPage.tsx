'use client';

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

    const related = blogPosts.filter(p => p.slug !== slug).slice(0, 3);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: T(`${slug}.title`),
        description: T(`${slug}.excerpt`),
        image: `https://www.ecm-digital.com/assets/images/ecm-digital-og.svg`,
        datePublished: post.date,
        dateModified: post.date,
        author: {
            "@type": "Organization",
            "name": "ECM Digital",
            "url": "https://www.ecm-digital.com"
        }
    };

    return (
        <div className="lp-wrapper">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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
                    <article className="bp-content fade-in prose prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content}
                        </ReactMarkdown>
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
