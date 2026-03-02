'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getAIOSLogs, AIOSLogEntry } from '@/lib/firestoreService';

const sourceConfig: Record<string, { icon: string; label: string; color: string }> = {
    'chatbot': { icon: '💬', label: 'Chatbot publiczny', color: '#3b82f6' },
    'admin-assistant': { icon: '🤖', label: 'Admin AI', color: '#8b5cf6' },
    'offer-intelligence': { icon: '💼', label: 'Offer Intelligence', color: '#f59e0b' },
    'meeting-intelligence': { icon: '🗣️', label: 'Meeting AI', color: '#ec4899' },
    'daily-brief': { icon: '⚡', label: 'Daily Brief', color: '#10b981' },
    'system': { icon: '⚙️', label: 'System', color: '#6b7280' },
};

export default function AIOSLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [hours, setHours] = useState(24);
    const [filterSource, setFilterSource] = useState<string>('all');
    const [filterRole, setFilterRole] = useState<string>('all');

    const loadLogs = async () => {
        setLoading(true);
        try {
            const data = await getAIOSLogs(hours, 200);
            setLogs(data);
        } catch (e) {
            console.error('Error loading logs:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadLogs(); }, [hours]);

    const filtered = logs.filter(l => {
        if (filterSource !== 'all' && l.source !== filterSource) return false;
        if (filterRole !== 'all' && l.role !== filterRole) return false;
        return true;
    });

    const sourceCounts = logs.reduce<Record<string, number>>((acc, l) => {
        acc[l.source] = (acc[l.source] || 0) + 1;
        return acc;
    }, {});

    const userMsgs = logs.filter(l => l.role === 'user').length;
    const botMsgs = logs.filter(l => l.role === 'bot').length;
    const uniqueSessions = new Set(logs.filter(l => l.sessionId).map(l => l.sessionId)).size;
    const languages = logs.reduce<Record<string, number>>((acc, l) => {
        if (l.lang) acc[l.lang] = (acc[l.lang] || 0) + 1;
        return acc;
    }, {});

    const formatTime = (ts: any) => {
        if (!ts?.toDate) return '—';
        const d = ts.toDate();
        return d.toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <AdminLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1100 }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                            📊 AIOS <span style={{ color: '#8b5cf6' }}>Activity Logs</span>
                        </h1>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>
                            Wszystkie interakcje AI w jednym miejscu • Chatbot + Admin + Offer + Meeting Intelligence
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[6, 12, 24, 48, 168].map(h => (
                            <button key={h} onClick={() => setHours(h)} style={{
                                padding: '8px 14px', borderRadius: 10,
                                background: hours === h ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                                border: hours === h ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.08)',
                                color: hours === h ? '#a78bfa' : 'rgba(255,255,255,0.5)',
                                fontWeight: 700, fontSize: 12, cursor: 'pointer',
                            }}>
                                {h < 24 ? `${h}h` : `${h / 24}d`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                    {[
                        { label: 'Łącznie logów', value: logs.length, icon: '📊', color: '#8b5cf6' },
                        { label: 'Od użytkowników', value: userMsgs, icon: '👤', color: '#3b82f6' },
                        { label: 'Odpowiedzi AI', value: botMsgs, icon: '🤖', color: '#10b981' },
                        { label: 'Unikalne sesje', value: uniqueSessions, icon: '🔗', color: '#f59e0b' },
                        { label: 'Języki', value: Object.entries(languages).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join(', ') || '—', icon: '🌍', color: '#ec4899' },
                    ].map((s, i) => (
                        <div key={i} style={{
                            padding: '16px 20px', borderRadius: 16,
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                                {s.icon} {s.label}
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>
                                {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Source Filter */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => setFilterSource('all')} style={{
                        padding: '6px 14px', borderRadius: 10,
                        background: filterSource === 'all' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)',
                        fontWeight: 600, fontSize: 12, cursor: 'pointer',
                    }}>
                        Wszystkie ({logs.length})
                    </button>
                    {Object.entries(sourceConfig).map(([key, cfg]) => (
                        <button key={key} onClick={() => setFilterSource(filterSource === key ? 'all' : key)} style={{
                            padding: '6px 14px', borderRadius: 10,
                            background: filterSource === key ? `${cfg.color}15` : 'rgba(255,255,255,0.03)',
                            border: filterSource === key ? `1px solid ${cfg.color}40` : '1px solid rgba(255,255,255,0.06)',
                            color: filterSource === key ? cfg.color : 'rgba(255,255,255,0.5)',
                            fontWeight: 600, fontSize: 12, cursor: 'pointer',
                        }}>
                            {cfg.icon} {cfg.label} ({sourceCounts[key] || 0})
                        </button>
                    ))}
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                        {['all', 'user', 'bot'].map(r => (
                            <button key={r} onClick={() => setFilterRole(filterRole === r ? 'all' : r)} style={{
                                padding: '6px 12px', borderRadius: 8,
                                background: filterRole === r ? 'rgba(255,255,255,0.08)' : 'transparent',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 11, cursor: 'pointer',
                            }}>
                                {r === 'all' ? '👥 Wszyscy' : r === 'user' ? '👤 User' : '🤖 Bot'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Logs Table */}
                <div style={{
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 20, overflow: 'hidden',
                }}>
                    {loading ? (
                        <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                            ⏳ Ładuję logi...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                            📭 Brak logów w wybranym okresie
                        </div>
                    ) : (
                        <div style={{ maxHeight: 600, overflowY: 'auto' }}>
                            {filtered.map((log, i) => {
                                const src = sourceConfig[log.source] || sourceConfig.system;
                                return (
                                    <div key={log.id || i} style={{
                                        display: 'grid',
                                        gridTemplateColumns: '140px 150px 60px 1fr',
                                        gap: 12, padding: '12px 20px',
                                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                                        alignItems: 'center',
                                        transition: 'background 0.2s',
                                    }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        {/* Time */}
                                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>
                                            {formatTime(log.createdAt)}
                                        </span>

                                        {/* Source */}
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                            padding: '3px 10px', borderRadius: 8,
                                            background: `${src.color}10`, border: `1px solid ${src.color}25`,
                                            fontSize: 11, fontWeight: 700, color: src.color,
                                        }}>
                                            {src.icon} {src.label}
                                        </span>

                                        {/* Role */}
                                        <span style={{
                                            fontSize: 11, fontWeight: 700,
                                            color: log.role === 'user' ? '#3b82f6' : log.role === 'bot' ? '#10b981' : '#6b7280',
                                        }}>
                                            {log.role === 'user' ? '👤' : '🤖'} {log.role}
                                        </span>

                                        {/* Text */}
                                        <span style={{
                                            fontSize: 13, color: 'rgba(255,255,255,0.7)',
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                        }}>
                                            {log.text?.slice(0, 200) || '—'}
                                            {log.lang && log.lang !== 'pl' && (
                                                <span style={{
                                                    marginLeft: 8, padding: '1px 6px', borderRadius: 4,
                                                    background: 'rgba(255,255,255,0.06)',
                                                    fontSize: 10, color: 'rgba(255,255,255,0.4)',
                                                }}>
                                                    {log.lang.toUpperCase()}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer info */}
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '8px 0' }}>
                    AIOS Activity Log • Kolekcja: <code style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4 }}>ai_chat_logs</code> •
                    Pokazano {filtered.length} z {logs.length} logów z ostatnich {hours < 24 ? `${hours}h` : `${hours / 24} dni`}
                </div>
            </div>
        </AdminLayout>
    );
}
