'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useNotifications } from '@/context/NotificationContext';
import { Calendar, Zap, Layout, Clock, CheckCircle, ChevronRight, Brain, Filter, Download } from 'lucide-react';

interface PlanItem {
    day: string;
    platform: string;
    title: string;
    description: string;
    angle: string;
    status: string;
}

interface PlannerData {
    plan: PlanItem[];
    strategicAdvice: string;
}

export default function ContentPlannerPage() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<PlannerData | null>(null);
    const { showToast } = useNotifications();

    const generatePlan = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/ai/content-planner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trendingUrls: [] }) // Można tu dodać mocki lub fetch z PostHog
            });
            if (!res.ok) throw new Error('Błąd generowania');
            const result = await res.json();
            setData(result);
            showToast('Plan wygenerowany!', 'success');
        } catch (e) {
            showToast('Błąd: ' + (e as Error).message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generatePlan();
    }, []);

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-brand-accent mb-2">
                            <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                                <Calendar size={16} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Autonomic Content Planner</span>
                        </div>
                        <h1 className="text-4xl font-black font-space-grotesk uppercase italic tracking-tighter">
                            Content <span className="text-brand-accent">OS 2026</span>
                        </h1>
                        <p className="text-gray-500 max-w-lg text-sm font-medium leading-relaxed">
                            Twój agent autonomiczny zaplanował Twoją obecność w sieci na najbliższe 7 dni, łącząc analizę ruchu z DNA marki.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={generatePlan} disabled={loading} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                            <Zap size={14} className={loading ? 'animate-pulse' : ''} />
                            <span>{loading ? 'Re-Planowanie...' : 'Generuj nowy plan'}</span>
                        </button>
                    </div>
                </div>

                {data && (
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-in fade-in duration-1000">
                        {/* Sidebar Advice */}
                        <div className="xl:col-span-1 space-y-6">
                            <div className="bg-brand-accent/[0.03] border border-brand-accent/20 rounded-[40px] p-8 space-y-6 relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 text-brand-accent/5 group-hover:scale-110 transition-transform duration-700">
                                    <Brain size={180} strokeWidth={1} />
                                </div>
                                <h4 className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic flex items-center gap-2">
                                    <Zap size={12} fill="currentColor" />
                                    Tygodniowy Insight
                                </h4>
                                <p className="text-sm text-gray-400 font-medium leading-loose relative z-10 italic">
                                    "{data.strategicAdvice}"
                                </p>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 space-y-6">
                                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Twoje KPI na ten tydzień</h4>
                                <div className="space-y-4">
                                    {[
                                        { l: 'Engagement Rate', v: '+12.4%', c: 'text-green-500' },
                                        { l: 'Lead Discovery', v: '8 Nowych', c: 'text-blue-500' },
                                        { l: 'Brand Authority', v: 'High', c: 'text-brand-accent' }
                                    ].map((s, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                                            <span className="text-[10px] font-bold text-gray-500">{s.l}</span>
                                            <span className={`text-[11px] font-black ${s.c}`}>{s.v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Timeline */}
                        <div className="xl:col-span-3 space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                {data.plan.map((item, i) => (
                                    <div key={i} className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-[32px] p-8 transition-all duration-500 flex flex-col md:flex-row gap-8 items-start md:items-center">
                                        <div className="w-32 flex-shrink-0">
                                            <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest block mb-1">{item.day}</span>
                                            <div className="flex items-center gap-2 text-white/40 group-hover:text-white transition-colors">
                                                <Clock size={12} />
                                                <span className="text-[10px] font-bold">10:00 AM</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-white/50 uppercase tracking-widest">
                                                    {item.platform}
                                                </span>
                                                <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${item.angle === 'Wizjonerski' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                                        item.angle === 'Case Study' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                            'bg-green-500/10 text-green-400 border border-green-500/20'
                                                    }`}>
                                                    {item.angle}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black text-white group-hover:translate-x-1 transition-transform">{item.title}</h3>
                                            <p className="text-xs text-gray-500 leading-relaxed font-medium max-w-2xl">{item.description}</p>
                                        </div>

                                        <div className="flex-shrink-0 flex gap-3">
                                            <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent hover:text-white transition-all">
                                                <Layout size={18} />
                                            </button>
                                            <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-500 hover:border-green-500 hover:text-white transition-all text-white/30">
                                                <CheckCircle size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State Overlay */}
                {loading && !data && (
                    <div className="h-[600px] flex items-center justify-center flex-col gap-6 bg-white/[0.01] rounded-[48px] border border-white/5 animate-pulse">
                        <div className="w-16 h-16 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Agent Autonomiczny Pracuje...</span>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
