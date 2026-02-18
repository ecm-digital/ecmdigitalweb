'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
        stats: { value: string; label: string }[];
        pricing: { name: string; price: string; features: string[]; highlighted?: boolean }[];
        faq: { q: string; a: string }[];
        ctaText: string;
        ctaSubtext: string;
        trustBadges: string[];
    };
}

export default function LandingPage({ campaign }: LandingPageProps) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.1 }
        );
        // Observe mostly static elements. FaqItems will handle their own visibility to survive re-renders.
        document.querySelectorAll('.fade-in:not(.lp-faq-item), .fade-in-left, .fade-in-right, .fade-in-scale').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            // 1. Save to Firestore CRM as Lead
            await addLead({
                name,
                email,
                phone,
                service: campaign.headline.substring(0, 50), // Use snippet of headline as service context
                message: `Zainteresowany kampanią: ${campaign.slug}`,
                source: `Landing Page: ${campaign.slug}`,
            });

            // 2. Original n8n Webhook call
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
                    <a href="#lp-form" className="lp-nav-cta">Darmowa Wycena →</a>
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
                    <div className="section-label fade-in">● Korzyści</div>
                    <h2 className="lp-section-title fade-in">Dlaczego my?</h2>
                    <div className="lp-benefits-grid">
                        {campaign.benefits.map((b, i) => (
                            <div key={i} className="lp-benefit-card fade-in">
                                <div className="lp-benefit-icon">{b.icon}</div>
                                <h3>{b.title}</h3>
                                <p>{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* MINI FOOTER */}
            <footer className="lp-footer">
                <div className="container">
                    <div className="lp-footer-content">
                        <Link href="/" className="lp-logo">ECM<span>Digital</span></Link>
                        <p>© {new Date().getFullYear()} ECM Digital. Wszystkie prawa zastrzeżone.</p>
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
