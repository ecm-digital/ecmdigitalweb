'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import {
    getClients, getOffers, getKanbanTasks, getMeetings, getCampaigns, seedCampaigns,
    getNotifications, Notification
} from '@/lib/firestoreService';

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
        { label: 'Aktywne Leady', value: stats.leads, icon: '🎯', color: '#3b82f6', sub: 'Oczekujące zapytania' },
        { label: 'Konwersja', value: `${stats.conversionRate.toFixed(1)}%`, icon: '📈', color: '#8b5cf6', sub: 'Leady -> Klienci' },
        { label: 'Przychód (Zatwierdzony)', value: `${stats.acceptedRevenue.toLocaleString('pl-PL')} PLN`, icon: '💰', color: '#10b981', sub: 'Faktury w drodze' },
        { label: 'Potencjał (Wysłane)', value: `${stats.potentialRevenue.toLocaleString('pl-PL')} PLN`, icon: '⏳', color: '#f59e0b', sub: 'Otwarte oferty' },
    ];

    const quickActions = [
        { label: 'Dodaj Klienta', icon: '👤', link: '/admin/clients', color: '#3b82f6' },
        { label: 'Nowa Oferta', icon: '💼', link: '/admin/offers', color: '#f59e0b' },
        { label: 'Ustawienia Agencji', icon: '⚙️', link: '/admin/settings', color: '#8b5cf6' },
        { label: 'Zadania Kanban', icon: '📋', link: '/admin/kanban', color: '#ef4444' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-10 animate-fade-in">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black font-space-grotesk tracking-tighter text-white uppercase italic">
                            🚀 Command <span className="text-brand-accent">Center</span>
                        </h1>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                            Przegląd operacyjny agencji • {new Date().toLocaleDateString('pl-PL')}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadStats}
                            className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                        >
                            🔄 Odśwież
                        </button>
                        <button
                            onClick={seedCampaigns}
                            className="px-6 py-2.5 rounded-xl bg-brand-accent text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            🌱 Dane testowe
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white/5 rounded-[32px] animate-pulse"></div>)}
                        </div>
                        <div className="h-[400px] bg-white/5 rounded-[40px] animate-pulse"></div>
                    </div>
                ) : (
                    <>
                        {/* KPI GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {kpis.map((kpi, i) => (
                                <div
                                    key={i}
                                    className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[32px] group hover:bg-white/[0.06] transition-all relative overflow-hidden shadow-2xl"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity" style={{ backgroundImage: `linear-gradient(to bottom right, ${kpi.color}, transparent)` }} />
                                    <div className="relative z-10">
                                        <div
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner"
                                            style={{ backgroundColor: kpi.color + '15', color: kpi.color }}
                                        >
                                            {kpi.icon}
                                        </div>
                                        <div className="text-3xl font-black font-space-grotesk tracking-tighter mb-1 text-white truncate">
                                            {kpi.value}
                                        </div>
                                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">
                                            {kpi.label}
                                        </div>
                                        <div className="text-[11px] font-bold text-white/50 leading-tight">
                                            {kpi.sub}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                            {/* ACTIVITY FEED */}
                            <div className="lg:col-span-2 bg-[#0a0a0f]/40 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] shadow-2xl overflow-hidden relative group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent" />
                                <div className="flex items-center justify-between mb-10 px-2">
                                    <div>
                                        <h3 className="text-xl font-black font-space-grotesk tracking-tight text-white uppercase italic">
                                            🔔 Ostatnia Aktywność
                                        </h3>
                                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-1">Strumień zdarzeń w czasie rzeczywistym</p>
                                    </div>
                                    <Link
                                        href="/admin/settings"
                                        className="text-[10px] font-black uppercase tracking-widest text-brand-accent hover:underline"
                                    >
                                        Powiadomienia →
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {activities.length === 0 ? (
                                        <div className="text-center py-20 bg-white/5 rounded-[32px] border border-white/5 border-dashed">
                                            <div className="text-4xl mb-4 opacity-10">📭</div>
                                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Brak nowych powiadomień</p>
                                        </div>
                                    ) : (
                                        activities.map((act) => (
                                            <div
                                                key={act.id}
                                                className="flex items-start gap-5 p-5 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] transition-all group/item"
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm shadow-inner shrink-0 transition-transform group-hover/item:scale-110"
                                                    style={{
                                                        background: act.type === 'lead' ? 'rgba(59,130,246,0.1)' : act.type === 'offer' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                                        color: act.type === 'lead' ? '#3b82f6' : act.type === 'offer' ? '#10b981' : '#f59e0b'
                                                    }}
                                                >
                                                    {act.type === 'lead' ? '👤' : act.type === 'offer' ? '📄' : '⚙️'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-4 mb-0.5">
                                                        <span className="text-sm font-black text-white/90 truncate">{act.title}</span>
                                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest shrink-0">
                                                            {act.createdAt.toDate().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-white/40 leading-relaxed truncate">{act.message}</p>
                                                </div>
                                                {act.link && (
                                                    <Link
                                                        href={act.link}
                                                        className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/20 hover:bg-brand-accent hover:text-white transition-all opacity-0 group-hover/item:opacity-100"
                                                    >
                                                        →
                                                    </Link>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* SIDEBAR ASSETS */}
                            <div className="space-y-8">
                                {/* QUICK ACTIONS */}
                                <div className="bg-[#0a0a0f]/40 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] shadow-2xl border-l-[3px] border-l-brand-accent/20">
                                    <h3 className="text-sm font-black font-space-grotesk tracking-widest text-white/30 uppercase mb-8 ml-1 italic">
                                        ⚡ Szybki Start
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {quickActions.map((action, i) => (
                                            <Link
                                                href={action.link}
                                                key={i}
                                                className="flex flex-col items-center justify-center p-6 bg-white/[0.03] border border-white/5 rounded-3xl hover:bg-white/[0.08] hover:border-white/15 transition-all group active:scale-[0.95]"
                                            >
                                                <span className="text-2xl mb-3 transition-transform group-hover:scale-125 group-hover:-rotate-6">{action.icon}</span>
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-white/40 group-hover:text-white transition-colors text-center">{action.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* AI PROMO */}
                                <div className="bg-gradient-to-br from-brand-accent/20 via-brand-accent/5 to-purple-600/20 backdrop-blur-2xl border border-brand-accent/20 p-8 rounded-[40px] relative overflow-hidden group shadow-2xl shadow-brand-accent/5">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 blur-[60px] -mr-16 -mt-16 rounded-full group-hover:bg-brand-accent/20 transition-all duration-1000" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-2xl bg-brand-accent flex items-center justify-center text-xl shadow-lg shadow-brand-accent/30 animate-bounce">💡</div>
                                            <h4 className="text-base font-black font-space-grotesk tracking-tight text-white uppercase italic">Wskazówka AI</h4>
                                        </div>
                                        <p className="text-[12px] text-white/60 font-bold leading-relaxed mb-8">
                                            W systemie znajduje się <span className="text-white font-black">{stats.potentialRevenue.toLocaleString()} PLN</span> w oczekujących ofertach.
                                            Zalecamy wysłanie przypomnień do 3 najbardziej aktywnych leadów.
                                        </p>
                                        <button className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl shadow-black/20 hover:bg-brand-accent hover:text-white transition-all transform active:scale-[0.98] text-[11px] uppercase tracking-widest border border-white/10">
                                            Wyślij Przypomnienia
                                        </button>
                                    </div>
                                    <div className="absolute -right-4 -bottom-4 text-8xl opacity-5 grayscale group-hover:grayscale-0 group-hover:opacity-10 group-hover:-rotate-6 transition-all duration-1000 pointer-events-none italic font-black font-space-grotesk tracking-tighter">AI</div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
