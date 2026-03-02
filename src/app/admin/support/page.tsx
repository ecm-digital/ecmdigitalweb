'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
    getSupportTickets,
    updateSupportTicket,
    deleteSupportTicket,
    SupportTicket,
    TicketStatus,
    TicketPriority
} from '@/lib/firestoreService';
import { useNotifications } from '@/context/NotificationContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminSupportPage() {
    const { T } = useLanguage();
    const { showToast } = useNotifications();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [sendingReply, setSendingReply] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getSupportTickets();
            setTickets(data);
        } catch (error) {
            console.error('Load tickets error:', error);
        }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    useEffect(() => {
        if (selectedTicket) {
            handleAnalyzeTicket(selectedTicket);
        } else {
            setAiAnalysis(null);
        }
    }, [selectedTicket?.id]);

    const handleAnalyzeTicket = async (ticket: SupportTicket) => {
        setAiAnalysis(null);
        setIsAnalyzing(true);
        try {
            const res = await fetch('/api/ai/analyze-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: ticket.subject,
                    message: ticket.message,
                    clientName: ticket.clientName
                })
            });
            const data = await res.json();
            setAiAnalysis(data.analysis);
        } catch (error) {
            console.error('AI analysis error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: TicketStatus) => {
        try {
            await updateSupportTicket(id, { status: newStatus });
            showToast(T('admin.support.toast.statusUpdated', { status: T(`admin.support.status.${newStatus}`) }), 'success');
            loadData();
            if (selectedTicket?.id === id) {
                setSelectedTicket({ ...selectedTicket, status: newStatus });
            }
        } catch (error) {
            showToast(T('admin.support.toast.updateError'), 'error');
        }
    };

    const handleSendReply = async () => {
        if (!selectedTicket || !replyText.trim()) return;
        setSendingReply(true);
        try {
            await updateSupportTicket(selectedTicket.id, {
                reply: replyText.trim(),
                repliedAt: new Date(),
                status: 'W trakcie' as TicketStatus,
            });
            setSelectedTicket({ ...selectedTicket, reply: replyText.trim(), status: 'W trakcie' as TicketStatus });
            setReplyText('');
            setShowReplyForm(false);
            showToast('Odpowiedź zapisana.', 'success');
            loadData();
        } catch {
            showToast('Błąd zapisu odpowiedzi.', 'error');
        } finally {
            setSendingReply(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(T('admin.support.toast.deleteConfirm'))) return;
        try {
            await deleteSupportTicket(id);
            showToast(T('admin.support.toast.deleted'), 'info');
            loadData();
            setSelectedTicket(null);
        } catch (error) {
            showToast(T('admin.support.toast.deleteError'), 'error');
        }
    };

    const statusColors: Record<TicketStatus, string> = {
        'Otwarty': '#3b82f6',
        'W trakcie': '#8b5cf6',
        'Oczekuje': '#f59e0b',
        'Zamknięty': '#10b981'
    };

    const priorityColors: Record<TicketPriority, string> = {
        'Niski': '#94a3b8',
        'Normalny': '#10b981',
        'Wysoki': '#f59e0b',
        'Krytyczny': '#ef4444'
    };

    return (
        <AdminLayout>
            <div className="crm-page">
                <div className="crm-header">
                    <div>
                        <h1>{T('admin.support.title')}</h1>
                        <p>{T('admin.support.subtitle')}</p>
                    </div>
                    <div className="crm-header-actions">
                        <button className="crm-btn-ghost" onClick={loadData}>🔄 {T('admin.support.refresh')}</button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
                    <div className="crm-card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table className="crm-table">
                            <thead>
                                <tr>
                                    <th>{T('admin.support.table.subject')}</th>
                                    <th>{T('admin.support.table.status')}</th>
                                    <th>{T('admin.support.table.priority')}</th>
                                    <th>{T('admin.support.table.sent')}</th>
                                    <th>{T('admin.crm.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>{T('admin.support.loading')}</td></tr>
                                ) : tickets.length === 0 ? (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>{T('admin.support.noTickets')}</td></tr>
                                ) : tickets.map((t) => (
                                    <tr
                                        key={t.id}
                                        onClick={() => setSelectedTicket(t)}
                                        style={{ cursor: 'pointer', background: selectedTicket?.id === t.id ? 'rgba(59,130,246,0.08)' : 'transparent' }}
                                    >
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{t.subject}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{t.clientName}</div>
                                        </td>
                                        <td>
                                            <span className="crm-badge" style={{ background: `${statusColors[t.status]}20`, color: statusColors[t.status] }}>
                                                {T(`admin.support.status.${t.status}`)}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: priorityColors[t.priority] }} />
                                                {T(`admin.support.priority.${t.priority}`)}
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                                            {t.createdAt?.toDate().toLocaleString(T('common.locale') === 'pl' ? 'pl-PL' : 'en-US')}
                                        </td>
                                        <td>
                                            <button className="crm-btn-icon crm-btn-danger" onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="crm-card" style={{ position: 'sticky', top: '100px' }}>
                        {selectedTicket ? (
                            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.4, marginBottom: '4px' }}>{T('admin.support.details.title')}</div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{selectedTicket.subject}</h3>
                                    <p style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.9rem', marginTop: '4px' }}>{selectedTicket.clientName}</p>
                                </div>

                                <div className="crm-form-group" style={{ marginBottom: '24px' }}>
                                    <label>{T('admin.support.details.changeStatus')}</label>
                                    <select
                                        value={selectedTicket.status}
                                        onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value as TicketStatus)}
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                                    >
                                        <option value="Otwarty">{T('admin.support.status.Otwarty')}</option>
                                        <option value="W trakcie">{T('admin.support.status.W trakcie')}</option>
                                        <option value="Oczekuje">{T('admin.support.status.Oczekuje')}</option>
                                        <option value="Zamknięty">{T('admin.support.status.Zamknięty')}</option>
                                    </select>
                                </div>

                                <div style={{
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '16px', padding: '20px', marginBottom: '24px'
                                }}>
                                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.4, marginBottom: '12px' }}>{T('admin.support.details.message')}</div>
                                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.8, whiteSpace: 'pre-wrap' }}>{selectedTicket.message}</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                                    {showReplyForm ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            <textarea
                                                value={replyText}
                                                onChange={e => setReplyText(e.target.value)}
                                                placeholder="Treść odpowiedzi..."
                                                rows={4}
                                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: 'white', fontSize: 14, resize: 'vertical', outline: 'none' }}
                                            />
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button className="crm-btn-primary" style={{ flex: 1 }} onClick={handleSendReply} disabled={sendingReply}>
                                                    {sendingReply ? 'Zapisuję...' : '💬 Wyślij odpowiedź'}
                                                </button>
                                                <button className="crm-btn-ghost" onClick={() => { setShowReplyForm(false); setReplyText(''); }}>Anuluj</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button className="crm-btn-primary" style={{ width: '100%' }} onClick={() => setShowReplyForm(true)}>
                                            💬 {T('admin.support.details.reply')}
                                        </button>
                                    )}
                                    {selectedTicket.reply && (
                                        <div style={{ padding: '12px 16px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: '#60a5fa', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ostatnia odpowiedź</div>
                                            {selectedTicket.reply}
                                        </div>
                                    )}
                                    <button className="crm-btn-ghost" style={{ width: '100%' }} onClick={() => setSelectedTicket(null)}>{T('admin.support.details.closePreview')}</button>
                                </div>

                                <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', marginBottom: '8px' }}>🤖 {T('admin.support.ai.title')}</div>
                                    <p style={{ fontSize: '0.75rem', opacity: 0.8, lineHeight: 1.4 }}>
                                        {isAnalyzing ? T('admin.support.ai.generating') : aiAnalysis || T('admin.support.ai.noSuggestions')}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.2)' }}>
                                <div style={{ fontSize: '40px', marginBottom: '16px' }}>🖱️</div>
                                <p>{T('admin.support.details.select')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .crm-badge {
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </AdminLayout>
    );
}
