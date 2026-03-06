'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';

interface AnalysisResult {
  scores: {
    seo: number;
    ux: number;
    performance: number;
    mobile: number;
    conversions: number;
    overall: number;
  };
  findings: Array<{
    category: string;
    severity: 'high' | 'medium' | 'low';
    message: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    effortDays: number;
    priceMin: number;
    priceMax: number;
  }>;
  suggestedServices: Array<{
    name: string;
    emoji: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  summary: string;
  estimatedBudget: {
    min: number;
    max: number;
  };
}

const messages = [
  'Skanowanie SEO...',
  'Analiza UX/Design...',
  'Testowanie performance...',
  'Sprawdzanie mobile...',
  'Analiza konwersji...',
  'Generowanie raportu...',
];

export default function WebsiteAnalyzerPage() {
  const { T } = useLanguage();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleAnalyze = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setAnalysis(null);
    setShowEmailForm(false);
    setSubmitted(false);
    setCurrentMessage(0);

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 1500);

    try {
      const response = await fetch('/api/ai/analyze-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const result = (await response.json()) as AnalysisResult;
      setAnalysis(result);
      setShowEmailForm(true);
    } catch (error) {
      alert('Analiza nie powiodła się. Sprawdź URL i spróbuj ponownie.');
      console.error(error);
    } finally {
      clearInterval(messageInterval);
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !analysis) return;

    try {
      await fetch('/api/ai/analyze-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, email, name }),
      });

      setSubmitted(true);
    } catch (error) {
      alert('Błąd przy zapisywaniu. Spróbuj ponownie.');
      console.error(error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getSeverityEmoji = (severity: string) => {
    if (severity === 'high') return '🔴';
    if (severity === 'medium') return '🟡';
    return '🟢';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
      <Navbar />

      {/* Hero Section */}
      {!analysis && (
        <div style={{ padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '16px' }}>
              🔍 Darmowa Analiza AI Twojej Strony
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '40px' }}>
              Dowiedz się, co możesz poprawić na swojej stronie internetowej. Automatyczna analiza SEO, UX, Performance i konwersji.
            </p>

            {/* Input Section */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
              <input
                type="url"
                placeholder="https://twoja-strona.pl"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleAnalyze()}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1rem',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  color: '#1a1a2e',
                  cursor: loading ? 'not-allowed' : 'text',
                }}
              />
              <button
                onClick={handleAnalyze}
                disabled={loading}
                style={{
                  padding: '14px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: '#60a5fa',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.3s',
                }}
              >
                {loading ? 'Analizuję...' : 'Analizuj za darmo'}
              </button>
            </div>

            {/* Loading Message */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', marginBottom: '20px', minHeight: '32px' }}>
                  {messages[currentMessage]}
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#60a5fa',
                        animation: `pulse ${1 + i * 0.2}s infinite`,
                        opacity: 0.6 + i * 0.15,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Section */}
      {analysis && (
        <div style={{ padding: '60px 24px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Score Card */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '48px 32px', marginBottom: '40px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>Ogólny Score</h2>
              <div style={{
                fontSize: '5rem',
                fontWeight: 800,
                color: getScoreColor(analysis.scores.overall),
                marginBottom: '12px',
              }}>
                {analysis.scores.overall}
              </div>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }}>na 100 punktów</p>
            </div>

            {/* Category Scores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              {[
                { label: 'SEO', key: 'seo' },
                { label: 'UX/Design', key: 'ux' },
                { label: 'Performance', key: 'performance' },
                { label: 'Mobile', key: 'mobile' },
                { label: 'Konwersje', key: 'conversions' },
              ].map(cat => (
                <div key={cat.key} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>{cat.label}</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: getScoreColor(analysis.scores[cat.key as keyof typeof analysis.scores]) }}>
                    {analysis.scores[cat.key as keyof typeof analysis.scores]}
                  </div>
                  <div style={{
                    height: '4px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '2px',
                    marginTop: '12px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${analysis.scores[cat.key as keyof typeof analysis.scores]}%`,
                      background: getScoreColor(analysis.scores[cat.key as keyof typeof analysis.scores]),
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Findings */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '24px' }}>🔎 Znalezione Problemy</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {analysis.findings.map((finding, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 20px', display: 'flex', gap: '16px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{getSeverityEmoji(finding.severity)}</span>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'white', marginBottom: '4px' }}>{finding.category}</div>
                      <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>{finding.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Services */}
            {analysis.suggestedServices && analysis.suggestedServices.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '24px' }}>💡 Rekomendowane Usługi ECM Digital</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                  {analysis.suggestedServices.map((service, i) => (
                    <div key={i} style={{
                      background: service.priority === 'high'
                        ? 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0.05) 100%)'
                        : service.priority === 'medium'
                        ? 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.05) 100%)'
                        : 'rgba(255,255,255,0.03)',
                      border: service.priority === 'high'
                        ? '1px solid rgba(239,68,68,0.3)'
                        : service.priority === 'medium'
                        ? '1px solid rgba(245,158,11,0.3)'
                        : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      padding: '20px',
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{service.emoji}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>{service.name}</div>
                      <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>{service.reason}</div>
                      {service.priority === 'high' && (
                        <div style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>🔴 Priorytet: Wysoki</div>
                      )}
                      {service.priority === 'medium' && (
                        <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>🟡 Priorytet: Średni</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Email Gate */}
            {showEmailForm && !submitted && (
              <div style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: '16px', padding: '32px', marginBottom: '40px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'white', marginBottom: '12px' }}>📊 Pobierz Pełne Rekomendacje</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>Otrzymaj szczegółowe rekomendacje i wycenę prac.</p>
                <form onSubmit={handleEmailSubmit} style={{ display: 'grid', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Imię i Nazwisko"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      fontSize: '1rem',
                    }}
                  />
                  <input
                    type="email"
                    placeholder="twój@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      fontSize: '1rem',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#60a5fa',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '1rem',
                    }}
                  >
                    Pobierz Raport
                  </button>
                </form>
              </div>
            )}

            {/* Full Report After Submission */}
            {submitted && (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '16px', padding: '32px', marginBottom: '40px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#10b981', marginBottom: '24px' }}>✅ Raport wysłany na Twój email</h3>

                {/* Recommendations */}
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '20px' }}>📋 Rekomendacje</h4>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {analysis.recommendations.map((rec, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                          <div>
                            <h5 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>{rec.title}</h5>
                            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>{rec.description}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#60a5fa', marginBottom: '4px' }}>
                              {rec.priceMin.toLocaleString('pl-PL')} - {rec.priceMax.toLocaleString('pl-PL')} PLN
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{rec.effortDays} dni pracy</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', padding: '20px', marginTop: '24px' }}>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Całkowity Budżet:</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#a78bfa' }}>
                      {analysis.estimatedBudget.min.toLocaleString('pl-PL')} - {analysis.estimatedBudget.max.toLocaleString('pl-PL')} PLN
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button
                onClick={() => window.location.href = '/#contact'}
                style={{
                  padding: '16px 40px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                }}
                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                📞 Umów Darmową Konsultację
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
