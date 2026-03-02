'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Campaign, getUserCampaigns } from '@/lib/firestoreService';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const statusColors = {
    Planowana: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Aktywna: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Wstrzymana: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    Zakończona: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export default function ClientCampaignsPage() {
    const { user } = useAuth();
    const { T } = useLanguage();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getUserCampaigns(user.uid);
            setCampaigns(data);
        } catch (error) {
            console.error("Load campaigns error:", error);
        }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, [user]);

    const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
    const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
    const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

    return (
        <DashboardLayout>
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black font-space-grotesk tracking-tighter uppercase italic text-white flex items-center gap-3">
                            🚀 {T('dash.yourCampaigns')}
                        </h2>
                        <p className="text-sm text-white/30 font-black uppercase tracking-[0.2em] mt-2">{T('dash.monitorCampaigns')}</p>
                    </div>
                </div>

                {/* Dashboard stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[40px] p-10 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-all duration-1000"></div>
                        <span className="text-xs text-white/20 uppercase tracking-[0.2em] font-black block mb-6 italic">{T('dash.activeBudget')}</span>
                        <div className="text-4xl font-black font-space-grotesk tracking-tighter italic text-white">{totalBudget.toLocaleString('pl-PL')} <span className="text-base opacity-20 non-italic">PLN</span></div>
                        <div className="mt-6 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse shadow-[0_0_10px_#8b5cf6]"></div>
                            <span className="text-xs text-white/30 font-black uppercase tracking-widest">{T('dash.accumulatedCapital')}</span>
                        </div>
                    </div>
                    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[40px] p-10 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-all duration-1000"></div>
                        <span className="text-xs text-white/20 uppercase tracking-[0.2em] font-black block mb-6 italic">{T('dash.realSpending')}</span>
                        <div className="text-4xl font-black font-space-grotesk tracking-tighter italic text-brand-accent">{totalSpent.toLocaleString('pl-PL')} <span className="text-base opacity-20 non-italic text-white">PLN</span></div>
                        <div className="mt-6 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-xs text-white/30 font-black uppercase tracking-widest">{T('dash.netMediaCosts')}</span>
                        </div>
                    </div>
                    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[40px] p-10 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-all duration-1000"></div>
                        <span className="text-xs text-white/20 uppercase tracking-[0.2em] font-black block mb-6 italic">{T('dash.conversionsResult')}</span>
                        <div className="text-4xl font-black font-space-grotesk tracking-tighter italic text-emerald-400">{totalConversions.toLocaleString()}</div>
                        <div className="mt-6 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                            <span className="text-xs text-white/30 font-black uppercase tracking-widest">{T('dash.leadsActions')}</span>
                        </div>
                    </div>
                </div>

                {/* Campaign Cards */}
                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {[1, 2].map(i => <div key={i} className="bg-white/5 h-[400px] rounded-[48px] animate-pulse border border-white/5"></div>)}
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="py-32 bg-white/[0.04] backdrop-blur-xl border border-white/10 border-dashed rounded-[48px] text-center group">
                        <div className="text-7xl mb-10 grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000">📢</div>
                        <h3 className="text-2xl font-black font-space-grotesk italic uppercase tracking-tighter mb-2">{T('dash.noCampaigns')}</h3>
                        <p className="text-white/30 text-base max-w-md mx-auto px-6 font-medium">{T('dash.noCampaignsDesc')}</p>
                        <button className="mt-12 px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-brand-accent transition-all">
                            {T('dash.askAdsStrategy')}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-12">
                        {campaigns.map(c => {
                            const budgetPct = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0;
                            return (
                                <div key={c.id} className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[48px] p-10 flex flex-col hover:bg-white/[0.05] transition-all group relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 blur-[100px] -mr-32 -mt-32 rounded-full transition-all duration-1000 group-hover:bg-brand-accent/10"></div>

                                    <div className="flex justify-between items-start mb-10 relative z-10">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="text-xs font-black text-brand-accent uppercase tracking-[0.2em] mb-3">{c.platform}</div>
                                            <h3 className="text-2xl font-black font-space-grotesk tracking-tighter uppercase italic leading-tight group-hover:text-brand-accent transition-colors truncate">{c.name}</h3>
                                        </div>
                                        <span className={`text-xs px-3 py-1.5 rounded-full font-black uppercase tracking-widest border transition-colors ${statusColors[c.status as keyof typeof statusColors] || ''}`}>
                                            {T(`status.${c.status}`)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6 p-8 bg-black/40 rounded-[32px] border border-white/5 mb-10 relative z-10 shadow-inner">
                                        <div className="text-center">
                                            <div className="text-2xl font-black font-space-grotesk italic text-white">{c.clicks.toLocaleString()}</div>
                                            <div className="text-xs text-white/20 font-black uppercase tracking-widest mt-2 px-1">{T('dash.clicks')}</div>
                                        </div>
                                        <div className="text-center border-x border-white/5">
                                            <div className="text-2xl font-black font-space-grotesk italic text-emerald-400">{c.conversions}</div>
                                            <div className="text-xs text-white/20 font-black uppercase tracking-widest mt-2 px-1">{T('dash.conversions')}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-black font-space-grotesk italic text-brand-accent">{c.cpa.toLocaleString('pl-PL')} <span className="text-sm non-italic opacity-40">PLN</span></div>
                                            <div className="text-xs text-white/20 font-black uppercase tracking-widest mt-2 px-1">{T('dash.cpaCost')}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-10 relative z-10">
                                        <div className="flex justify-between items-end text-sm font-black uppercase tracking-widest italic">
                                            <span className="text-white/30">{T('dash.budgetUsage')}</span>
                                            <span className={budgetPct > 90 ? 'text-red-400 animate-pulse' : 'text-white/60'}>{budgetPct}%</span>
                                        </div>
                                        <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                            <div className="h-full rounded-full transition-all duration-1000 relative shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                                                style={{
                                                    width: `${Math.min(budgetPct, 100)}%`,
                                                    background: budgetPct > 95 ? 'linear-gradient(90deg, #ef4444, #f87171)' : 'var(--gradient-accent)'
                                                }}>
                                                <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-xs font-black uppercase tracking-[0.1em] text-white/20">
                                            <span>{T('dash.spent')}: {c.spent.toLocaleString()} PLN</span>
                                            <span>{T('dash.limit')}: {c.budget.toLocaleString()} PLN</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5 relative z-10">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-white/20 font-black uppercase tracking-widest italic">{T('dash.actionPeriod')}</span>
                                            <span className="text-sm font-bold text-white/40 mt-1 uppercase tracking-tight">{c.startDate} · {c.endDate}</span>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl grayscale opacity-40">
                                            {c.platform.includes('Google') ? '🔍' : c.platform.includes('Meta') ? 'Ⓜ️' : '📢'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Performance Insight */}
                <div className="p-10 bg-gradient-to-br from-brand-accent/30 via-purple-600/30 to-blue-600/30 border border-white/20 rounded-[48px] backdrop-blur-3xl relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] -mr-32 -mt-32 rounded-full group-hover:scale-150 transition-all duration-1000"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="text-7xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000">📈</div>
                        <div>
                            <h4 className="text-xl font-black font-space-grotesk uppercase italic mb-3 tracking-tighter">{T('dash.scalability')}</h4>
                            <p className="text-base text-white/80 leading-relaxed font-medium max-w-2xl">
                                {T('dash.scalabilityDesc')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
