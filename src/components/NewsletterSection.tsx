import { useState, useEffect, useRef } from 'react';
import { addLead } from '@/lib/firestoreService';

import { Lang } from '@/translations';

interface NewsletterProps {
    lang?: Lang;
}

const translations = {
    pl: {
        badge: '📬 Newsletter',
        title: 'Darmowy e-book + cotygodniowe porady',
        subtitle: 'Zapisz się i otrzymaj bezpłatny przewodnik "10 Sposobów na Automatyzację Firmy z AI" + cotygodniowe porady z marketing, AI i technologii.',
        placeholder: 'Twój adres email',
        button: 'Pobieram e-book →',
        sending: '⏳ Wysyłanie...',
        success: '🎉 Dziękujemy! Sprawdź swoją skrzynkę email.',
        error: 'Coś poszło nie tak. Spróbuj ponownie.',
        privacy: '🔒 Bez spamu. Możesz zrezygnować w każdej chwili.',
        benefit1: '📖 Darmowy e-book PDF',
        benefit2: '💡 Cotygodniowe porady',
        benefit3: '🚀 Ekskluzywne oferty',
    },
    en: {
        badge: '📬 Newsletter',
        title: 'Free e-book + weekly tips',
        subtitle: 'Subscribe and get a free guide "10 Ways to Automate Your Business with AI" + weekly tips on marketing, AI and technology.',
        placeholder: 'Your email address',
        button: 'Get the e-book →',
        sending: '⏳ Sending...',
        success: '🎉 Thank you! Check your inbox.',
        error: 'Something went wrong. Try again.',
        privacy: '🔒 No spam. Unsubscribe anytime.',
        benefit1: '📖 Free PDF e-book',
        benefit2: '💡 Weekly tips',
        benefit3: '🚀 Exclusive offers',
    },
    de: {
        badge: '📬 Newsletter',
        title: 'Kostenloses E-Book + wöchentliche Tipps',
        subtitle: 'Abonnieren Sie und erhalten Sie einen kostenlosen Leitfaden "10 Wege zur Automatisierung mit KI" + wöchentliche Tipps.',
        placeholder: 'Ihre E-Mail-Adresse',
        button: 'E-Book herunterladen →',
        sending: '⏳ Senden...',
        success: '🎉 Danke! Überprüfen Sie Ihr Postfach.',
        error: 'Etwas ist schiefgelaufen. Versuchen Sie es erneut.',
        privacy: '🔒 Kein Spam. Jederzeit abmeldbar.',
        benefit1: '📖 Kostenloses PDF',
        benefit2: '💡 Wöchentliche Tipps',
        benefit3: '🚀 Exklusive Angebote',
    },
    szl: {
        badge: '📬 Brif',
        title: 'Darmowy e-book + porady co tydziyń',
        subtitle: 'Zapisz sie i bier za darmo "10 Sposobów na Automatyzacja Firmy z AI" + porady marketingowe.',
        placeholder: 'Twój email',
        button: 'Dejcie mi tyn e-book →',
        sending: '⏳ Posyłom...',
        success: '🎉 Dziynki! Zobocz na email.',
        error: 'Coś sie popsuło. Spróbuj jeszcze roz.',
        privacy: '🔒 Żodnego spamu. Możesz sie wypisać.',
        benefit1: '📖 Darmowy PDF',
        benefit2: '💡 Porady co tydziyń',
        benefit3: '🚀 Ekstra oferty',
    },
    es: {
        badge: '📬 Boletín',
        title: 'E-book gratis + consejos semanales',
        subtitle: 'Suscríbete y recibe gratis la guía "10 Formas de Automatizar tu Negocio con IA" + consejos semanales.',
        placeholder: 'Tu dirección de correo',
        button: 'Obtener el e-book →',
        sending: '⏳ Enviando...',
        success: '🎉 ¡Gracias! Revisa tu bandeja de entrada.',
        error: 'Algo salió mal. Inténtalo de nuevo.',
        privacy: '🔒 Sin spam. Darse de baja en cualquier momento.',
        benefit1: '📖 PDF gratuito',
        benefit2: '💡 Consejos semanales',
        benefit3: '🚀 Ofertas exclusivas',
    },
    ar: {
        badge: '📬 النشرة الإخبارية',
        title: 'كتاب إلكتروني مجاني + نصائح أسبوعية',
        subtitle: 'اشترك واحصل على دليل مجاني "10 طرق لأتمتة عملك بالذكاء الاصطناعي" + نصائح أسبوعية.',
        placeholder: 'عنوان بريدك الإلكتروني',
        button: 'احصل على الكتاب الإلكتروني →',
        sending: '⏳ جاري الإرسال...',
        success: '🎉 شكراً لك! تفقد بريدك الوارد.',
        error: 'حدث خطأ ما. حاول مرة أخرى.',
        privacy: '🔒 لا رسائل مزعجة. يمكنك إلغاء الاشتراك في أي وقت.',
        benefit1: '📖 كتاب PDF مجاني',
        benefit2: '💡 نصائح أسبوعية',
        benefit3: '🚀 عروض حصرية',
    },
};

