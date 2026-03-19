'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { UsemeBid, getUsemeBids, addUsemeBid, updateUsemeBid, deleteUsemeBid } from '@/lib/firestoreService';
import { useNotifications } from '@/context/NotificationContext';
import { Timestamp } from 'firebase/firestore';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export default function UsemeBidsPage() {
    const { showToast } = useNotifications();
    const [bids, setBids] = useState<UsemeBid[]>([]);
    const [loading, setLoading] = useState(true);
    const [pasteText, setPasteText] = useState('');
    const [parsedBids, setParsedBids] = useState<Omit<UsemeBid, 'id'>[]>([]);

    // Side panel state
    const [selectedBid, setSelectedBid] = useState<UsemeBid | null>(null);
    const [requirementsText, setRequirementsText] = useState('');
    const [submissionText, setSubmissionText] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [coverageResult, setCoverageResult] = useState<any>(null);

    // Load bids
    useEffect(() => {
        loadBids();
    }, []);

    const loadBids = async () => {
        setLoading(true);
        try {
            const data = await getUsemeBids();
            setBids(data);
        } catch (err) {
            showToast('Błąd ładowania ofert', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Parser for Useme format
    const parseUsemeText = (text: string) => {
        const regex = /(.+?)\s+—\s+(.+?)\s*\|\s*([0-9\s]+)\s*PLN\s*\/\s*(\d+)\s*dni/gi;
        const parsed: Omit<UsemeBid, 'id'>[] = [];
        let match;

        while ((match = regex.exec(text)) !== null) {
            const client = match[1].trim();
            const description = match[2].trim();
            const price = parseInt(match[3].replace(/\s/g, ''), 10);
            const days = parseInt(match[4], 10);

            if (client && description && !isNaN(price) && !isNaN(days)) {
                parsed.push({
                    client,
                    description,
                    price,
                    days,
                    status: 'Wysłana',
                    sentAt: Timestamp.now(),
                });
            }
        }

        return parsed;
    };

    const handleParse = () => {
        if (!pasteText.trim()) {
            showToast('Wklej tekst z Useme', 'error');
            return;
        }

        const parsed = parseUsemeText(pasteText);
        if (parsed.length === 0) {
            showToast('Nie znaleziono ofert - sprawdź format', 'error');
            return;
        }

        setParsedBids(parsed);
        showToast(`Znaleziono ${parsed.length} ofert`, 'success');
    };

    const handleSaveAll = async () => {
        if (parsedBids.length === 0) return;

        try {
            for (const bid of parsedBids) {
                await addUsemeBid(bid);
            }
            showToast(`Zapisano ${parsedBids.length} ofert`, 'success');
            setPasteText('');
            setParsedBids([]);
            loadBids();
        } catch (err) {
            showToast('Błąd zapisu', 'error');
        }
    };

    const handleStatusChange = async (id: string, newStatus: UsemeBid['status']) => {
        try {
            await updateUsemeBid(id, { status: newStatus });
            showToast('Status zaktualizowany', 'success');
            loadBids();
        } catch (err) {
            showToast('Błąd aktualizacji', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Usunąć tę ofertę?')) return;
        try {
            await deleteUsemeBid(id);
            showToast('Oferta usunięta', 'success');
            loadBids();
        } catch (err) {
            showToast('Błąd usunięcia', 'error');
        }
    };

    // Open detail panel
    const openPanel = (bid: UsemeBid) => {
        setSelectedBid(bid);
        setRequirementsText(bid.requirements || '');
        setSubmissionText(bid.mySubmission || '');
        setCoverageResult(null);
    };

    // Save panel data
    const savePanelData = async () => {
        if (!selectedBid || !selectedBid.id) return;
        try {
            await updateUsemeBid(selectedBid.id, {
                requirements: requirementsText,
                mySubmission: submissionText,
            });
            showToast('Dane zapisane', 'success');
            loadBids();
            setSelectedBid(null);
        } catch (err) {
            showToast('Błąd zapisu', 'error');
        }
    };

    // AI Coverage Analysis
    const analyzeCoverage = async () => {
        if (!requirementsText.trim() || !submissionText.trim()) {
            showToast('Wklej wymagania i ofertę', 'error');
            return;
        }

        setAnalyzing(true);
        try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Analizuj pokrycie wymagań klienta w ofercie:

WYMAGANIA KLIENTA:
${requirementsText}

MOJA OFERTA/PROPOZYCJA:
${submissionText}

Zwróć JSON:
{
  "score": <0-100>,
  "covered": [<lista pokrytych wymagań>],
  "missing": [<lista niewyjaśnionych wymagań>],
  "summary": "<krótkie podsumowanie>"
}

Tylko JSON, bez opisu.`
                        }]
                    }],
                    generationConfig: { temperature: 0.3 }
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': GEMINI_API_KEY
                }
            });

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                setCoverageResult(result);
                showToast('Analiza gotowa', 'success');
            } else {
                showToast('Błąd parsowania odpowiedzi', 'error');
            }
        } catch (err) {
            showToast('Błąd analizy AI', 'error');
            console.error(err);
        } finally {
            setAnalyzing(false);
        }
    };

    // Save coverage result
    const saveCoverageResult = async () => {
        if (!selectedBid || !selectedBid.id || !coverageResult) return;
        try {
            await updateUsemeBid(selectedBid.id, {
                coverageScore: coverageResult.score,
                coverageNotes: JSON.stringify(coverageResult),
            });
            showToast('Wynik analizy zapisany', 'success');
            loadBids();
            setSelectedBid(null);
        } catch (err) {
            showToast('Błąd zapisu', 'error');
        }
    };

    // Stats
    const totalBids = bids.length;
    const totalValue = bids.reduce((sum, bid) => sum + bid.price, 0);
    const wonBids = bids.filter(b => b.status === 'Wygrana').length;
    const successRate = totalBids > 0 ? Math.round((wonBids / totalBids) * 100) : 0;
    const analyzedBids = bids.filter(b => b.coverageScore !== undefined).length;

    return (
        <AdminLayout>
            <div className="crm-page">
                {/* Header */}
                <div className="crm-header">
                    <h1 className="crm-title">📤 Useme Bids Tracker</h1>
                    <p className="crm-subtitle">Śledź oferty wysłane na platformie Useme + analiza pokrycia wymagań</p>
                </div>

                {/* Stats */}
                <div className="crm-mini-stats">
                    <div className="crm-mini-stat">
                        <div className="stat-value">{totalBids}</div>
                        <div className="stat-label">Łącznie wysłane</div>
                    </div>
                    <div className="crm-mini-stat">
                        <div className="stat-value">{totalValue.toLocaleString()} PLN</div>
                        <div className="stat-label">Łączna wartość</div>
                    </div>
                    <div className="crm-mini-stat">
                        <div className="stat-value">{wonBids}</div>
                        <div className="stat-label">Wygranych</div>
                    </div>
                    <div className="crm-mini-stat">
                        <div className="stat-value">{analyzedBids}</div>
                        <div className="stat-label">Przeanalizowanych</div>
                    </div>
                </div>

                {/* Paste Section */}
                <div style={{ marginBottom: '48px' }}>
                    <h2 style={{ marginBottom: '16px', fontSize: '1.3rem' }}>Dodaj nowe oferty z Useme</h2>
                    <textarea
                        value={pasteText}
                        onChange={(e) => setPasteText(e.target.value)}
                        placeholder={`Wklej oferty w formacie:
WiseB2B — UX/UI dla platformy B2B | 1 200 PLN / 14 dni
unclePiotr — UX/UI dla aplikacji e-commerce | 1 300 PLN / 21 dni`}
                        style={{
                            width: '100%',
                            height: '150px',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            color: 'white',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            marginBottom: '12px',
                            resize: 'vertical',
                        }}
                    />
                    <button
                        onClick={handleParse}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                        }}
                    >
                        🔍 Parsuj oferty
                    </button>
                </div>

                {/* Parser Preview */}
                {parsedBids.length > 0 && (
                    <div style={{ marginBottom: '48px', padding: '24px', backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.3)' }}>
                        <h2 style={{ marginBottom: '16px' }}>Podgląd ({parsedBids.length} ofert)</h2>
                        <div style={{ marginBottom: '24px' }}>
                            {parsedBids.map((bid, idx) => (
                                <div key={idx} style={{ padding: '12px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    <div style={{ marginBottom: '4px' }}>
                                        <strong>{bid.client}</strong> — {bid.description}
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.7)' }}>
                                        {bid.price.toLocaleString()} PLN / {bid.days} dni
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleSaveAll}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600',
                                marginRight: '8px',
                            }}
                        >
                            ✅ Zapisz wszystkie
                        </button>
                        <button
                            onClick={() => {
                                setPasteText('');
                                setParsedBids([]);
                            }}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                            }}
                        >
                            Anuluj
                        </button>
                    </div>
                )}

                {/* Bids Table */}
                <div>
                    <h2 style={{ marginBottom: '16px', fontSize: '1.3rem' }}>Historia ofert</h2>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.5)' }}>
                            Ładowanie...
                        </div>
                    ) : bids.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.5)' }}>
                            Brak ofert. Wklej oferty z Useme, aby zacząć śledzenie.
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <th style={{ textAlign: 'left', padding: '12px', color: 'rgba(255,255,255,0.7)' }}>Klient</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: 'rgba(255,255,255,0.7)' }}>Opis</th>
                                        <th style={{ textAlign: 'right', padding: '12px', color: 'rgba(255,255,255,0.7)' }}>Cena</th>
                                        <th style={{ textAlign: 'center', padding: '12px', color: 'rgba(255,255,255,0.7)' }}>Dni</th>
                                        <th style={{ textAlign: 'center', padding: '12px', color: 'rgba(255,255,255,0.7)' }}>Pokrycie</th>
                                        <th style={{ textAlign: 'center', padding: '12px', color: 'rgba(255,255,255,0.7)' }}>Status</th>
                                        <th style={{ textAlign: 'center', padding: '12px', color: 'rgba(255,255,255,0.7)' }}>Akcje</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bids.map(bid => (
                                        <tr key={bid.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '12px', fontWeight: '600' }}>{bid.client}</td>
                                            <td style={{ padding: '12px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>{bid.description}</td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>{bid.price.toLocaleString()} PLN</td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>{bid.days}</td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                {bid.coverageScore !== undefined ? (
                                                    <div style={{
                                                        display: 'inline-block',
                                                        padding: '4px 12px',
                                                        borderRadius: '12px',
                                                        backgroundColor: bid.coverageScore >= 80 ? '#10b981' : bid.coverageScore >= 50 ? '#f59e0b' : '#ef4444',
                                                        color: 'white',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '600'
                                                    }}>
                                                        {bid.coverageScore}%
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>—</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                <select
                                                    value={bid.status}
                                                    onChange={(e) => handleStatusChange(bid.id!, e.target.value as UsemeBid['status'])}
                                                    style={{
                                                        padding: '6px 8px',
                                                        borderRadius: '6px',
                                                        border: 'none',
                                                        backgroundColor: bid.status === 'Wygrana' ? '#10b981' : bid.status === 'Przegrana' ? '#ef4444' : bid.status === 'Brak odpowiedzi' ? '#6366f1' : '#f59e0b',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                    }}
                                                >
                                                    <option value="Wysłana">Wysłana</option>
                                                    <option value="Wygrana">Wygrana</option>
                                                    <option value="Przegrana">Przegrana</option>
                                                    <option value="Brak odpowiedzi">Brak odpowiedzi</option>
                                                </select>
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => openPanel(bid)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: 'rgba(59,130,246,0.2)',
                                                        color: '#3b82f6',
                                                        border: '1px solid #3b82f6',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                    }}
                                                >
                                                    📋
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(bid.id!)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: 'rgba(239,68,68,0.2)',
                                                        color: '#ef4444',
                                                        border: '1px solid #ef4444',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                    }}
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Side Panel */}
            {selectedBid && (
                <div style={{
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    height: '100vh',
                    width: '500px',
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderLeft: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 1000,
                    overflowY: 'auto',
                    animation: 'slideInRight 0.3s ease-out'
                }}>
                    <style>{`
                        @keyframes slideInRight {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                    `}</style>

                    <div style={{ padding: '24px' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>📋 {selectedBid.client}</h2>
                            <button
                                onClick={() => setSelectedBid(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: 'white'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Info */}
                        <div style={{
                            padding: '12px',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderRadius: '8px',
                            marginBottom: '24px',
                            fontSize: '0.9rem'
                        }}>
                            <div>💰 <strong>{selectedBid.price.toLocaleString()} PLN</strong> / {selectedBid.days} dni</div>
                            <div>📊 Status: <strong>{selectedBid.status}</strong></div>
                            <div>📄 {selectedBid.description}</div>
                        </div>

                        {/* Requirements */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                📋 Wymagania klienta
                            </label>
                            <textarea
                                value={requirementsText}
                                onChange={(e) => setRequirementsText(e.target.value)}
                                placeholder="Wklej opis projektu z Useme..."
                                style={{
                                    width: '100%',
                                    minHeight: '120px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    resize: 'vertical',
                                }}
                            />
                        </div>

                        {/* My Submission */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                ✍️ Moja propozycja
                            </label>
                            <textarea
                                value={submissionText}
                                onChange={(e) => setSubmissionText(e.target.value)}
                                placeholder="Wklej treść swojej wiadomości do klienta..."
                                style={{
                                    width: '100%',
                                    minHeight: '120px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    resize: 'vertical',
                                }}
                            />
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                            <button
                                onClick={analyzeCoverage}
                                disabled={analyzing}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    backgroundColor: analyzing ? '#6366f1' : '#8b5cf6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    opacity: analyzing ? 0.7 : 1,
                                }}
                            >
                                {analyzing ? '⏳ Analizuję...' : '🤖 Analizuj pokrycie AI'}
                            </button>
                            <button
                                onClick={savePanelData}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                }}
                            >
                                💾 Zapisz dane
                            </button>
                        </div>

                        {/* Coverage Result */}
                        {coverageResult && (
                            <div style={{
                                padding: '16px',
                                backgroundColor: 'rgba(139,92,246,0.1)',
                                borderRadius: '8px',
                                border: '1px solid rgba(139,92,246,0.3)',
                                marginBottom: '24px'
                            }}>
                                <h3 style={{ marginBottom: '12px' }}>Wynik analizy:</h3>

                                {/* Score Bar */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span>Pokrycie wymagań</span>
                                        <strong style={{
                                            color: coverageResult.score >= 80 ? '#10b981' : coverageResult.score >= 50 ? '#f59e0b' : '#ef4444'
                                        }}>
                                            {coverageResult.score}%
                                        </strong>
                                    </div>
                                    <div style={{
                                        height: '8px',
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        borderRadius: '4px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${coverageResult.score}%`,
                                            backgroundColor: coverageResult.score >= 80 ? '#10b981' : coverageResult.score >= 50 ? '#f59e0b' : '#ef4444',
                                            transition: 'width 0.3s'
                                        }} />
                                    </div>
                                </div>

                                {/* Covered */}
                                {coverageResult.covered?.length > 0 && (
                                    <div style={{ marginBottom: '12px' }}>
                                        <strong style={{ color: '#10b981' }}>✅ Pokryte:</strong>
                                        <ul style={{ margin: '8px 0 0 20px', paddingLeft: 0, fontSize: '0.9rem' }}>
                                            {coverageResult.covered.map((item: string, i: number) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Missing */}
                                {coverageResult.missing?.length > 0 && (
                                    <div style={{ marginBottom: '12px' }}>
                                        <strong style={{ color: '#f59e0b' }}>⚠️ Brakuje:</strong>
                                        <ul style={{ margin: '8px 0 0 20px', paddingLeft: 0, fontSize: '0.9rem' }}>
                                            {coverageResult.missing.map((item: string, i: number) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Summary */}
                                {coverageResult.summary && (
                                    <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                                        <strong>Podsumowanie:</strong> {coverageResult.summary}
                                    </div>
                                )}

                                <button
                                    onClick={saveCoverageResult}
                                    style={{
                                        width: '100%',
                                        marginTop: '16px',
                                        padding: '10px',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                    }}
                                >
                                    💾 Zapisz wynik analizy
                                </button>
                            </div>
                        )}

                        {/* Coverage Info */}
                        {selectedBid.coverageScore && (
                            <div style={{
                                padding: '12px',
                                backgroundColor: 'rgba(16,185,129,0.1)',
                                borderRadius: '8px',
                                border: '1px solid rgba(16,185,129,0.3)',
                                fontSize: '0.9rem'
                            }}>
                                <strong>Ostatnia analiza:</strong> {selectedBid.coverageScore}% pokrycia
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Overlay */}
            {selectedBid && (
                <div
                    onClick={() => setSelectedBid(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 999,
                    }}
                />
            )}
        </AdminLayout>
    );
}
