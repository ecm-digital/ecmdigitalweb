'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { addKanbanTask, getContextOS, saveContextOS, getClients, addOffer } from '@/lib/firestoreService';
import { useLanguage } from '@/context/LanguageContext';

const card = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 32,
} as const;

interface ActionItem {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    client: string;
    deadline?: string;
}

interface OfferData {
    clientName: string;
    projectTitle: string;
    businessGoals: string[];
    solutionScope: { title: string; desc: string }[];
    timeline: { phase: string; duration: string }[];
    investment: { item: string; price: string }[];
    totalInvestment: string;
}

interface AnalysisResult {
    summary: string;
    sentiment: string;
    actionItems: ActionItem[];
    keyDecisions: string[];
    followUps: string[];
    potentialOffer?: OfferData;
}

export default function MeetingIntelligencePage() {
    const { T, lang } = useLanguage();
    const [transcript, setTranscript] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [pushingTasks, setPushingTasks] = useState(false);
    const [pushedCount, setPushedCount] = useState(0);
    const [savedToContext, setSavedToContext] = useState(false);
    const [savingToContext, setSavingToContext] = useState(false);
    const [generatingOffer, setGeneratingOffer] = useState(false);
    const [offer, setOffer] = useState<OfferData | null>(null);
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [clients, setClients] = useState<any[]>([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [publishing, setPublishing] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await getClients();
                setClients(data);
            } catch (e) {
                console.error('Fetch clients error:', e);
            }
        };
        fetchClients();
    }, []);

    const analyzeTranscript = async () => {
        if (!transcript.trim()) return;
        setAnalyzing(true);
        setResult(null);
        setOffer(null);

        try {
            const apiKey = (window as any).NEXT_PUBLIC_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY');
            if (!apiKey) {
                alert(T('admin.meeting.apiKeyError'));
                return;
            }

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Jesteś "Meeting Intelligence OS" - systemem analizy spotkań agencji ECM Digital.

Przeanalizuj poniższą transkrypcję spotkania i zwróć odpowiedź WYŁĄCZNIE w formacie JSON:

{
  "summary": "...",
  "sentiment": "...",
  "actionItems": [...],
  "keyDecisions": [...],
  "followUps": [...],
  "potentialOffer": {
    "clientName": "...",
    "projectTitle": "...",
    "businessGoals": ["cel 1", "cel 2"],
    "solutionScope": [{"title": "Moduł/Usługa", "desc": "Co dokładnie zrobimy"}],
    "timeline": [{"phase": "Etap 1", "duration": "ilość dni/tygodni"}],
    "investment": [{"item": "Składnik", "price": "Cena netto"}],
    "totalInvestment": "Suma netto"
  }
}

ZASADY:
1. Odpowiedź MUSI być w języku: ${lang === 'pl' ? 'Polskim' : 'Angielskim'}.
2. Jeśli transkrypcja nie pozwala na stworzenie konkretnej oferty, wypełnij "potentialOffer" rozsądnymi domysłami biznesowymi na bazie kontekstu.
3. Odpowiedź MUSI być poprawnym JSON.`
                            }, {
                                text: `TRANSKRYPCJA: ${transcript}`
                            }]
                        }],
                        generationConfig: { temperature: 0.2, maxOutputTokens: 4096 }
                    })
                }
            );

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const parsed: AnalysisResult = JSON.parse(jsonStr);
            setResult(parsed);
            if (parsed.potentialOffer) setOffer(parsed.potentialOffer);
        } catch (e: any) {
            console.error('Analysis error:', e);
            alert(`${T('admin.meeting.analysisError')}: ${e.message}`);
        } finally {
            setAnalyzing(false);
        }
    };

    const pushToKanban = async () => {
        if (!result?.actionItems.length) return;
        setPushingTasks(true);
        setPushedCount(0);

        try {
            for (const item of result.actionItems) {
                await addKanbanTask({
                    title: item.title,
                    description: `[Meeting Intelligence OS]\n${item.description}`,
                    column: 'todo',
                    priority: item.priority,
                    clientName: item.client,
                    deadline: item.deadline || undefined,
                });
                setPushedCount(prev => prev + 1);
            }
        } catch (e: any) {
            console.error('Push to Kanban error:', e);
        } finally {
            setPushingTasks(false);
        }
    };

    const saveToContextOS = async () => {
        setSavingToContext(true);
        try {
            const ctx = await getContextOS();
            const timestamp = new Date().toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US');
            const notesEntry = `\n\n--- Spotkanie z ${timestamp} ---\n${result?.summary || ''}\nDecyzje: ${result?.keyDecisions?.join('; ') || 'brak'}\nFollow-up: ${result?.followUps?.join('; ') || 'brak'}`;
            await saveContextOS({
                meetingNotes: (ctx.meetingNotes || '') + notesEntry
            });
            setSavedToContext(true);
            setTimeout(() => setSavedToContext(false), 3000);
        } catch (e) {
            console.error('Save to Context OS error:', e);
        } finally {
            setSavingToContext(false);
        }
    };

    const publishOfferToPortal = async () => {
        if (!offer || !selectedClientId) return;
        setPublishing(true);
        try {
            const client = clients.find(c => c.id === selectedClientId);

            // Map OfferData -> Firestore Offer
            const firestoreOffer: any = {
                clientId: selectedClientId,
                clientName: client?.name || offer.clientName,
                title: offer.projectTitle,
                status: 'Wysłana',
                totalPrice: parseFloat(offer.totalInvestment.replace(/[^0-9.]/g, '')),
                items: offer.investment.map(inv => ({
                    service: inv.item,
                    description: '', // Simplified
                    price: parseFloat(inv.price.replace(/[^0-9.]/g, '')) || 0
                })),
                validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                notes: `Wygenerowano na podstawie spotkania. Cele: ${offer.businessGoals.join(', ')}`,
            };

            await addOffer(firestoreOffer);
            alert('Oferta została pomyślnie opublikowana w panelu klienta! 🚀');
            setShowOfferModal(false);
        } catch (e: any) {
            console.error('Publish offer error:', e);
            alert('Błąd publikacji: ' + e.message);
        } finally {
            setPublishing(false);
        }
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'urgent': return { bg: 'rgba(239,68,68,0.1)', fg: '#ef4444', label: `🔴 ${T('admin.kanban.priority.urgent')}` };
            case 'high': return { bg: 'rgba(249,115,22,0.1)', fg: '#f97316', label: `🟠 ${T('admin.kanban.priority.high')}` };
            case 'medium': return { bg: 'rgba(234,179,8,0.1)', fg: '#eab308', label: `🟡 ${T('admin.kanban.priority.medium')}` };
            default: return { bg: 'rgba(34,197,94,0.1)', fg: '#22c55e', label: `🟢 ${T('admin.kanban.priority.low')}` };
        }
    };

    const getSentimentEmoji = (s: string) => {
        if (s === 'positive') return { emoji: '😊', label: T('admin.meeting.sentimentPositive'), color: '#22c55e' };
        if (s === 'negative') return { emoji: '😟', label: T('admin.meeting.sentimentNegative'), color: '#ef4444' };
        return { emoji: '😐', label: T('admin.meeting.sentimentNeutral'), color: '#eab308' };
    };

    return (
        <AdminLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 1000 }}>

                {/* Header */}
                <div>
                    <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                        🗣️ {T('admin.meeting.title').split(' ')[0]} <span style={{ color: '#8b5cf6' }}>{T('admin.meeting.title').split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 8, lineHeight: 1.6 }}>
                        {T('admin.meeting.subtitle')}
                    </p>
                </div>

                {/* Architecture Badge */}
                <div style={{
                    ...card, padding: 20,
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.08))',
                    border: '1px solid rgba(139,92,246,0.15)',
                    display: 'flex', alignItems: 'center', gap: 16,
                }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {['admin.meeting.step1', 'admin.meeting.step2', 'admin.meeting.step3', 'admin.meeting.step4'].map((key, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{
                                    padding: '6px 12px', borderRadius: 10,
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                    fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)',
                                }}>{T(key)}</div>
                                {i < 3 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 18 }}>→</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Input */}
                <div style={card}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 14,
                            background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                        }}>🎙️</div>
                        <div>
                            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{T('admin.meeting.inputTitle')}</h3>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
                                {T('admin.meeting.inputSubtitle')}
                            </p>
                        </div>
                    </div>
                    <textarea
                        value={transcript}
                        onChange={e => setTranscript(e.target.value)}
                        placeholder={T('admin.meeting.placeholder')}
                        style={{
                            width: '100%', minHeight: 200, padding: '16px 20px',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 16, color: 'white', fontSize: 14, lineHeight: 1.7,
                            fontFamily: '"Inter", sans-serif', resize: 'vertical', outline: 'none',
                        }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                            {T('admin.meeting.charInfo', { count: transcript.length.toLocaleString(), min: Math.ceil(transcript.split(/\s+/).length / 150) })}
                        </span>
                        <button
                            onClick={analyzeTranscript}
                            disabled={analyzing || !transcript.trim()}
                            style={{
                                padding: '14px 32px', borderRadius: 14,
                                background: analyzing ? 'rgba(139,92,246,0.3)' : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                                border: 'none', color: 'white', fontWeight: 700, fontSize: 15,
                                cursor: analyzing ? 'wait' : 'pointer',
                                boxShadow: analyzing ? 'none' : '0 4px 20px rgba(139,92,246,0.3)',
                                transition: 'all 0.3s',
                            }}
                        >
                            {analyzing ? `⏳ ${T('admin.meeting.analyzing')}` : `🧠 ${T('admin.meeting.analyzeBtn')}`}
                        </button>
                    </div>
                </div>

                {/* Results */}
                {result && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20 }}>
                            <div style={card}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'rgba(255,255,255,0.5)' }}>📝 {T('admin.meeting.summary')}</h3>
                                    {offer && (
                                        <button
                                            onClick={() => setShowOfferModal(true)}
                                            style={{
                                                padding: '6px 14px', borderRadius: 8,
                                                background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                                                border: 'none', color: 'white', fontWeight: 700, fontSize: 12,
                                                cursor: 'pointer', boxShadow: '0 5px 15px rgba(16,185,129,0.3)'
                                            }}
                                        >
                                            ✨ {lang === 'pl' ? 'Generuj Ofertę PDF' : 'Generate PDF Offer'}
                                        </button>
                                    )}
                                </div>
                                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
                                    {result.summary}
                                </p>
                            </div>
                            <div style={{ ...card, minWidth: 160, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: 40 }}>{getSentimentEmoji(result.sentiment).emoji}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, marginTop: 8, color: getSentimentEmoji(result.sentiment).color }}>
                                    {getSentimentEmoji(result.sentiment).label}
                                </span>
                            </div>
                        </div>

                        {/* Key Decisions + Follow-ups */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div style={card}>
                                <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 16px', color: 'rgba(255,255,255,0.6)' }}>🎯 {T('admin.meeting.decisions')}</h3>
                                {result.keyDecisions.length > 0 ? (
                                    <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {result.keyDecisions.map((d, i) => (
                                            <li key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{d}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>{T('admin.meeting.noDecisions')}</p>
                                )}
                            </div>
                            <div style={card}>
                                <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 16px', color: 'rgba(255,255,255,0.6)' }}>🔄 {T('admin.meeting.followUps')}</h3>
                                {result.followUps.length > 0 ? (
                                    <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {result.followUps.map((f, i) => (
                                            <li key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{f}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>{T('admin.meeting.noFollowUps')}</p>
                                )}
                            </div>
                        </div>

                        {/* Action Items */}
                        <div style={card}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                <div>
                                    <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
                                        📋 {T('admin.meeting.actionItems', { count: result.actionItems.length })}
                                    </h3>
                                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
                                        {T('admin.meeting.actionSubtitle')}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button
                                        onClick={saveToContextOS}
                                        disabled={savingToContext}
                                        style={{
                                            padding: '10px 20px', borderRadius: 12,
                                            background: savedToContext ? 'rgba(16,185,129,0.15)' : 'rgba(139,92,246,0.1)',
                                            border: savedToContext ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(139,92,246,0.2)',
                                            color: savedToContext ? '#34d399' : '#a78bfa',
                                            fontWeight: 700, fontSize: 13, cursor: 'pointer',
                                        }}
                                    >
                                        {savedToContext ? `✅ ${T('admin.context.saved')}` : `🧠 ${T('admin.meeting.saveContext')}`}
                                    </button>
                                    <button
                                        onClick={pushToKanban}
                                        disabled={pushingTasks || pushedCount === result.actionItems.length}
                                        style={{
                                            padding: '10px 24px', borderRadius: 12,
                                            background: pushedCount === result.actionItems.length
                                                ? 'linear-gradient(135deg, #10b981, #059669)'
                                                : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                            border: 'none', color: 'white',
                                            fontWeight: 700, fontSize: 13, cursor: pushingTasks ? 'wait' : 'pointer',
                                            boxShadow: '0 4px 15px rgba(59,130,246,0.3)',
                                        }}
                                    >
                                        {pushedCount === result.actionItems.length
                                            ? `✅ ${T('admin.meeting.addedTasks', { count: pushedCount })}`
                                            : pushingTasks
                                                ? `⏳ ${T('admin.meeting.pushing', { count: pushedCount, total: result.actionItems.length })}`
                                                : `📋 ${T('admin.meeting.pushKanban', { count: result.actionItems.length })}`}
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {result.actionItems.map((item, i) => {
                                    const prio = getPriorityColor(item.priority);
                                    return (
                                        <div key={i} style={{
                                            display: 'flex', alignItems: 'flex-start', gap: 16,
                                            padding: '16px 20px', borderRadius: 18,
                                            background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
                                        }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 12,
                                                background: prio.bg, border: `1px solid ${prio.fg}30`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 16, flexShrink: 0, marginTop: 2,
                                            }}>
                                                {i + 1}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                                    <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{item.title}</span>
                                                    <span style={{
                                                        padding: '2px 10px', borderRadius: 8,
                                                        background: prio.bg, border: `1px solid ${prio.fg}30`,
                                                        fontSize: 10, fontWeight: 700, color: prio.fg,
                                                    }}>{prio.label}</span>
                                                </div>
                                                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '4px 0 0', lineHeight: 1.5 }}>
                                                    {item.description}
                                                </p>
                                                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                                                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>👤 {item.client}</span>
                                                    {item.deadline && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>📅 {item.deadline}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Offer Modal */}
                        {showOfferModal && offer && (
                            <div style={{
                                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                                background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex',
                                alignItems: 'center', justifyContent: 'center', padding: 20,
                                backdropFilter: 'blur(10px)'
                            }}>
                                <div style={{
                                    width: '100%', maxWidth: 850, maxHeight: '90vh',
                                    background: 'white', color: '#1a1a1a', borderRadius: 24,
                                    overflow: 'hidden', display: 'flex', flexDirection: 'column'
                                }}>
                                    {/* Modal Header */}
                                    <div className="no-print" style={{
                                        padding: '20px 40px', borderBottom: '1px solid #eee',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: '#333' }}>
                                            📄 {lang === 'pl' ? 'Podgląd Oferty ECM' : 'ECM Offer Preview'}
                                        </h2>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <select
                                                value={selectedClientId}
                                                onChange={e => setSelectedClientId(e.target.value)}
                                                style={{
                                                    padding: '10px 16px', borderRadius: 12, border: '1px solid #ddd',
                                                    fontSize: 13, background: '#fff', color: '#000'
                                                }}
                                            >
                                                <option value="">-- Wybierz klienta --</option>
                                                {clients.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={publishOfferToPortal}
                                                disabled={!selectedClientId || publishing}
                                                style={{
                                                    padding: '10px 24px', borderRadius: 12,
                                                    background: '#10b981', color: 'white', border: 'none',
                                                    fontWeight: 700, cursor: selectedClientId ? 'pointer' : 'not-allowed',
                                                    opacity: selectedClientId ? 1 : 0.5
                                                }}
                                            >
                                                {publishing ? '⏳' : '🚀 Portal'}
                                            </button>
                                            <button
                                                onClick={() => window.print()}
                                                style={{ padding: '10px 24px', borderRadius: 12, background: '#3b82f6', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                                            >
                                                🖨️ PDF
                                            </button>
                                            <button
                                                onClick={() => setShowOfferModal(false)}
                                                style={{ padding: '10px 20px', borderRadius: 12, background: '#f5f5f5', color: '#666', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                                            >
                                                Zamknij
                                            </button>
                                        </div>
                                    </div>

                                    {/* Offer Content (Printable) */}
                                    <div id="printable-offer" style={{ padding: '60px 80px', overflowY: 'auto', flex: 1 }}>
                                        <style>{`
                                    @media print {
                                        body * { visibility: hidden; }
                                        #printable-offer, #printable-offer * { visibility: visible; }
                                        #printable-offer { position: absolute; left: 0; top: 0; width: 100%; padding: 0; }
                                        .no-print { display: none !important; }
                                    }
                                `}</style>

                                        {/* Logo / Header */}
                                        <div style={{ marginBottom: 60, display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, color: '#000' }}>ECM Digital</h1>
                                                <p style={{ margin: '4px 0', color: '#666', fontSize: 14 }}>Enterprise Software & AI Agency</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ margin: 0, fontWeight: 800 }}>PROPOZYCJA WSPÓŁPRACY</p>
                                                <p style={{ margin: '4px 0', fontSize: 13, color: '#999' }}>{new Date().toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {/* Client Info */}
                                        <div style={{ marginBottom: 40 }}>
                                            <p style={{ color: '#999', fontSize: 12, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.1em' }}>Dla Klienta:</p>
                                            <h2 style={{ fontSize: 24, margin: 0 }}>{offer.clientName}</h2>
                                            <p style={{ fontSize: 18, color: '#3b82f6', marginTop: 4 }}>{offer.projectTitle}</p>
                                        </div>

                                        {/* Goals */}
                                        <div style={{ marginBottom: 40 }}>
                                            <h3 style={{ fontSize: 16, borderBottom: '2px solid #3b82f6', display: 'inline-block', paddingBottom: 4, marginBottom: 16 }}>CELE PROJEKTOWE</h3>
                                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                                                {offer.businessGoals.map((g, i) => (
                                                    <li key={i} style={{ marginBottom: 8, fontSize: 15, color: '#333' }}>{g}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Scope */}
                                        <div style={{ marginBottom: 40 }}>
                                            <h3 style={{ fontSize: 16, borderBottom: '2px solid #3b82f6', display: 'inline-block', paddingBottom: 4, marginBottom: 16 }}>ZAKRES ROZWIĄZANIA</h3>
                                            <div style={{ display: 'grid', gap: 20 }}>
                                                {offer.solutionScope.map((s, i) => (
                                                    <div key={i} style={{ padding: 20, background: '#f8fafc', borderRadius: 12 }}>
                                                        <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 800 }}>{s.title}</h4>
                                                        <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>{s.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Timeline */}
                                        <div style={{ marginBottom: 40 }}>
                                            <h3 style={{ fontSize: 16, borderBottom: '2px solid #3b82f6', display: 'inline-block', paddingBottom: 4, marginBottom: 16 }}>HARMONOGRAM PRAC</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                {offer.timeline.map((t, i) => (
                                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: 8 }}>
                                                        <span style={{ fontSize: 14 }}>{t.phase}</span>
                                                        <span style={{ fontSize: 14, fontWeight: 700, color: '#3b82f6' }}>{t.duration}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Investment */}
                                        <div style={{ marginTop: 60, padding: 40, background: '#000', color: '#fff', borderRadius: 20 }}>
                                            <h3 style={{ fontSize: 14, color: '#3b82f6', marginBottom: 24, letterSpacing: '0.1em' }}>PODSUMOWANIE INWESTYCJI</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                                {offer.investment.map((inv, i) => (
                                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: 12 }}>
                                                        <span style={{ fontSize: 15 }}>{inv.item}</span>
                                                        <span style={{ fontWeight: 700 }}>{inv.price}</span>
                                                    </div>
                                                ))}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12 }}>
                                                    <span style={{ fontSize: 18, fontWeight: 900 }}>SUMA NETTO</span>
                                                    <span style={{ fontSize: 24, fontWeight: 900, color: '#3b82f6' }}>{offer.totalInvestment}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: 60, textAlign: 'center', fontSize: 12, color: '#999' }}>
                                            ECM Digital Sp. z o.o. • Enterprise Software & AI • ecm-digital.com
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
