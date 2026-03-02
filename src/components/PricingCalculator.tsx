'use client';

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { addLead } from '@/lib/firestoreService';
import { trackLead } from '@/lib/ga';

const SERVICES = [
  { key: 'ai-agents', label: 'AI Agents', price: { min: 5000, max: 15000 } },
  { key: 'websites', label: 'Websites', price: { min: 2500, max: 8000 } },
  { key: 'ecommerce', label: 'E-commerce', price: { min: 4000, max: 12000 } },
  { key: 'automation', label: 'Automation (N8N)', price: { min: 1500, max: 5000 } },
  { key: 'mvp', label: 'MVP Prototype', price: { min: 8000, max: 25000 } },
  { key: 'ai-audit', label: 'AI Audit', price: { min: 500, max: 2000 } },
];

export default function PricingCalculator() {
  const { T, lang } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [scope, setScope] = useState('');
  const [timeline, setTimeline] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const selectedServiceData = SERVICES.find(s => s.key === selectedService);
  const estimatedPrice = selectedServiceData
    ? `${selectedServiceData.price.min.toLocaleString()} - ${selectedServiceData.price.max.toLocaleString()} PLN`
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    if (!email || !name) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      await addLead({
        name,
        email,
        company,
        service: selectedService,
        message: `Pricing Calculator Lead\nScope: ${scope}\nTimeline: ${timeline}`,
        source: 'Pricing Calculator',
      });

      fetch('https://primary-production-4224.up.railway.app/webhook/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, company,
          service: selectedService,
          source: 'Pricing Calculator',
          timestamp: new Date().toISOString(),
          language: lang,
        }),
      }).catch(console.error);

      fetch('/api/notify/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, service: selectedService }),
      }).catch(console.error);

      trackLead('PricingCalculator', selectedService);
      setStatus('sent');

      setTimeout(() => {
        setStep(1);
        setSelectedService('');
        setScope('');
        setTimeline('');
        setEmail('');
        setName('');
        setCompany('');
        setStatus('idle');
      }, 5000);

    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMsg('Error saving lead. Please try again.');
    }
  };

  if (status === 'sent') {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', color: 'white' }}>
          {T('common.success')}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>
          Our team will contact you with a customized quote within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
      <form onSubmit={handleSubmit}>
        {/* STEP 1: Service Selection */}
        {step >= 1 && (
          <div className="fade-in-up" style={{ opacity: step === 1 ? 1 : 0.5, marginBottom: step === 1 ? '0' : '0', transition: 'opacity 0.3s' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '24px', color: 'white' }}>
              {step === 1 ? '1. What service are you interested in?' : '✓ Service Selected'}
            </h3>
            {step === 1 && (
              <div style={{ display: 'grid', gap: '12px' }}>
                {SERVICES.map(s => (
                  <label
                    key={s.key}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: `2px solid ${selectedService === s.key ? '#60a5fa' : 'rgba(255,255,255,0.1)'}`,
                      background: selectedService === s.key ? 'rgba(96, 165, 250, 0.1)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <input
                      type="radio"
                      name="service"
                      value={s.key}
                      checked={selectedService === s.key}
                      onChange={(e) => setSelectedService(e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: 'white', marginBottom: '4px' }}>{s.label}</div>
                      <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                        from {s.price.min.toLocaleString()} PLN
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
            {step > 1 && selectedService && (
              <p style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                ✓ {SERVICES.find(s => s.key === selectedService)?.label}
              </p>
            )}
          </div>
        )}

        {/* STEP 2: Scope Selection */}
        {step >= 2 && selectedService && (
          <div className="fade-in-up" style={{ marginTop: '32px', opacity: step === 2 ? 1 : 0.5, transition: 'opacity 0.3s' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '24px', color: 'white' }}>
              {step === 2 ? '2. What is the scope?' : '✓ Scope Defined'}
            </h3>
            {step === 2 && (
              <div style={{ display: 'grid', gap: '12px' }}>
                {['Small (MVP)', 'Medium (Production)', 'Large (Enterprise)'].map((s, idx) => (
                  <label
                    key={idx}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: `2px solid ${scope === s ? '#60a5fa' : 'rgba(255,255,255,0.1)'}`,
                      background: scope === s ? 'rgba(96, 165, 250, 0.1)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <input
                      type="radio"
                      name="scope"
                      value={s}
                      checked={scope === s}
                      onChange={(e) => setScope(e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 700, color: 'white' }}>{s}</span>
                  </label>
                ))}
              </div>
            )}
            {step > 2 && scope && (
              <p style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                ✓ {scope}
              </p>
            )}
          </div>
        )}

        {/* STEP 3: Timeline */}
        {step >= 3 && scope && (
          <div className="fade-in-up" style={{ marginTop: '32px', opacity: step === 3 ? 1 : 0.5, transition: 'opacity 0.3s' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '24px', color: 'white' }}>
              {step === 3 ? '3. When do you need it?' : '✓ Timeline Set'}
            </h3>
            {step === 3 && (
              <div style={{ display: 'grid', gap: '12px' }}>
                {['ASAP (1-2 weeks)', '1 Month', '2-3 Months', 'No deadline'].map((t, idx) => (
                  <label
                    key={idx}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: `2px solid ${timeline === t ? '#60a5fa' : 'rgba(255,255,255,0.1)'}`,
                      background: timeline === t ? 'rgba(96, 165, 250, 0.1)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <input
                      type="radio"
                      name="timeline"
                      value={t}
                      checked={timeline === t}
                      onChange={(e) => setTimeline(e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 700, color: 'white' }}>{t}</span>
                  </label>
                ))}
              </div>
            )}
            {step > 3 && timeline && (
              <p style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                ✓ {timeline}
              </p>
            )}
          </div>
        )}

        {/* STEP 4: Contact Info */}
        {step >= 4 && timeline && (
          <div className="fade-in-up" style={{ marginTop: '32px', opacity: step === 4 ? 1 : 0.5, transition: 'opacity 0.3s' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '24px', color: 'white' }}>
              4. Tell us about yourself
            </h3>
            {step === 4 && (
              <div style={{ display: 'grid', gap: '16px' }}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
                <input
                  type="text"
                  placeholder="Company (optional)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
                {estimatedPrice && (
                  <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#93c5fd',
                  }}>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Estimated Budget:</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{estimatedPrice}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
          }}>
            {errorMsg}
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '32px', justifyContent: 'space-between' }}>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              style={{
                padding: '12px 32px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              ← Back
            </button>
          )}
          <button
            type="submit"
            disabled={
              (step === 1 && !selectedService) ||
              (step === 2 && !scope) ||
              (step === 3 && !timeline) ||
              (step === 4 && (!email || !name)) ||
              status === 'sending'
            }
            style={{
              padding: '12px 32px',
              borderRadius: '12px',
              background: step === 4 ? '#60a5fa' : 'rgba(96, 165, 250, 0.2)',
              border: '1px solid rgba(96, 165, 250, 0.5)',
              color: 'white',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              flex: 1,
              opacity: (step === 1 && !selectedService) || (step === 2 && !scope) || (step === 3 && !timeline) || (step === 4 && (!email || !name)) ? 0.5 : 1,
            }}
          >
            {step === 4
              ? status === 'sending'
                ? 'Sending...'
                : 'Get Free Quote →'
              : 'Next Step →'}
          </button>
        </div>

        {/* Progress Indicator */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'center' }}>
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: step >= i ? '#60a5fa' : 'rgba(255,255,255,0.1)',
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>
      </form>
    </div>
  );
}
