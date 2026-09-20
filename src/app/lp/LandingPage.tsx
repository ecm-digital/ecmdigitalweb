'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { addLead } from '@/lib/firestoreService';
import '../globals.css';

interface LandingPageProps {
    campaign: {
        slug: string;
        headline: string;
        subheadline: string;
        heroEmoji: string;
        gradient: string;
        benefits: { icon: string; title: string; desc: string }[];
        benefitsTitle?: string;
        benefitsLabel?: string;
        stats: { value: string; label: string }[];
        pricing: { name: string; price: string; subtext?: string; features: string[]; highlighted?: boolean }[];
        faq: { q: string; a: string }[];
        ctaText: string;
        ctaSubtext: string;
        trustBadges: string[];
        methodology?: { title: string; desc: string }[];
        bookingUrl?: string;
        testimonials?: { quote: string; author: string; role: string; avatar: string }[];
    };
}

function RenderIcon({ name, className, size = 32 }: { name: string; className?: string; size?: number }) {
    const Icon = (LucideIcons as any)[name];
    if (Icon) {
        return <Icon className={className} size={size} />;
    }
    return <span className={className} style={{ fontSize: `${size}px`, lineHeight: 1 }}>{name}</span>;
}

export default function LandingPage({ campaign }: LandingPageProps) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.1 }
        );
        document.querySelectorAll('.fade-in:not(.lp-faq-item), .fade-in-left, .fade-in-right, .fade-in-scale').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            await addLead({
                name,
                email,
                phone,
                service: campaign.headline.substring(0, 50),
                message: `Zainteresowany kampanią: ${campaign.slug}`,
                source: `Landing Page: ${campaign.slug}`,
            });

            const res = await fetch('https://ecmdigital.app.n8n.cloud/webhook/landing-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name, email, phone,
                    campaign: campaign.slug,
                    source: 'google-ads',
                    landingPage: window.location.pathname,
                    timestamp: new Date().toISOString(),
                }),
            });

            if (res.ok) { setStatus('success'); }
            else { setStatus('error'); }
        } catch (err) {
            console.error('Lead Capture Error:', err);
            setStatus('error');
        }
    };

    return (
        <div className="lp-wrapper">
            {/* HERO */}
            <section className="lp-hero" style={{ background: campaign.gradient }}>
                <div className="lp-bg-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
                <div className="lp-hero-glow"></div>
                <nav className="lp-nav">
                    <Link href="/" className="lp-logo">ECM<span>Digital</span></Link>
                    <a href="#lp-form" className="lp-nav-cta">Bezpłatna Wycena →</a>
                </nav>
                <div className="lp-hero-content container">
                    <div className="lp-hero-text">
                        <div className="lp-hero-emoji">{campaign.heroEmoji}</div>
                        <h1 className="lp-headline">{campaign.headline}</h1>
                        <p className="lp-subheadline">{campaign.subheadline}</p>
                        <div className="lp-hero-cta-row">
                            <a href="#lp-form" className="lp-btn-primary">Zamów Bezpłatną Wycenę →</a>
                            <a href="#lp-benefits" className="lp-btn-ghost">Dowiedz się więcej ↓</a>
                        </div>
                        <div className="lp-trust-row">
                            {campaign.trustBadges.map((badge, i) => (
                                <span key={i} className="lp-trust-badge">{badge}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS BAR */}
            <section className="lp-stats-bar">
                <div className="container">
                    <div className="lp-stats-grid">
                        {campaign.stats.map((stat, i) => (
                            <div key={i} className="lp-stat fade-in">
                                <div className="lp-stat-value">{stat.value}</div>
                                <div className="lp-stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BENEFITS */}
            <section id="lp-benefits" className="lp-benefits">
                <div className="container">
                    <div className="section-label fade-in">{campaign.benefitsLabel || '● Korzyści'}</div>
                    <h2 className="lp-section-title fade-in">{campaign.benefitsTitle || 'Dlaczego my?'}</h2>
                    <div className="lp-benefits-grid">
                        {campaign.benefits.map((b, i) => (
                            <div key={i} className="lp-benefit-card fade-in">
                                <div className="lp-benefit-icon" style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                                    <RenderIcon name={b.icon} size={36} />
                                </div>
                                <h3>{b.title}</h3>
                                <p>{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* METHODOLOGY */}
            {campaign.methodology && campaign.methodology.length > 0 && (
                <section id="lp-methodology" className="lp-methodology">
                    <div className="container">
                        <div className="section-label fade-in">● Metodologia</div>
                        <h2 className="lp-section-title fade-in">Nasza metodologia wdrożenia</h2>
                        <p className="lp-section-subtitle fade-in" style={{
                            textAlign: 'center',
                            maxWidth: '700px',
                            margin: '-20px auto 50px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '1.1rem',
                            lineHeight: '1.6'
                        }}>
                            Ustrukturyzowany proces wdrożeniowy gwarantuje sukces i stały zwrot z inwestycji, zamiast jednorazowej konfiguracji.
                        </p>
                        <div className="lp-methodology-grid">
                            {campaign.methodology.map((m, i) => (
                                <div key={i} className="lp-methodology-card fade-in">
                                    <div className="lp-methodology-step-number">
                                        0{i + 1}
                                    </div>
                                    <h3>{m.title}</h3>
                                    <p>{m.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* PRICING */}
            <section className="lp-pricing">
                <div className="container">
                    <div className="section-label fade-in">● Oferta</div>
                    <h2 className="lp-section-title fade-in">Pakiety i Ceny</h2>
                    <div className="lp-pricing-grid">
                        {campaign.pricing.map((plan, i) => (
                            <div key={i} className={`lp-price-card fade-in ${plan.highlighted ? 'lp-price-highlighted' : ''}`}>
                                {plan.highlighted && <div className="lp-price-badge">Najpopularniejszy</div>}
                                <h3>{plan.name}</h3>
                                <div className="lp-price-value">{plan.price}</div>
                                {plan.subtext && (
                                    <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginTop: '-16px', marginBottom: '24px', lineHeight: 1.4 }}>
                                        {plan.subtext}
                                    </div>
                                )}
                                <ul>
                                    {plan.features.map((f, j) => (
                                        <li key={j}>✓ {f}</li>
                                    ))}
                                </ul>
                                <a href="#lp-form" className="lp-price-btn">Zamów wycenę →</a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            {campaign.testimonials && campaign.testimonials.length > 0 && (
                <section className="lp-testimonials" style={{ padding: '120px 20px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="container" style={{ maxWidth: '800px' }}>
                        <div className="section-label fade-in" style={{ textAlign: 'center' }}>● Referencje</div>
                        <h2 className="lp-section-title fade-in" style={{ textAlign: 'center', marginBottom: '60px' }}>Co mówią nasi klienci</h2>
                        <div style={{ display: 'grid', gap: '32px' }}>
                            {campaign.testimonials.map((t, idx) => (
                                <div key={idx} className="premium-glass-panel fade-in" style={{ padding: '40px', borderRadius: '24px', position: 'relative' }}>
                                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, marginBottom: '24px', fontStyle: 'italic' }}>
                                        "{t.quote}"
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{
                                            width: '44px', height: '44px', borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--brand-accent), #7c3aed)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 700, color: 'white'
                                        }}>
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, color: 'white' }}>{t.author}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ */}
            <section className="lp-faq">
                <div className="container">
                    <div className="section-label fade-in">● FAQ</div>
                    <h2 className="lp-section-title fade-in">Często zadawane pytania</h2>
                    <div className="lp-faq-list">
                        {campaign.faq.map((item, i) => (
                            <LpFaqItem
                                key={i}
                                q={item.q}
                                a={item.a}
                                isOpen={openFaq === i}
                                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* LEAD FORM */}
            <section id="lp-form" className="lp-form-section">
                <div className="container">
                    <div className="lp-form-card">
                        <div className="lp-form-header">
                            <h2>{campaign.ctaText}</h2>
                            <p>{campaign.ctaSubtext}</p>
                        </div>
                        {status === 'success' ? (
                            <div className="lp-form-success">
                                <div className="lp-success-icon">🎉</div>
                                <h3>Dziękujemy!</h3>
                                <p>Skontaktujemy się w ciągu 24h z darmową wyceną.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="lp-form">
                                <div className="lp-form-group">
                                    <input type="text" placeholder="Imię i nazwisko" value={name} onChange={e => setName(e.target.value)} required />
                                </div>
                                <div className="lp-form-group">
                                    <input type="email" placeholder="Adres email" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div className="lp-form-group">
                                    <input type="tel" placeholder="Numer telefonu (opcjonalne)" value={phone} onChange={e => setPhone(e.target.value)} />
                                </div>
                                {status === 'error' && <p className="lp-form-error">Coś poszło nie tak. Spróbuj ponownie.</p>}
                                <button type="submit" className="lp-form-submit" disabled={status === 'sending'}>
                                    {status === 'sending' ? '⏳ Wysyłanie...' : 'Wyślij zapytanie →'}
                                </button>
                                <p className="lp-form-privacy">🔒 Twoje dane są bezpieczne. Bez spamu.</p>

                                <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0 16px', width: '100%' }}>
                                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                                    <span style={{ padding: '0 16px', color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>lub</span>
                                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                                </div>

                                <a 
                                    href={campaign.bookingUrl || "https://calendly.com/ecm-digital/konsultacja"} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="lp-form-submit" 
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '10px', 
                                        background: 'rgba(255,255,255,0.03)', 
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'rgba(255,255,255,0.85)',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                    }}
                                >
                                    📅 Zarezerwuj termin konsultacji od razu →
                                </a>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* MINI FOOTER */}
            <footer className="lp-footer" style={{ padding: '40px 20px', background: 'var(--brand-primary)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="container">
                    <div className="lp-footer-content" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
                        <div>
                            <Link href="/" className="lp-logo">ECM<span>Digital</span></Link>
                            <p style={{ marginTop: '8px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                                © {new Date().getFullYear()} ECM Digital. Wszystkie prawa zastrzeżone.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                            <a href="mailto:kontakt@ecm-digital.com" style={{ transition: 'color 0.2s' }} className="lp-footer-link">✉ kontakt@ecm-digital.com</a>
                            <a href="https://www.linkedin.com/company/ecm-digital" target="_blank" rel="noopener noreferrer" style={{ transition: 'color 0.2s' }} className="lp-footer-link">🔗 LinkedIn</a>
                            <a href="/privacy" style={{ transition: 'color 0.2s' }} className="lp-footer-link">Polityka prywatności</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function LpFaqItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`lp-faq-item fade-in ${visible ? 'visible' : ''} ${isOpen ? 'open' : ''}`}
            onClick={onToggle}
        >
            <div className="lp-faq-question">
                <span>{q}</span>
                <span className="lp-faq-toggle">{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && <div className="lp-faq-answer">{a}</div>}
        </div>
    );
}
