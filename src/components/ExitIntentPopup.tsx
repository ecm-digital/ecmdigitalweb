'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { addLead } from '@/lib/firestoreService';
import { trackLead } from '@/lib/ga';

export default function ExitIntentPopup() {
  const { T, lang } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Only show once per session
    const hasShown = sessionStorage.getItem('exit-intent-shown');
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse leaves from top of the page
      if (e.clientY <= 0 && !isVisible) {
        setIsVisible(true);
        sessionStorage.setItem('exit-intent-shown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [isVisible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrorMsg('Please enter your email');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      await addLead({
        name: email.split('@')[0],
        email,
        service: 'AI Audit',
        message: 'Exit Intent Lead - Interested in Free AI Audit',
        source: 'Exit Intent Popup',
      });

      fetch('https://primary-production-4224.up.railway.app/webhook/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: email.split('@')[0],
          service: 'AI Audit',
          source: 'Exit Intent Popup',
          timestamp: new Date().toISOString(),
          language: lang,
        }),
      }).catch(console.error);

      fetch('/api/notify/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: email.split('@')[0], email, service: 'AI Audit' }),
      }).catch(console.error);

      trackLead('ExitIntentPopup', 'AI Audit');
      setStatus('sent');

      setTimeout(() => {
        setIsVisible(false);
        setEmail('');
        setStatus('idle');
      }, 4000);

    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMsg('Error saving. Please try again.');
    }
  };

  if (!isVisible) return null;

  if (status === 'sent') {
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
        <div className="premium-glass-panel rounded-3xl p-8 max-w-md text-center animate-fade-in-up" style={{ borderRadius: '28px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', color: 'white' }}>
            Perfect!
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
            Check your email for the free AI audit invitation. Our team will be in touch within 24 hours.
          </p>
          <button
            onClick={() => setIsVisible(false)}
            style={{
              padding: '12px 32px',
              borderRadius: '12px',
              background: '#60a5fa',
              border: 'none',
              color: 'white',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Got it!
          </button>
          <style jsx>{`
            @keyframes fade-in-up {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up {
              animation: fade-in-up 0.5s ease-out forwards;
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="premium-glass-panel rounded-3xl p-8 max-w-md animate-fade-in-up" style={{ borderRadius: '28px' }}>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          ✕
        </button>

        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', color: 'white' }}>
          Wait! 👋
        </h3>

        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: '1.6' }}>
          Before you go, get a <span style={{ color: '#10b981', fontWeight: 700 }}>free AI audit</span> of your business.
          Discover how AI & automation can save you time and increase revenue.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
          <input
            type="email"
            placeholder="Your email"
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

          {errorMsg && (
            <div style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.85rem',
            }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: '#10b981',
              border: 'none',
              color: 'white',
              fontWeight: 700,
              cursor: status === 'sending' ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              opacity: status === 'sending' ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            {status === 'sending' ? 'Sending...' : 'Get Free Audit →'}
          </button>

          <button
            type="button"
            onClick={() => setIsVisible(false)}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            No thanks
          </button>
        </form>

        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '16px', textAlign: 'center' }}>
          ✓ No spam • ✓ No strings attached
        </p>

        <style jsx>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: scale(0.95) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.4s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
}
