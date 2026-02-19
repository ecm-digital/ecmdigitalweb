import { useState } from 'react';
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
        <section className="newsletter-section">
            <div className="container">
                <div className="newsletter-card fade-in">
                    <div className="newsletter-content">
                        <div className="section-label">● Newsletter</div>
                        <h2 className="newsletter-title">{T.title}</h2>
                        <p className="newsletter-subtitle">{T.subtitle}</p>

                        <form onSubmit={handleSubmit} className="newsletter-form">
                            <div className="newsletter-input-wrap">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={T.placeholder}
                                    required
                                    className="newsletter-input"
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="newsletter-btn"
                                >
                                    {status === 'sending' ? T.sending : T.button}
                                </button>
                            </div>
                            {status === 'error' && <p className="newsletter-error">{T.error}</p>}
                            <p className="newsletter-privacy">{T.privacy}</p>
                        </form>
                    </div>

                    <div className="newsletter-benefits">
                        <div className="newsletter-benefit">{T.benefit1}</div>
                        <div className="newsletter-benefit">{T.benefit2}</div>
                        <div className="newsletter-benefit">{T.benefit3}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