export default function NewsletterSection({ lang = 'pl' }: NewsletterProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const T = translations[lang] || translations['pl'];
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        const elements = sectionRef.current.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up');
        elements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('sending');
        try {
            // 1. Add to Firestore CRM as Lead
            await addLead({
                name: 'Subskrybent Newslettera',
                email,
                message: 'Zapis na newsletter (E-book: 10 Sposobów na Automatyzację Firmy z AI)',
                source: 'Strona WWW (Newsletter)',
            });

            // 2. Call n8n Webhook
            const res = await fetch('https://ecmdigital.app.n8n.cloud/webhook/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    source: 'website-newsletter',
                    language: lang,
                    leadMagnet: '10-ways-ai-automation',
                    timestamp: new Date().toISOString(),
                }),
            });

            if (res.ok) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error('Newsletter Lead Error:', err);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <section className="newsletter-section">
                <div className="container">
                    <div className="newsletter-card newsletter-success">
                        <div className="newsletter-success-icon">🎉</div>
                        <h3>{T.success}</h3>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} className="newsletter-section relative overflow-hidden" style={{ padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 60%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }}></div>
            <div className="container relative z-10">
                <div className="newsletter-card fade-in premium-glass-panel" style={{ padding: '64px', borderRadius: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', boxShadow: '0 0 80px rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div className="newsletter-content" style={{ maxWidth: '600px', width: '100%' }}>
                        <div className="section-label" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '32px', fontWeight: 600 }}>{T.badge}</div>
                        <h2 className="newsletter-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.03em', lineHeight: 1.2 }}>{T.title}</h2>
                        <p className="newsletter-subtitle" style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '48px', lineHeight: 1.6 }}>{T.subtitle}</p>

                        <form onSubmit={handleSubmit} className="newsletter-form" style={{ width: '100%' }}>
                            <div className="newsletter-input-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <label htmlFor="newsletter-email" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>{T.placeholder}</label>
                                <input
                                    id="newsletter-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={T.placeholder}
                                    required
                                    className="newsletter-input"
                                    style={{ width: '100%', padding: '24px 32px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1.1rem', paddingRight: '220px', transition: 'all 0.4s' }}
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="newsletter-btn"
                                    style={{ position: 'absolute', right: '8px', top: '8px', bottom: '8px', padding: '0 32px', borderRadius: '999px', background: 'white', color: '#050507', fontWeight: 800, border: 'none', cursor: 'pointer', transition: 'all 0.3s', fontSize: '1.05rem' }}
                                >
                                    {status === 'sending' ? T.sending : T.button}
                                </button>
                            </div>
                            {status === 'error' && <p className="newsletter-error" style={{ color: '#ef4444', marginTop: '16px' }}>{T.error}</p>}
                            <p className="newsletter-privacy" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginTop: '24px', fontFamily: 'var(--font-mono)' }}>{T.privacy}</p>
                        </form>
                    </div>

                    <div className="newsletter-benefits" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px', marginTop: '48px', paddingTop: '48px', borderTop: '1px solid rgba(255,255,255,0.1)', width: '100%' }}>
                        <div className="newsletter-benefit" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', color: 'white' }}><span style={{ fontSize: '1.5rem' }}>📖</span> {T.benefit1.replace('📖 ', '')}</div>
                        <div className="newsletter-benefit" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', color: 'white' }}><span style={{ fontSize: '1.5rem' }}>💡</span> {T.benefit2.replace('💡 ', '')}</div>
                        <div className="newsletter-benefit" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', color: 'white' }}><span style={{ fontSize: '1.5rem' }}>🚀</span> {T.benefit3.replace('🚀 ', '')}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
