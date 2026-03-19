'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { UsemeBid, getUsemeBids, addUsemeBid, updateUsemeBid, deleteUsemeBid } from '@/lib/firestoreService';
import { useNotifications } from '@/context/NotificationContext';
import { Timestamp } from 'firebase/firestore';

export default function UsemeBidsPage() {
    const { showToast } = useNotifications();
    const [bids, setBids] = useState<UsemeBid[]>([]);
    const [loading, setLoading] = useState(true);
    const [pasteText, setPasteText] = useState('');
    const [parsedBids, setParsedBids] = useState<Omit<UsemeBid, 'id'>[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<UsemeBid>>({});

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
        // More flexible regex: Client — Description | Price PLN / Days dni
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

    // Stats
    const totalBids = bids.length;
    const totalValue = bids.reduce((sum, bid) => sum + bid.price, 0);
    const wonBids = bids.filter(b => b.status === 'Wygrana').length;
    const successRate = totalBids > 0 ? Math.round((wonBids / totalBids) * 100) : 0;

    return (
        <AdminLayout>
            <div className="crm-page">
                {/* Header */}
                <div className="crm-header">
                    <h1 className="crm-title">📤 Useme Bids Tracker</h1>
                    <p className="crm-subtitle">Śledź oferty wysłane na platformie Useme</p>
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
                        <div className="stat-value">{successRate}%</div>
                        <div className="stat-label">Skuteczność</div>
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
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <th style={{ textAlign: 'left', padding: '12px', color: 'rgba(255,255,255,0.7)' }}>Klient</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: 'rgba(255,255,255,0.7)' }}>Opis</th>
                                        <th style={{ textAlign: 'right', padding: '12px', color: 'rgba(255,255,255,0.7)' }}>Cena</th>
                                        <th style={{ textAlign: 'center', padding: '12px', color: 'rgba(255,255,255,0.7)' }}>Dni</th>
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
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
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
                                                    Usuń
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
        </AdminLayout>
    );
}
