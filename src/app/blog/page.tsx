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
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const T = (key: string) => bt(lang || 'pl', key);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString(lang === 'de' ? 'de-DE' : lang === 'en' ? 'en-US' : 'pl-PL', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    };

    return (
        <div className="lp-wrapper">
            <Navbar />

            {/* Hero */}
            <section className="blog-hero">
                <div className="hero-bg-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
                <div className="container">
                    <div className="blog-hero-content fade-in">
                        <h1>{T('blog.title')}</h1>
                        <p>{T('blog.subtitle')}</p>
                    </div>
                </div>
            </section>

            {/* Posts */}
            <section className="section">
                <div className="container">
                    <div className="blog-grid">
                        {blogPosts.map((post, idx) => (
                            <a
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className={`blog-card fade-in delay-${idx + 1}`}
                            >
                                <div className="blog-card-image" style={{ background: post.gradient }}>
                                    <span className="blog-card-emoji">{post.image}</span>
                                    <span className="blog-card-category">{post.category}</span>
                                </div>
                                <div className="blog-card-body">
                                    <div className="blog-card-meta">
                                        <span>{formatDate(post.date)}</span>
                                        <span>•</span>
                                        <span>{post.readTime} {T('blog.readTime')}</span>
                                    </div>
                                    <h3>{T(`${post.slug}.title`)}</h3>
                                    <p>{T(`${post.slug}.excerpt`)}</p>
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
