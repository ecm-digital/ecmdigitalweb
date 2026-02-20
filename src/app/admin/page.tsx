'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import {
    getClients, getOffers, getKanbanTasks, getMeetings, getCampaigns, seedCampaigns,
    getNotifications, Notification
} from '@/lib/firestoreService';

const card = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: 32,
} as const;

const labelStyle = {
    fontSize: 13,
    fontWeight: 700 as const,
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
};

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalClients: 0,
        leads: 0,
        conversionRate: 0,
        offers: 0,
        acceptedRevenue: 0,
        potentialRevenue: 0,
        tasks: 0,
        meetings: 0,
        campaigns: 0
    });
    const [activities, setActivities] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        setLoading(true);
        try {
            const [clients, offers, tasks, meetings, campaigns, notifications] = await Promise.all([
                getClients(), getOffers(), getKanbanTasks(), getMeetings(), getCampaigns(), getNotifications(10)
            ]);

            const leads = clients.filter(c => c.status === 'Lead').length;
            const payingClients = clients.filter(c => c.status === 'Klient' || c.status === 'VIP').length;
            const conversionRate = clients.length > 0 ? (payingClients / clients.length) * 100 : 0;

            const acceptedRevenue = offers.filter(o => o.status === 'Zaakceptowana').reduce((s, o) => s + o.totalPrice, 0);
            const potentialRevenue = offers.filter(o => o.status === 'Wysłana' || o.status === 'Robocza').reduce((s, o) => s + o.totalPrice, 0);

            setStats({
                totalClients: clients.length,
                leads,
                conversionRate,
                offers: offers.length,
                acceptedRevenue,
                potentialRevenue,
                tasks: tasks.length,
                meetings: meetings.length,
                campaigns: campaigns.length
            });
            setActivities(notifications);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadStats(); }, []);

    const kpis = [
        { label: 'Aktywne Leady', value: stats.leads, icon: '🎯', accent: '#3b82f6', sub: 'Oczekujące zapytania' },
        { label: 'Konwersja', value: `${stats.conversionRate.toFixed(1)}%`, icon: '📈', accent: '#8b5cf6', sub: 'Leady → Klienci' },
        { label: 'Przychód', value: `${stats.acceptedRevenue.toLocaleString('pl-PL')} PLN`, icon: '💰', accent: '#10b981', sub: 'Zaakceptowane oferty' },
        { label: 'Potencjał', value: `${stats.potentialRevenue.toLocaleString('pl-PL')} PLN`, icon: '⏳', accent: '#f59e0b', sub: 'Otwarte oferty' },
    ];

    const quickActions = [
        { label: 'Dodaj Klienta', icon: '👤', link: '/admin/clients', accent: '#3b82f6' },
        { label: 'Nowa Oferta', icon: '💼', link: '/admin/offers', accent: '#f59e0b' },
        { label: 'Ustawienia', icon: '⚙️', link: '/admin/settings', accent: '#8b5cf6' },
        { label: 'Kanban', icon: '📋', link: '/admin/kanban', accent: '#ef4444' },
    ];

    const getActivityColor = (type: string) => {
        if (type === 'lead') return { bg: 'rgba(59,130,246,0.1)', fg: '#3b82f6', icon: '👤' };
        if (type === 'offer') return { bg: 'rgba(16,185,129,0.1)', fg: '#10b981', icon: '📄' };
        return { bg: 'rgba(245,158,11,0.1)', fg: '#f59e0b', icon: '⚙️' };
    };

    return (
        <AdminLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

                {/* ═══ Page Header ═══ */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>
                            🚀 Command <span style={{ color: '#3b82f6' }}>Center</span>
                        </h1>
                        <p style={{ ...labelStyle, marginTop: 8 }}>
                            Przegląd operacyjny agencji • {new Date().toLocaleDateString('pl-PL')}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            onClick={loadStats}
                            style={{
                                padding: '10px 22px', borderRadius: 12,
                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                            }}
                        >
                            🔄 Odśwież
                        </button>
                        <button
                            onClick={seedCampaigns}
                            style={{
                                padding: '10px 22px', borderRadius: 12,
                                background: '#3b82f6', border: 'none',
                                color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                                boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
                            }}
                        >
                            🌱 Dane testowe
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{ ...card, height: 180, opacity: 0.4 }} />
                            ))}
                        </div>
                        <div style={{ ...card, height: 400, opacity: 0.3 }} />
                    </div>
                ) : (
                    <>
                        {/* ═══ KPI Grid ═══ */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                            {kpis.map((kpi, i) => (
                                <div key={i} style={{ ...card, position: 'relative', overflow: 'hidden' }}>
                                    <div style={{
                                        position: 'absolute', top: -20, right: -20,
                                        width: 80, height: 80, borderRadius: '50%',
                                        background: kpi.accent, opacity: 0.08, filter: 'blur(25px)',
                                    }} />
                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <div style={{
                                            width: 48, height: 48, borderRadius: 14,
                                            background: `${kpi.accent}18`, border: `1px solid ${kpi.accent}30`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 24, marginBottom: 20,
                                        }}>
                                            {kpi.icon}
                                        </div>
                                        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6, color: 'white' }}>
                                            {kpi.value}
                                        </div>
                                        <div style={{ ...labelStyle, marginBottom: 8 }}>{kpi.label}</div>
                                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{kpi.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ═══ Content Grid ═══ */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>

                            {/* ─── Activity Feed ─── */}
                            <div style={{ ...card, padding: 32 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                    <div>
                                        <h3 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>🔔 Ostatnia Aktywność</h3>
                                        <p style={{ ...labelStyle, marginTop: 6 }}>Strumień zdarzeń w czasie rzeczywistym</p>
                                    </div>
                                    <Link href="/admin/settings" style={{ fontSize: 14, fontWeight: 700, color: '#3b82f6', textDecoration: 'none' }}>
                                        Powiadomienia →
                                    </Link>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {activities.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px dashed rgba(255,255,255,0.1)' }}>
                                            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.2 }}>📭</div>
                                            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Brak nowych powiadomień</p>
                                        </div>
                                    ) : (
                                        activities.map((act) => {
                                            const c = getActivityColor(act.type);
                                            return (
                                                <div key={act.id} style={{
                                                    display: 'flex', alignItems: 'flex-start', gap: 16,
                                                    padding: '16px 18px', borderRadius: 18,
                                                    background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
                                                }}>
                                                    <div style={{
                                                        width: 42, height: 42, borderRadius: 14,
                                                        background: c.bg, display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        fontSize: 18, flexShrink: 0,
                                                    }}>
                                                        {c.icon}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                            <span style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{act.title}</span>
                                                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                                                                {act.createdAt.toDate().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.message}</p>
                                                    </div>
                                                    {act.link && (
                                                        <Link href={act.link} style={{
                                                            width: 36, height: 36, borderRadius: 12,
                                                            background: 'rgba(255,255,255,0.06)', display: 'flex',
                                                            alignItems: 'center', justifyContent: 'center',
                                                            color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
                                                            fontSize: 16, flexShrink: 0,
                                                        }}>
                                                            →
                                                        </Link>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* ─── Right Sidebar ─── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                                {/* Quick Actions */}
                                <div style={{ ...card }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 20px', color: 'rgba(255,255,255,0.6)' }}>⚡ Szybki Start</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                        {quickActions.map((action, i) => (
                                            <Link
                                                href={action.link}
                                                key={i}
                                                style={{
                                                    display: 'flex', flexDirection: 'column',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    padding: '24px 16px', borderRadius: 18,
                                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                                                    textDecoration: 'none', color: 'rgba(255,255,255,0.6)',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                <span style={{ fontSize: 28, marginBottom: 10 }}>{action.icon}</span>
                                                <span style={{ fontSize: 13, fontWeight: 700, textAlign: 'center' }}>{action.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Tip */}
                                <div style={{
                                    ...card,
                                    background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
                                    border: '1px solid rgba(59,130,246,0.2)',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: 14,
                                            background: '#3b82f6', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            fontSize: 20, boxShadow: '0 4px 15px rgba(59,130,246,0.3)',
                                        }}>💡</div>
                                        <h4 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Wskazówka AI</h4>
                                    </div>
                                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: '0 0 24px' }}>
                                        W systemie znajduje się <span style={{ color: 'white', fontWeight: 800 }}>{stats.potentialRevenue.toLocaleString()} PLN</span> w oczekujących ofertach.
                                        Zalecamy wysłanie przypomnień do najbardziej aktywnych leadów.
                                    </p>
                                    <button style={{
                                        width: '100%', padding: '14px 0',
                                        background: 'white', color: '#070710',
                                        fontWeight: 800, fontSize: 14, borderRadius: 16,
                                        border: 'none', cursor: 'pointer',
                                        boxShadow: '0 4px 20px rgba(255,255,255,0.15)',
                                    }}>
                                        Wyślij Przypomnienia
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
