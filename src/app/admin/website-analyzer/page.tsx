'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { initializeFirestore, collection, query, orderBy, limit, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';

interface Analysis {
  id: string;
  url: string;
  email?: string;
  name?: string;
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
  suggestedServices?: Array<{
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
  createdAt: any;
}

export default function WebsiteAnalyzerAdmin() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [addingToCRM, setAddingToCRM] = useState(false);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const db = initializeFirestore(app, { ignoreUndefinedProperties: true });

      const q = query(
        collection(db, 'website_analyses'),
        orderBy('createdAt', 'desc'),
        limit(100)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Analysis[];

      setAnalyses(data);
    } catch (error) {
      console.error('Error loading analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCRM = async (analysis: Analysis) => {
    if (!analysis.email) {
      alert('Brak emaila w tej analizie');
      return;
    }

    setAddingToCRM(true);

    try {
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const db = initializeFirestore(app, { ignoreUndefinedProperties: true });

      await addDoc(collection(db, 'clients'), {
        name: analysis.name || 'Website Analysis Lead',
        email: analysis.email,
        status: 'Lead',
        source: 'Website Analyzer',
        service: 'Website Analysis',
        createdAt: Timestamp.now(),
        notes: `Website Score: ${analysis.scores.overall}/100\nURL: ${analysis.url}\n\nRecommendations:\n${analysis.recommendations.map(r => `- ${r.title} (${r.priceMin}-${r.priceMax} PLN)`).join('\n')}`,
      });

      alert('✅ Lead dodany do CRM');
      setSelectedAnalysis(null);
    } catch (error) {
      alert('❌ Błąd przy dodawaniu do CRM');
      console.error(error);
    } finally {
      setAddingToCRM(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <AdminLayout>
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>🔍 Website Analyzer</h1>
          <button
            onClick={loadAnalyses}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              background: '#60a5fa',
              border: 'none',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🔄 Odśwież
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.6)' }}>
            Ładowanie analiz...
          </div>
        ) : analyses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.6)' }}>
            Brak analiz. Odwiedź <a href="/tools/website-analyzer" style={{ color: '#60a5fa' }}>/tools/website-analyzer</a> aby stworzyć pierwszą analizę.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>URL</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Score</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Data</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((analysis, idx) => (
                  <tr key={analysis.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td style={{ padding: '16px', color: 'rgba(255,255,255,0.9)' }}>
                      <a href={analysis.url} target="_blank" rel="noopener" style={{ color: '#60a5fa', textDecoration: 'none' }}>
                        {analysis.url.replace(/https?:\/\//, '').split('/')[0]}
                      </a>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, color: getScoreColor(analysis.scores.overall) }}>
                        {analysis.scores.overall}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: 'rgba(255,255,255,0.7)' }}>
                      {analysis.email || '—'}
                    </td>
                    <td style={{ padding: '16px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                      {new Date(analysis.createdAt?.toDate?.() || 0).toLocaleDateString('pl-PL')}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button
                        onClick={() => setSelectedAnalysis(analysis)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'rgba(96,165,250,0.2)',
                          border: '1px solid rgba(96,165,250,0.4)',
                          color: '#93c5fd',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                        }}
                      >
                        Widok
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detail Modal */}
        {selectedAnalysis && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '20px',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '40px',
              maxWidth: '900px',
              maxHeight: '90vh',
              overflowY: 'auto',
              color: 'white',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>{selectedAnalysis.url}</h2>
                  {selectedAnalysis.email && (
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {selectedAnalysis.name && `${selectedAnalysis.name} • `}
                      {selectedAnalysis.email}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Scores */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>Scores</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  {[
                    { label: 'SEO', key: 'seo' },
                    { label: 'UX', key: 'ux' },
                    { label: 'Performance', key: 'performance' },
                    { label: 'Mobile', key: 'mobile' },
                    { label: 'Conversions', key: 'conversions' },
                  ].map(cat => (
                    <div key={cat.key} style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>{cat.label}</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 700, color: getScoreColor(selectedAnalysis.scores[cat.key as keyof typeof selectedAnalysis.scores]) }}>
                        {selectedAnalysis.scores[cat.key as keyof typeof selectedAnalysis.scores]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Findings */}
              {selectedAnalysis.findings.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>Findings</h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {selectedAnalysis.findings.map((f, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{f.category}</div>
                        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>{f.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {selectedAnalysis.recommendations.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>Recommendations</h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {selectedAnalysis.recommendations.map((rec, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <div style={{ fontWeight: 600 }}>{rec.title}</div>
                          <div style={{ color: '#60a5fa', fontWeight: 700 }}>
                            {rec.priceMin.toLocaleString()}-{rec.priceMax.toLocaleString()} PLN
                          </div>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>{rec.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Services */}
              {selectedAnalysis.suggestedServices && selectedAnalysis.suggestedServices.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>💡 Rekomendowane Usługi</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    {selectedAnalysis.suggestedServices.map((service, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', border: service.priority === 'high' ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{service.emoji}</div>
                        <div style={{ fontWeight: 600, marginBottom: '4px', fontSize: '0.9rem' }}>{service.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>{service.reason}</div>
                        {service.priority === 'high' && (
                          <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>🔴 Wysoki priorytet</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Budget */}
              <div style={{ background: 'rgba(139,92,246,0.1)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Estimated Budget</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#a78bfa' }}>
                  {selectedAnalysis.estimatedBudget.min.toLocaleString()} - {selectedAnalysis.estimatedBudget.max.toLocaleString()} PLN
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {selectedAnalysis.email && (
                  <button
                    onClick={() => handleAddToCRM(selectedAnalysis)}
                    disabled={addingToCRM}
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#10b981',
                      color: 'white',
                      fontWeight: 600,
                      cursor: addingToCRM ? 'not-allowed' : 'pointer',
                      opacity: addingToCRM ? 0.7 : 1,
                    }}
                  >
                    {addingToCRM ? 'Dodawanie...' : '➕ Dodaj do CRM'}
                  </button>
                )}
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
