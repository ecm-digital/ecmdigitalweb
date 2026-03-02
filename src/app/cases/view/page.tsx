'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';
import { getCaseStudies, CaseStudy } from '@/lib/firestoreService';
import { useLanguage } from '@/context/LanguageContext';

export default function CaseStudyViewPage() {
    const { lang, T } = useLanguage();
    const [slug, setSlug] = useState('');
    const [cs, setCs] = useState<CaseStudy | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const s = params.get('slug') || '';
        setSlug(s);
        if (!s) { setNotFound(true); setLoading(false); return; }
        getCaseStudies().then(all => {
            const found = all.find(c => c.slug === s);
            if (found) setCs(found); else setNotFound(true);
        }).catch(() => setNotFound(true)).finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="lp-wrapper">
            <Navbar />
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070710' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#3b82f6', borderRadius: '50%', margin: '0 auto 24px', animation: 'spin 1s linear infinite' }} />
                    <p style={{ color: 'rgba(255,255,255,0.3)' }}>{T('cs.loading')}</p>
                </div>
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <Footer />
        </div>
    );

    if (notFound || !cs) return (
        <div className="lp-wrapper">
            <Navbar />
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070710' }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <div style={{ fontSize: 64, marginBottom: 24 }}>🔍</div>
                    <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>{T('cs.notFoundTitle')}</h1>
                    <a href="/portfolio" style={{ padding: '14px 32px', background: '#3b82f6', color: 'white', borderRadius: 14, textDecoration: 'none', fontWeight: 700 }}>{T('cs.backToPortfolio')}</a>
                </div>
            </div>
            <Footer />
        </div>
    );

    const l = lang || 'pl';
    const t = (cs.translations?.[l] || cs.translations?.pl || {}) as any;
    const color = cs.color || '#3b82f6';
    const stats = t.resultsStats?.filter((s: any) => s.value && s.label) || [];
    const techs = t.technologies || [];

    return (
        <div className="lp-wrapper">
            <Navbar />
            <style>{`
                @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
                @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
                .cs-section{animation:fadeUp 0.6s ease both}
                .cs-s1{animation-delay:0.1s}.cs-s2{animation-delay:0.2s}.cs-s3{animation-delay:0.3s}.cs-s4{animation-delay:0.4s}
            `}</style>

            {/* ── Hero ── */}
            <section style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', paddingTop: 160, paddingBottom: 80, background: '#070710', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '5%', left: '-5%', width: '50vw', height: '50vw', background: `radial-gradient(circle, ${color}20, transparent 70%)`, filter: 'blur(80px)', animation: 'float 12s infinite' }} />
                <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '40vw', height: '40vw', background: `radial-gradient(circle, ${color}12, transparent 70%)`, filter: 'blur(100px)', animation: 'float 16s infinite reverse' }} />

                <div className="container cs-section cs-s1">
                    <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
                        {/* Meta row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, fontWeight: 900, padding: '5px 14px', borderRadius: 999, background: `${color}20`, border: `1px solid ${color}40`, color, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                {t.category || 'Case Study'}
                            </span>
                            {t.client && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>👤 {t.client}</span>}
                            {cs.year && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>📅 {cs.year}</span>}
                            {cs.duration && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>⏱ {cs.duration}</span>}
                        </div>

                        <h1 style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, color: 'white', marginBottom: 28 }}>
                            {t.title || slug}
                        </h1>

                        {t.description && (
                            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: 680, margin: '0 auto 40px' }}>
                                {t.description}
                            </p>
                        )}

                        {/* Summary stats */}
                        {stats.length > 0 && (
                            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
                                {stats.map((s: any, i: number) => (
                                    <div key={i} style={{ padding: '20px 28px', background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 20, textAlign: 'center', minWidth: 140 }}>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color, letterSpacing: '-0.03em' }}>{s.value}</div>
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Single result line if no stats */}
                        {stats.length === 0 && t.results && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 32px', borderRadius: 18, background: `${color}15`, border: `1px solid ${color}30`, color: 'white', fontWeight: 800 }}>
                                🚀 {t.results}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Challenge / Solution (2-col) ── */}
            {(t.challenge || t.solution) && (
                <section style={{ padding: '80px 0', background: 'linear-gradient(180deg, #070710, #0a0a1a)' }}>
                    <div className="container cs-section cs-s2">
                        <div style={{ display: 'grid', gridTemplateColumns: t.challenge && t.solution ? '1fr 1fr' : '1fr', gap: 24, maxWidth: 900, margin: '0 auto' }}>
                            {t.challenge && (
                                <div style={{ padding: '36px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24 }}>
                                    <div style={{ fontSize: 28, marginBottom: 16 }}>❗</div>
                                    <h2 style={{ fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 16 }}>{T('cs.challengeTitle')}</h2>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: 15 }}>{t.challenge}</p>
                                </div>
                            )}
                            {t.solution && (
                                <div style={{ padding: '36px', background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 24 }}>
                                    <div style={{ fontSize: 28, marginBottom: 16 }}>💡</div>
                                    <h2 style={{ fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 16 }}>{T('cs.solutionTitle')}</h2>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: 15 }}>{t.solution}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Technologies ── */}
            {techs.length > 0 && (
                <section style={{ padding: '60px 0', background: '#0a0a1a' }}>
                    <div className="container cs-section cs-s3" style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
                        <h2 style={{ fontSize: 14, fontWeight: 900, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>{T('cs.technologies')}</h2>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                            {techs.map((tech: string) => (
                                <span key={tech} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${color}30`, borderRadius: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 14 }}>
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Testimonial ── */}
            {t.testimonial?.quote && (
                <section style={{ padding: '80px 0', background: '#070710' }}>
                    <div className="container cs-section cs-s4" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
                        <div style={{ fontSize: 64, color: color, lineHeight: 1, marginBottom: 20, opacity: 0.6 }}>&ldquo;</div>
                        <blockquote style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, margin: '0 0 32px', fontWeight: 500 }}>
                            {t.testimonial.quote}
                        </blockquote>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '16px 24px', background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 16 }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${color}80, ${color}30)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: 18 }}>
                                {t.testimonial.author?.[0] || '?'}
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 800, color: 'white', fontSize: 15 }}>{t.testimonial.author}</div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t.testimonial.role}</div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Description if no challenge/solution ── */}
            {!t.challenge && !t.solution && t.description && (
                <section style={{ padding: '80px 0', background: '#0a0a1a' }}>
                    <div className="container" style={{ maxWidth: 760, margin: '0 auto' }}>
                        <div style={{ padding: '44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24 }}>
                            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 20 }}>{T('cs.aboutProject')}</h2>
                            <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.85, fontSize: '1.05rem' }}>{t.description}</p>
                        </div>
                    </div>
                </section>
            )}

            <section style={{ padding: '40px 0 80px', background: '#070710', textAlign: 'center' }}>
                <a href="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, color: 'white', textDecoration: 'none', fontWeight: 700 }}>
                    {T('cs.otherCases')}
                </a>
            </section>

            <ContactSection />
            <Footer />
        </div>
    );
}
