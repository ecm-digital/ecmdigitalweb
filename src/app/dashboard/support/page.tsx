'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import {
    getUserSupportTickets,
    addSupportTicket,
    SupportTicket,
    TicketStatus,
    TicketPriority
} from '@/lib/firestoreService';
import { useNotifications } from '@/context/NotificationContext';
import { useLanguage } from '@/context/LanguageContext';

export default function SupportPage() {
    const { user } = useAuth();
    const { showToast } = useNotifications();
    const { T } = useLanguage();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewTicketModal, setShowNewTicketModal] = useState(false);

    const [newTicket, setNewTicket] = useState({
        subject: '',
        message: '',
        priority: 'Normalny' as TicketPriority
    });

    const loadTickets = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getUserSupportTickets(user.uid);
            setTickets(data);
        } catch (error) {
            console.error('Load tickets error:', error);
        }
        setLoading(false);
    };

    useEffect(() => { loadTickets(); }, [user]);

    const handleSubmitTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!newTicket.subject || !newTicket.message) {
            showToast(T('dash.fillRequired'), 'warning');
            return;
        }

        try {
            await addSupportTicket({
                userId: user.uid,
                clientName: user.displayName || user.email || 'Klient',
                subject: newTicket.subject,
                message: newTicket.message,
                priority: newTicket.priority,
                status: 'Otwarty'
            });
            showToast(T('dash.ticketSent'), 'success');
            setShowNewTicketModal(false);
            setNewTicket({ subject: '', message: '', priority: 'Normalny' });
            loadTickets();
        } catch (error) {
            console.error('Add ticket error:', error);
            showToast(T('dash.ticketError'), 'error');
        }
    };

    const statusColors: Record<TicketStatus, string> = {
        'Otwarty': '#3b82f6',
        'W trakcie': '#8b5cf6',
        'Oczekuje': '#f59e0b',
        'Zamknięty': '#10b981'
    };

    const priorityColors: Record<TicketPriority, string> = {
        'Niski': 'rgba(255,255,255,0.3)',
        'Normalny': '#10b981',
        'Wysoki': '#f59e0b',
        'Krytyczny': '#ef4444'
    };

    return (
        <DashboardLayout>
            <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                    <div>
                        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>{T('dash.supportTitle')}</h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>{T('dash.supportDesc')}</p>
                    </div>
                    <button
                        onClick={() => setShowNewTicketModal(true)}
                        style={{
                            padding: '16px 28px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            color: 'white', borderRadius: 16, border: 'none', fontWeight: 700,
                            cursor: 'pointer', boxShadow: '0 8px 20px rgba(37,99,235,0.25)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        {T('dash.newTicket')}
                    </button>
                </div>

                {/* Maintenance Banner */}
                <div style={{
                    background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)',
                    borderRadius: 24, padding: '32px', marginBottom: 40, display: 'flex', alignItems: 'center', gap: 24
                }}>
                    <div style={{ fontSize: 40 }}>🛡️</div>
                    <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{T('dash.carePlan')}: <span style={{ color: '#10b981' }}>{T('dash.carePlanActive')}</span></h3>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{T('dash.carePlanDesc')}</p>
                    </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 28, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
                                <th style={{ padding: '20px 24px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>{T('dash.subject')}</th>
                                <th style={{ padding: '20px 24px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>Status</th>
                                <th style={{ padding: '20px 24px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>{T('dash.priority')}</th>
                                <th style={{ padding: '20px 24px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>{T('dash.date')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>{T('dash.loadingTickets')}</td>
                                </tr>
                            ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ padding: 60, textAlign: 'center' }}>
                                        <div style={{ fontSize: 48, marginBottom: 16 }}>🎫</div>
                                        <p style={{ color: 'rgba(255,255,255,0.4)' }}>{T('dash.noTickets')}</p>
                                    </td>
                                </tr>
                            ) : tickets.map((t) => (
                                <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{t.subject}</div>
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.message}</div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <span style={{
                                            padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                                            background: `${statusColors[t.status as keyof typeof statusColors]}15`, color: statusColors[t.status as keyof typeof statusColors], border: `1px solid ${statusColors[t.status as keyof typeof statusColors]}30`
                                        }}>
                                            {T(`status.${t.status}`)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: priorityColors[t.priority as keyof typeof priorityColors] }} />
                                            {T(`status.${t.priority}`)}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px', color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
                                        {t.createdAt?.toDate().toLocaleDateString('pl-PL')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* FAQ / AI Suggestions Section */}
                <div style={{ marginTop: 60 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                        {T('dash.faq')}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                        {[
                            { q: T('dash.faqQ1'), a: T('dash.faqA1') },
                            { q: T('dash.faqQ2'), a: T('dash.faqA2') },
                            { q: T('dash.faqQ3'), a: T('dash.faqA3') }
                        ].map((faq, i) => (
                            <div key={i} style={{ padding: 24, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20 }}>
                                <div style={{ fontWeight: 700, marginBottom: 8, color: '#3b82f6' }}>{faq.q}</div>
                                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* New Ticket Modal */}
            {showNewTicketModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', padding: 20
                }} onClick={() => setShowNewTicketModal(false)}>
                    <div
                        style={{
                            width: '100%', maxWidth: 640, background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 32, padding: 40, position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                            animation: 'modalOpen 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>{T('dash.newTicketTitle')}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32 }}>{T('dash.newTicketDesc')}</p>

                        <form onSubmit={handleSubmitTicket}>
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>{T('dash.ticketSubject')}</label>
                                <input
                                    type="text"
                                    value={newTicket.subject}
                                    onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })}
                                    placeholder="Np. Awaria formularza kontaktowego"
                                    style={{ width: '100%', padding: '16px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                                />
                            </div>

                            <div style={{ marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>{T('dash.priority')}</label>
                                    <select
                                        value={newTicket.priority}
                                        onChange={e => setNewTicket({ ...newTicket, priority: e.target.value as TicketPriority })}
                                        style={{ width: '100%', padding: '16px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', appearance: 'none' }}
                                    >
                                        <option value="Niski">Niski (Drobne zmiany)</option>
                                        <option value="Normalny">Normalny (Problemy w działaniu)</option>
                                        <option value="Wysoki">Wysoki (Błędy uniemożliwiające pracę)</option>
                                        <option value="Krytyczny">Krytyczny (Awaria systemu / Offline)</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginBottom: 32 }}>
                                <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>{T('dash.detailedDesc')}</label>
                                <textarea
                                    rows={5}
                                    value={newTicket.message}
                                    onChange={e => setNewTicket({ ...newTicket, message: e.target.value })}
                                    placeholder="Napisz co dokładnie się dzieje, na jakim urządzeniu, jakie są objawy..."
                                    style={{ width: '100%', padding: '16px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', resize: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 16 }}>
                                <button
                                    type="button"
                                    onClick={() => setShowNewTicketModal(false)}
                                    style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: 16, border: 'none', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    {T('dash.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    style={{ flex: 1, padding: '16px', background: '#3b82f6', color: 'white', borderRadius: 16, border: 'none', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 20px rgba(59,130,246,0.3)' }}
                                >
                                    {T('dash.sendTicket')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes modalOpen { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </DashboardLayout>
    );
}
