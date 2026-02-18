'use client';

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { addLead } from '@/lib/firestoreService';
import { trackLead, trackCTAClick } from '@/lib/ga';

export default function ContactSection() {
    const { T } = useLanguage();

    return (
        <section id="contact" className="section" style={{ background: 'var(--surface-1)' }}>
            <div className="container">
                <div className="section-header fade-in">
                    <div className="section-label">● {T('contact.label')}</div>
                    <h2 className="section-title">{T('contact.title')}</h2>
                    <p className="section-subtitle">{T('contact.subtitle')}</p>
                </div>
                <div className="contact-grid">
                    <div className="contact-info fade-in-left">
                        <div className="contact-methods">
                            <a
                                href="mailto:hello@ecm-digital.com"
                                className="contact-method"
                                onClick={() => trackCTAClick('Email', 'ContactSection')}
                            >
                                <div className="contact-method-icon">✉</div>
                                <div>
                                    <h4>{T('contact.email.title')}</h4>
                                    <p>{T('contact.email.value')}</p>
                                </div>
                            </a>
                            <a
                                href="tel:+48535330323"
                                className="contact-method"
                                onClick={() => trackCTAClick('Phone', 'ContactSection')}
                            >
                                <div className="contact-method-icon">📞</div>
                                <div>
                                    <h4>{T('contact.phone.title')}</h4>
                                    <p>{T('contact.phone.value')}</p>
                                </div>
                            </a>
                            <div className="contact-method">
                                <div className="contact-method-icon">🕐</div>
                                <div>
                                    <h4>{T('contact.hours.title')}</h4>
                                    <p>{T('contact.hours.value')}</p>
                                </div>
                            </div>
                            <a href="https://www.google.com/maps/place/Prosta+20,+00-850+Warszawa/@52.2299557,20.9863459,17z/" target="_blank" rel="noopener noreferrer" className="contact-method">
                                <div className="contact-method-icon">📍</div>
                                <div>
                                    <h4>Lokalizacja</h4>
                                    <p>ul. Prosta 20, 00-850 Warszawa</p>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="contact-form-wrapper fade-in-right">
                        <h3>{T('contact.form.title')}</h3>
                        <ContactForm T={T} />
                    </div>
                </div>
                <div className="map-embed fade-in" style={{ marginTop: '48px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.493!2d20.9884253!3d52.2300034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecc90a7e08967%3A0x5e0f545464f1d041!2sProsta+20%2C+00-850+Warszawa!5e0!3m2!1spl!2spl!4v1715854800000!5m2!1spl!2spl"
                        width="100%"
                        height="350"
                        style={{ border: 0, filter: 'grayscale(0.3) contrast(1.1)' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="ECM Digital - Lokalizacja"
                    />
                </div>
            </div>
        </section>
    );
}

function ContactForm({ T }: { T: (key: string) => string }) {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('sending');
        const form = e.currentTarget;
        const formData = new FormData(form);

        const data: Record<string, any> = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        data.source = 'ecm-digital-website';
        data.timestamp = new Date().toISOString();
        data.language = typeof document !== 'undefined' ? document.documentElement.lang : 'pl';

        try {
            await addLead({
                name: data.name,
                email: data.email,
                company: data.company,
                service: data.service,
                message: data.message,
                source: 'Website Contact Form',
            });
        } catch (fsError) {
            console.error('Error adding lead to Firestore:', fsError);
        }

        const n8nWebhookUrl = 'https://primary-production-4224.up.railway.app/webhook/contact-form';

        try {
            const res = await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus('sent');
                trackLead('ContactForm', data.service);
                form.reset();
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    if (status === 'sent') {
        return (
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                <h4 style={{ marginBottom: '8px' }}>Wiadomość wysłana!</h4>
                <p style={{ color: 'var(--text-secondary)' }}>Odpowiemy najszybciej jak to możliwe.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-group">
                    <label>{T('contact.form.name')}</label>
                    <input type="text" name="name" required />
                </div>
                <div className="form-group">
                    <label>{T('contact.form.email')}</label>
                    <input type="email" name="email" required />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>{T('contact.form.company')}</label>
                    <input type="text" name="company" />
                </div>
                <div className="form-group">
                    <label>{T('contact.form.service')}</label>
                    <select name="service">
                        <option value="">{T('contact.form.service.placeholder')}</option>
                        <option>AI Agents</option>
                        <option>Websites</option>
                        <option>Mobile Apps</option>
                        <option>Automation (N8N)</option>
                        <option>MVP Prototype</option>
                        <option>AI Audit</option>
                        <option>Social Media</option>
                    </select>
                </div>
            </div>
            <div className="form-group">
                <label>{T('contact.form.message')}</label>
                <textarea name="message" required></textarea>
            </div>
            <button type="submit" className="btn-submit" disabled={status === 'sending'}>
                {status === 'sending' ? '⏳ Wysyłanie...' : `${T('contact.form.submit')} →`}
            </button>
        </form>
    );
}
