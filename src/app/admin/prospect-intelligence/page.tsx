'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useNotifications } from '@/context/NotificationContext';
import { getAgencySettings, saveProspect } from '@/lib/firestoreService';
import { Target, Zap, Search, Shield, PlayCircle, MessageSquare, ArrowRight, Brain } from 'lucide-react';

interface BattleCard {
    companyName: string;
    painPoints: { title: string; desc: string }[];
    offerPitch: { title: string; desc: string };
    videoScript: { hook: string; body: string; cta: string };
    agentReasoning: string;
}

export default function ProspectIntelligencePage() {
    const [prospectInput, setProspectInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [scanStatus, setScanStatus] = useState<'idle' | 'scraping' | 'analyzing'>('idle');
    const [sendingToVideo, setSendingToVideo] = useState(false);
    const [sendingToOutreach, setSendingToOutreach] = useState(false);
    const [data, setData] = useState<BattleCard | null>(null);
    const { showToast } = useNotifications();

    const analyzeProspect = async () => {
        if (!prospectInput.trim()) {
            showToast('Podaj URL lub nazwę firmy', 'warning');
            return;
        }

        setLoading(true);
        setData(null);

        const isUrlPattern = prospectInput.includes('.') && !prospectInput.includes(' ');
        if (isUrlPattern) setScanStatus('scraping');
        else setScanStatus('analyzing');

        try {
            if (isUrlPattern) {
                // Simulating status transition
                setTimeout(() => setScanStatus('analyzing'), 2000);
            }

            const res = await fetch('/api/ai/analyze-prospect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prospectInput })
            });

            if (!res.ok) throw new Error('Błąd API');
            const result = await res.json();
            setData(result);

            // Save to Firestore for pipeline tracking
            try {
                await saveProspect({
                    companyName: result.companyName,
                    url: isUrl ? prospectInput : undefined,
                    status: 'New',
                    painPoints: result.painPoints,
                    pitch: result.offerPitch,
                    videoScript: result.videoScript,
                    agentReasoning: result.agentReasoning
                });
            } catch (saveErr) {
                console.error('Error saving prospect:', saveErr);
            }

            showToast('Battle Card wygenerowany i zapisany!', 'success');
        } catch (err: any) {
            showToast('Błąd analizy: ' + err.message, 'error');
        } finally {
            setLoading(false);
            setScanStatus('idle');
        }
    };

    const isUrl = prospectInput.includes('.') && !prospectInput.includes(' ');

    const sendToVideoOutreach = async () => {
        if (!data) return;
        setSendingToVideo(true);
        try {
            const settings = await getAgencySettings();
            if (!settings?.videoOutreachWebhook) {
                showToast('Skonfiguruj Video Webhook w ustawieniach!', 'warning');
                return;
            }

            const res = await fetch(settings.videoOutreachWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prospectName: data.companyName,
                    script: data.videoScript,
                    reasoning: data.agentReasoning,
                    type: 'ECM Video Outreach V1'
                })
            });

            if (res.ok) {
                showToast('Skrypt wysłany do generatora wideo! 🎬', 'success');
            } else {
                throw new Error('Webhook error');
            }
        } catch (err) {
            showToast('Błąd wysyłki do Video API', 'error');
        } finally {
            setSendingToVideo(false);
        }
    };

    const sendToCampaign = async () => {
        if (!data) return;
        setSendingToOutreach(true);
        try {
            const settings = await getAgencySettings();
            if (!settings?.outreachWebhook) {
                showToast('Skonfiguruj Outreach Webhook w ustawieniach!', 'warning');
                return;
            }

            const res = await fetch(settings.outreachWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company: data.companyName,
                    pitch: data.offerPitch,
                    firstLine: `Cześć, zauważyłem że ${data.companyName} zmaga się z ${data.painPoints[0].title.toLowerCase()}...`,
                    source: 'ECM Prospect AI 2026'
                })
            });

            if (res.ok) {
                showToast('Lead wysłany do kampanii! ✉️', 'success');
            } else {
                throw new Error('Webhook error');
            }
        } catch (err) {
            showToast('Błąd wysyłki do Outreach API', 'error');
        } finally {
            setSendingToOutreach(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-brand-accent mb-2">
                            <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                                <Search size={16} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sales Intelligence OS</span>
                        </div>
                        <h1 className="text-4xl font-black font-space-grotesk uppercase italic tracking-tighter">
                            Prospect <span className="text-brand-accent">Analyzer</span>
                        </h1>
                        <p className="text-gray-500 max-w-lg text-sm font-medium leading-relaxed">
                            Wprowadź URL firmy lub jej opis, a AI przygotuje dla Ciebie militarny "Battle Card" z gotowym skryptem wideo i analizą słabych punktów.
                        </p>
                    </div>
                </div>

                {/* Input Area */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent to-blue-600 rounded-[32px] blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>
                    <div className="relative bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-2 flex flex-col md:flex-row gap-2">
                        <input
                            type="text"
                            value={prospectInput}
                            onChange={(e) => setProspectInput(e.target.value)}
                            placeholder="Wklej URL firmy (np. www.firma.pl) lub krótki opis działalności..."
                            className="flex-1 bg-transparent px-8 py-4 text-white placeholder:text-white/20 outline-none font-medium"
                            onKeyDown={(e) => e.key === 'Enter' && analyzeProspect()}
                        />
                        <button
                            onClick={analyzeProspect}
                            disabled={loading || !prospectInput}
                            className="px-10 py-4 bg-brand-accent text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>{scanStatus === 'scraping' ? 'Scraping WWW...' : 'Deep Analysis...'}</span>
                                </>
                            ) : (
                                <>
                                    <span>{isUrl ? 'Run Deep Scan' : 'Generate Battle Card'}</span>
                                    <ArrowRight size={16} strokeWidth={3} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {isUrl && !data && !loading && (
                    <div className="flex justify-center">
                        <div className="px-4 py-2 bg-brand-accent/10 border border-brand-accent/20 rounded-full flex items-center gap-2 animate-pulse">
                            <Brain size={12} className="text-brand-accent" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">AI Deep Scraper: Ready to analyze URL</span>
                        </div>
                    </div>
                )}

                {data && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        {/* Main Battle Card Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Pain Points Section */}
                            <div className="bg-white/[0.02] border border-white/10 rounded-[48px] p-10 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                                        <Target size={24} />
                                    </div>
                                    <h3 className="text-2xl font-black font-space-grotesk uppercase italic tracking-tight">Słabe Punkty (Pain Points)</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {data.painPoints.map((item, i) => (
                                        <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl space-y-3 group/item hover:bg-white/[0.05] transition-all">
                                            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center text-xs font-black">
                                                0{i + 1}
                                            </div>
                                            <h4 className="font-bold text-white group-hover:text-brand-accent transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                                {item.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Offer Pitch Section */}
                            <div className="bg-brand-accent/[0.03] border border-brand-accent/20 rounded-[48px] p-10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-10 text-brand-accent/10 group-hover:scale-110 transition-transform duration-700">
                                    <Shield size={120} strokeWidth={1} />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-brand-accent text-white flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                                            <Zap size={24} fill="currentColor" />
                                        </div>
                                        <h3 className="text-2xl font-black font-space-grotesk uppercase italic tracking-tight">Offer Pitch (Value Prop)</h3>
                                    </div>

                                    <h4 className="text-xl font-bold text-white max-w-xl">
                                        {data.offerPitch.title}
                                    </h4>
                                    <p className="text-sm text-gray-400 leading-loose font-medium max-w-2xl">
                                        {data.offerPitch.desc}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-8">
                            {/* Video Script Section */}
                            <div className="bg-black/60 border border-white/10 rounded-[48px] p-8 space-y-6 backdrop-blur-xl">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-white/40">Video Script (Loom)</h4>
                                    <PlayCircle size={20} className="text-brand-accent" />
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">Hook (0-5s):</span>
                                        <p className="text-xs text-white/90 italic p-4 bg-white/5 rounded-2xl border border-white/5">
                                            "{data.videoScript.hook}"
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">Body:</span>
                                        <p className="text-xs text-white/70 leading-relaxed">
                                            {data.videoScript.body}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">CTA:</span>
                                        <p className="text-xs font-bold text-white">
                                            👉 {data.videoScript.cta}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 pt-4">
                                    <button
                                        onClick={sendToVideoOutreach}
                                        disabled={sendingToVideo}
                                        className="w-full py-4 bg-brand-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-accent/20 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {sendingToVideo ? 'Generowanie...' : '🚀 Uruchom Video Lead (AI)'}
                                    </button>
                                    <button
                                        onClick={sendToCampaign}
                                        disabled={sendingToOutreach}
                                        className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                                    >
                                        {sendingToOutreach ? 'Wysyłanie...' : '✉️ Zatwierdź i Wyślij do Kampanii'}
                                    </button>
                                    <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                        Kopiuj Skrypt
                                    </button>
                                </div>
                            </div>

                            {/* Reasoning Trace */}
                            <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 space-y-4">
                                <div className="flex items-center gap-3 text-brand-accent/50">
                                    <Brain size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic">Agent Logic Trace</span>
                                </div>
                                <p className="text-[11px] text-gray-500 italic leading-relaxed font-inter font-medium">
                                    {data.agentReasoning}
                                </p>
                            </div>

                            {/* Stats/Company Info */}
                            <div className="p-8 bg-gradient-to-br from-brand-accent/20 to-transparent border border-brand-accent/10 rounded-[40px] flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-black uppercase text-white/40 block mb-1">Cel Ataku:</span>
                                    <span className="text-lg font-black text-white">{data.companyName}</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                    <MessageSquare size={16} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
