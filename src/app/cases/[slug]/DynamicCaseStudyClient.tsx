'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';
import { getCaseStudies, CaseStudy } from '@/lib/firestoreService';
import { useLanguage } from '@/context/LanguageContext';

interface Translation {
    category?: string;
    title?: string;
    description?: string;
    results?: string;
    metaTitle?: string;
    metaDescription?: string;
}

export default function DynamicCaseStudyPage() {
    const [slug, setSlug] = useState<string>('');
    const { lang, T } = useLanguage();
    const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const parts = window.location.pathname.split('/').filter(Boolean);
        const realSlug = parts[parts.length - 1] || '';
        setSlug(realSlug);
    }, []);

    useEffect(() => {
        if (!slug) return;
        const fetchCase = async () => {
            try {
                const all = await getCaseStudies();
                const found = all.find(c => c.slug === slug);
                if (found) setCaseStudy(found);
                else setNotFound(true);
            } catch {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        fetchCase();
    }, [slug]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up').forEach(el => observer.observe(el));

        // APPLY SEO META TAGS
        if (caseStudy) {
            const l = lang || 'pl';
            const t = (caseStudy.translations?.[l] || caseStudy.translations?.pl || {}) as Translation;

            if (t.metaTitle) document.title = t.metaTitle;
            else if (t.title) document.title = `${t.title} | ECM Digital Case Study`;

            if (t.metaDescription) {
                let metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) metaDesc.setAttribute('content', t.metaDescription);
            }
        }

        return () => observer.disconnect();
    }, [caseStudy, lang]);

    if (loading) return (
        <div className="lp-wrapper">
            <Navbar />
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070710' }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <div style={{ fontSize: 48, marginBottom: 24 }}>⏳</div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>{T('cs.loading')}</p>
                </div>
            </div>
            <Footer />
        </div>
    );

    if (notFound || !caseStudy) return (
        <div className="lp-wrapper">
            <Navbar />
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070710' }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <div style={{ fontSize: 64, marginBottom: 24 }}>🔍</div>
                    <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>{T('cs.notFoundTitle')}</h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>Case study &ldquo;{slug}&rdquo; {T('cs.notFoundDesc')}</p>
                    <a href="/portfolio" style={{ padding: '14px 28px', background: '#3b82f6', color: 'white', borderRadius: 14, textDecoration: 'none', fontWeight: 700 }}>{T('cs.backToPortfolio')}</a>
                </div>
            </div>
            <Footer />
        </div>
    );

    const l = lang || 'pl';
    const t: Translation = (caseStudy.translations?.[l] || caseStudy.translations?.pl || {}) as Translation;
    const color = caseStudy.color || '#3b82f6';

    return (
        <div className="lp-wrapper">
            <Navbar />

            {/* Hero */}
            <section style={{
                minHeight: '60vh', display: 'flex', alignItems: 'center',
                paddingTop: '160px', paddingBottom: '80px',
                background: '#070710', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: '10%', left: '10%', width: '40vw', height: '40vw', background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-20%', right: '10%', width: '30vw', height: '30vw', background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`, filter: 'blur(100px)', pointerEvents: 'none' }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="fade-in-up" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{
                            width: 90, height: 90, margin: '0 auto 32px',
                            background: `linear-gradient(135deg, ${color}40, ${color}10)`,
                            border: `1px solid ${color}40`, borderRadius: 24,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 40, boxShadow: `0 0 40px ${color}30`,
                        }}>🏆</div>

                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '8px 20px', borderRadius: 999,
                            background: `${color}15`, border: `1px solid ${color}30`,
                            fontSize: 12, fontWeight: 800, color,
                            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24,
                        }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
                            {t.category || 'Case Study'}
                        </div>

                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'white', marginBottom: 24 }}>
                            {t.title || slug}
                        </h1>

                        {t.description && (
                            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 600, margin: '0 auto' }}>
                                {t.description}
                            </p>
                        )}

                        {t.results && (
                            <div style={{
                                marginTop: 40, display: 'inline-flex', alignItems: 'center', gap: 12,
                                padding: '16px 28px', borderRadius: 16,
                                background: `${color}15`, border: `1px solid ${color}30`,
                                color: 'white', fontSize: '1rem', fontWeight: 700,
                            }}>
                                🚀 {t.results}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Content blocks */}
            <section style={{ padding: '80px 0', background: '#070710' }}>
                <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
                    {t.description && (
                        <div className="fade-in-up" style={{
                            padding: '40px', borderRadius: 24,
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                            marginBottom: 32,
                        }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: 20 }}>{T('cs.aboutProject')}</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '1.05rem' }}>{t.description}</p>
                        </div>
                    )}

                    {t.results && (
                        <div className="fade-in-up" style={{
                            padding: '40px', borderRadius: 24,
                            background: `linear-gradient(135deg, ${color}10, transparent)`,
                            border: `1px solid ${color}25`, marginBottom: 32,
                        }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: 16 }}>{T('cs.achievedResults')}</h2>
                            <p style={{ color, fontWeight: 700, fontSize: '1.15rem' }}>🚀 {t.results}</p>
                        </div>
                    )}

                    <div className="fade-in-up" style={{ textAlign: 'center', marginTop: 60 }}>
                        <a href="/portfolio" style={{
                            display: 'inline-block', padding: '14px 32px',
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 14, color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 15,
                        }}>{T('cs.otherCases')}</a>
                    </div>
                </div>
            </section>

            <ContactSection />
            <Footer />
        </div>
    );
}
