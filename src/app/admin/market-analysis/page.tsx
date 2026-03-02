'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useNotifications } from '@/context/NotificationContext';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { addAgencyService } from '@/lib/firestoreService';

interface AnalysisData {
    trends: { title: string; desc: string; impact: string }[];
    competitors: { name: string; strengths: string; weaknesses: string }[];
    swot: { type: 'Strengths' | 'Weaknesses' | 'Opportunities' | 'Threats'; points: string[] }[];
    actions: { title: string; effort: 'Niski' | 'Średni' | 'Wysoki'; desc: string }[];
    marketPotential: number; // 0-100
    marketReasoning: string;
}

export default function MarketAnalysisPage() {
    const [industry, setIndustry] = useState('');
    const [loading, setLoading] = useState(false);
    const [creatingService, setCreatingService] = useState(false);
    const [data, setData] = useState<AnalysisData | null>(null);
    const [activeTab, setActiveTab] = useState<'trends' | 'competitors' | 'swot' | 'actions'>('trends');
    const { showToast } = useNotifications();

    const generateAnalysis = async () => {
        if (!industry.trim()) {
            showToast('Podaj branżę lub temat do analizy', 'error');
            return;
        }

        setLoading(true);
        setData(null);

        try {
            const winKey = (window as any).NEXT_PUBLIC_GEMINI_API_KEY;
            const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            const apiKey = [winKey, envKey].find(k => k && k !== 'undefined' && k !== '') || '';

            if (!apiKey) {
                showToast('Brak klucza API Gemini', 'error');
                setLoading(false);
                return;
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const prompt = `Jesteś elitarnym strategiem biznesowym agencji ECM Digital. 
Twoim zadaniem jest przeprowadzenie rygorystycznej analizy rynku dla: "${industry}".
Skup się na szansach wdrożenia AI, automatyzacji i nowoczesnych technologii.

Zasady:
- "marketPotential" to liczba 0-100 określająca jak bardzo ta branża potrzebuje cyfryzacji/AI.
- "marketReasoning" to krótkie uzasadnienie tego wyniku.
- "actions" muszą być konkretnymi krokami B2B (np. "Wdrożenie agenta AI do obsługi reklamacji").

Zwróć wynik WYŁĄCZNIE jako JSON w formacie:
{
  "marketPotential": 85,
  "marketReasoning": "Krótkie uzasadnienie (1 zdanie)",
  "trends": [{"title": "Nazwa", "desc": "Opis (2 zdania)", "impact": "Wysoki | Średni | Niski"}],
  "competitors": [{"name": "Typ", "strengths": "Mocne", "weaknesses": "Słabe"}],
  "swot": [
    {"type": "Strengths", "points": ["..."]},
    {"type": "Weaknesses", "points": ["..."]},
    {"type": "Opportunities", "points": ["..."]},
    {"type": "Threats", "points": ["..."]}
  ],
  "actions": [{"title": "Akcja", "effort": "Niski | Średni | Wysoki", "desc": "Instrukcja krok po kroku"}]
}`;

            const result = await model.generateContent(prompt);
            const textResponse = result.response.text();

            // Clean markdown blocks if Gemini returns them
            const cleanJson = textResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
            const parsedData = JSON.parse(cleanJson);
            setData(parsedData);
            showToast('Analiza wygenerowana pomyślnie!', 'success');
        } catch (err: any) {
            console.error('Error in generation:', err);
            showToast('Wystąpił błąd podczas analizy API: ' + err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const generateServiceFromAnalysis = async () => {
        if (!data || !industry) return;
        setCreatingService(true);

        try {
            const winKey = (window as any).NEXT_PUBLIC_GEMINI_API_KEY;
            const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            const apiKey = [winKey, envKey].find(k => k && k !== 'undefined' && k !== '') || '';
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const prompt = `Na podstawie analizy rynku dla "${industry}" (oto akcje doradzane agencji: ${JSON.stringify(data.actions)}),
stwórz nową ofertę agencji (usługę B2B) pomagającą adresować ten rynek dla klienta.
Zwróć poprawny JSON (bez markdown) w formacie:
{
  "slug": "nazwa-uslugi-kreskami-i-malymi-literami",
  "icon": "🚀",
  "gradient": "from-blue-500 to-cyan-400",
  "price": "Od 5000 PLN",
  "techs": ["Nazwa Tech 1", "Nazwa Tech 2"],
  "translations": {
    "pl": {
      "title": "Krótka, mocna nazwa usługi",
      "subtitle": "Opis na jedno zdanie",
      "long": "Dłuższy opis problemu i tego dlaczego ta usługa pomaga. Ok. 3-4 zdania.",
      "features": ["punkt obietnicy 1", "punkt 2", "punkt 3", "punkt 4"],
      "metaTitle": "SEO title (max 60 znaków)",
      "metaDescription": "SEO description (max 160 znaków) z CTA"
    }
  }
}`;
            const result = await model.generateContent(prompt);
            const cleanJson = result.response.text().replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
            const serviceData = JSON.parse(cleanJson);

            await addAgencyService(serviceData);
            showToast('Usługa została stworzona i dodana do bazy! ✅', 'success');
        } catch (err: any) {
            console.error('Error creating service:', err);
            showToast('Błąd tworzenia usługi: ' + err.message, 'error');
        } finally {
            setCreatingService(false);
        }
    };

    return (
        <AdminLayout>
            <div className="crm-page" style={{ padding: '40px' }}>
                <div style={{ marginBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 24 }}>
                    <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.03em', background: 'linear-gradient(90deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        📈 Analiza Rynku AI
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>Wpisz branżę, niszę lub nazwę konkurenta, a system wykorzysta modele językowe by natychmiastowo przygotować podziały SWOT, mapę trendów oraz kroki akcji.</p>
                </div>

                <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 20, fontSize: 18, opacity: 0.5 }}>🔍</div>
                        <input
                            type="text"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            placeholder="Np. Agencje reklamowe B2B, rynek saas dla e-commerce..."
                            onKeyDown={(e) => e.key === 'Enter' && generateAnalysis()}
                            style={{
                                width: '100%',
                                padding: '18px 24px 18px 52px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 16,
                                color: 'white',
                                fontSize: 16,
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                    </div>
                    <button
                        onClick={generateAnalysis}
                        disabled={loading || !industry}
                        style={{
                            padding: '0 32px',
                            background: loading || !industry ? 'rgba(59,130,246,0.3)' : '#3b82f6',
                            color: 'white',
                            fontWeight: 700,
                            borderRadius: 16,
                            cursor: loading || !industry ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            transition: 'all 0.2s',
                            boxShadow: !loading && industry ? '0 10px 20px -10px rgba(59,130,246,0.5)' : 'none'
                        }}
                    >
                        {loading ? <>
                            <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            Analizuję...
                        </> : '💡 Generuj'}
                    </button>
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>

                {data && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, marginBottom: 24, alignItems: 'center' }}>
                        <div style={{
                            background: 'rgba(59,130,246,0.1)',
                            border: '1px solid rgba(59,130,246,0.2)',
                            padding: '24px 32px',
                            borderRadius: 20,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 24
                        }}>
                            <div style={{
                                width: 80, height: 80, borderRadius: '50%',
                                border: '4px solid #3b82f6',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 24, fontWeight: 900, color: '#3b82f6',
                                background: 'rgba(59,130,246,0.1)'
                            }}>
                                {data.marketPotential}%
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Potencjał Rynkowy</h4>
                                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{data.marketReasoning}</p>
                            </div>
                        </div>
                        <button
                            onClick={generateServiceFromAnalysis}
                            disabled={creatingService}
                            style={{
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                fontWeight: 800,
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                border: 'none',
                                cursor: creatingService ? 'not-allowed' : 'pointer',
                                opacity: creatingService ? 0.7 : 1,
                                boxShadow: '0 8px 16px -8px rgba(16,185,129,0.5)'
                            }}
                        >
                            {creatingService ? '🛠️ Budowanie usługi...' : '✨ Utwórz Ofertę Usługi (AI)'}
                        </button>
                    </div>
                )}

                {data && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, overflow: 'hidden' }}>
                        {/* Tabs Navigation */}
                        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 24px', background: 'rgba(0,0,0,0.2)' }}>
                            {(['trends', 'competitors', 'swot', 'actions'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '24px 32px',
                                        background: 'transparent',
                                        color: activeTab === tab ? '#3b82f6' : 'rgba(255,255,255,0.5)',
                                        border: 'none',
                                        borderBottom: `2px solid ${activeTab === tab ? '#3b82f6' : 'transparent'}`,
                                        fontWeight: activeTab === tab ? 700 : 500,
                                        fontSize: 15,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        position: 'relative',
                                        top: 1
                                    }}
                                >
                                    {tab === 'trends' && '🔥 Główne Trendy'}
                                    {tab === 'competitors' && '🥊 Profile Konkurentów'}
                                    {tab === 'swot' && '🎯 Analiza SWOT'}
                                    {tab === 'actions' && '🚀 Rekomendowane Działania'}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div style={{ padding: 40 }}>
                            {activeTab === 'trends' && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                                    {data.trends.map((t, i) => (
                                        <div key={i} style={{ padding: 32, background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'white', lineHeight: 1.3 }}>{t.title}</h3>
                                                <span style={{
                                                    fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 99,
                                                    background: t.impact === 'Wysoki' ? 'rgba(239,68,68,0.1)' : t.impact === 'Średni' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                                                    color: t.impact === 'Wysoki' ? '#ef4444' : t.impact === 'Średni' ? '#f59e0b' : '#10b981', textTransform: 'uppercase'
                                                }}>
                                                    {t.impact} wpływ
                                                </span>
                                            </div>
                                            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontSize: 14 }}>{t.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'competitors' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {data.competitors.map((c, i) => (
                                        <div key={i} style={{ padding: 32, background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{c.name}</h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#10b981', fontWeight: 800, marginBottom: 12 }}><span style={{ fontSize: 20 }}>+</span> Mocne strony</div>
                                                    <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontSize: 14 }}>{c.strengths}</p>
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ef4444', fontWeight: 800, marginBottom: 12 }}><span style={{ fontSize: 20 }}>−</span> Słabe strony</div>
                                                    <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontSize: 14 }}>{c.weaknesses}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'swot' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                    {data.swot.map((s, i) => {
                                        const isPos = s.type === 'Strengths' || s.type === 'Opportunities';
                                        const color = s.type === 'Strengths' ? '#10b981' : s.type === 'Weaknesses' ? '#ef4444' : s.type === 'Opportunities' ? '#3b82f6' : '#f59e0b';
                                        const labels = {
                                            Strengths: 'S - Mocne Strony', Weaknesses: 'W - Słabe Strony', Opportunities: 'O - Szanse', Threats: 'T - Zagrożenia'
                                        };
                                        return (
                                            <div key={i} style={{ padding: 32, background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <h3 style={{ fontSize: 18, fontWeight: 800, color: color, marginBottom: 20, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{labels[s.type]}</h3>
                                                <ul style={{ margin: 0, paddingLeft: 20, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: 14 }}>
                                                    {s.points.map((p, j) => <li key={j} style={{ marginBottom: 10 }}>{p}</li>)}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {activeTab === 'actions' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {data.actions.map((a, i) => (
                                        <div key={i} style={{ padding: 32, background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{a.title}</h3>
                                                <span style={{
                                                    fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 99,
                                                    background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase'
                                                }}>
                                                    Wysiłek: {a.effort}
                                                </span>
                                            </div>
                                            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontSize: 14 }}>{a.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
