'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useNotifications } from '@/context/NotificationContext';
import { getProspects, updateProspectStatus, Prospect } from '@/lib/firestoreService';
import { Users, Filter, Search, MessageSquare, Video, Mail, Calendar, Brain, Trash2, ChevronRight, Zap } from 'lucide-react';

export default function LeadPipelinePage() {
    const [prospects, setProspects] = useState<Prospect[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
    const [lastMessage, setLastMessage] = useState('');
    const [aiReply, setAiReply] = useState<{ reply: string, strategicNote: string } | null>(null);
    const [generating, setGenerating] = useState(false);
    const { showToast } = useNotifications();

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const data = await getProspects();
            setProspects(data);
        } catch (e) {
            showToast('Błąd pobierania leadów', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const changeStatus = async (id: string, status: Prospect['status']) => {
        try {
            await updateProspectStatus(id, status);
            showToast('Status zaktualizowany', 'success');
            fetchLeads();
        } catch (e) {
            showToast('Błąd aktualizacji statusu', 'error');
        }
    };

    const generateAiReply = async () => {
        if (!selectedProspect || !lastMessage) return;
        setGenerating(true);
        setAiReply(null);
        try {
            const res = await fetch('/api/ai/booking-helper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prospectData: selectedProspect, lastMessage })
            });
            const result = await res.json();
            setAiReply(result);
            showToast('Odpowiedź AI wygenerowana!', 'success');
        } catch (e) {
            showToast('Błąd AI', 'error');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-brand-accent mb-2">
                            <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                                <Users size={16} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sales Management</span>
                        </div>
                        <h1 className="text-4xl font-black font-space-grotesk uppercase italic tracking-tighter">
                            Lead <span className="text-brand-accent">Pipeline</span>
                        </h1>
                        <p className="text-gray-500 max-w-lg text-sm font-medium leading-relaxed">
                            Zarządzaj prospektami wygenerowanymi przez AI i używaj asystenta bookingowego do zamykania spotkań.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Leads List */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                            <input
                                type="text"
                                placeholder="Szukaj firmy..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:border-brand-accent/50 outline-none transition-all"
                            />
                        </div>

                        {loading ? (
                            <div className="space-y-4 opacity-50">
                                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse" />)}
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                                {prospects.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => setSelectedProspect(p)}
                                        className={`p-6 rounded-[32px] border transition-all cursor-pointer group ${selectedProspect?.id === p.id
                                                ? 'bg-brand-accent/10 border-brand-accent/30'
                                                : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-white group-hover:text-brand-accent transition-colors">{p.companyName}</h3>
                                            <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${p.status === 'New' ? 'bg-blue-500/10 text-blue-400' :
                                                    p.status === 'Replied' ? 'bg-green-500/10 text-green-400' :
                                                        'bg-brand-accent/10 text-brand-accent'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-white/20">
                                            <Video size={14} className={p.status === 'Video Sent' ? 'text-brand-accent' : ''} />
                                            <Mail size={14} className={p.status === 'Outreach Active' ? 'text-brand-accent' : ''} />
                                            <Calendar size={14} className={p.status === 'Meeting Booked' ? 'text-green-500' : ''} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Lead Details & AI Assistant */}
                    <div className="lg:col-span-8">
                        {selectedProspect ? (
                            <div className="bg-white/[0.02] border border-white/10 rounded-[48px] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                    <div>
                                        <h2 className="text-2xl font-black font-space-grotesk tracking-tight uppercase italic">{selectedProspect.companyName}</h2>
                                        <p className="text-xs text-gray-500 mt-1">{selectedProspect.url || 'Brak URL'}</p>
                                    </div>
                                    <select
                                        value={selectedProspect.status}
                                        onChange={(e) => changeStatus(selectedProspect.id, e.target.value as any)}
                                        className="bg-black border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none"
                                    >
                                        <option value="New">New</option>
                                        <option value="Video Sent">Video Sent</option>
                                        <option value="Outreach Active">Outreach Active</option>
                                        <option value="Replied">Replied</option>
                                        <option value="Meeting Booked">Meeting Booked</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    {/* Left: Info */}
                                    <div className="p-10 space-y-8 border-r border-white/5">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em]">Słabe punkty:</h4>
                                            <div className="space-y-2">
                                                {selectedProspect.painPoints.map((pp, i) => (
                                                    <div key={i} className="text-xs text-gray-400 flex gap-2">
                                                        <span className="text-brand-accent">•</span>
                                                        {pp.title}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em]">Strategia AI:</h4>
                                            <p className="text-xs text-gray-500 leading-relaxed italic">
                                                {selectedProspect.agentReasoning}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: AI Booking Helper */}
                                    <div className="p-10 bg-black/40 space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Brain size={18} className="text-brand-accent" />
                                            <h4 className="text-[10px] font-black uppercase tracking-widest italic">AI Booking Assistant</h4>
                                        </div>

                                        <div className="relative">
                                            <textarea
                                                value={lastMessage}
                                                onChange={(e) => setLastMessage(e.target.value)}
                                                placeholder="Wklej ostatnią wiadomość od klienta..."
                                                className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 text-xs text-white/70 outline-none focus:border-brand-accent/30 transition-all resize-none"
                                            />
                                            <button
                                                onClick={generateAiReply}
                                                disabled={generating || !lastMessage}
                                                className="absolute bottom-4 right-4 w-10 h-10 rounded-2xl bg-brand-accent text-white flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-brand-accent/20"
                                            >
                                                <Zap size={16} fill="currentColor" className={generating ? 'animate-pulse' : ''} />
                                            </button>
                                        </div>

                                        {aiReply && (
                                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-4">
                                                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                                                    <p className="text-[11px] text-white leading-relaxed font-medium">
                                                        {aiReply.reply}
                                                    </p>
                                                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                                        <span className="text-[9px] font-black text-white/20 uppercase">Smart Reply v1</span>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(aiReply.reply);
                                                                showToast('Skopiowano!', 'success');
                                                            }}
                                                            className="text-[9px] font-black text-brand-accent uppercase hover:underline"
                                                        >
                                                            Kopiuj Odpowiedź
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-brand-accent/5 rounded-2xl border border-brand-accent/10">
                                                    <p className="text-[9px] text-brand-accent font-bold italic leading-relaxed">
                                                        💡 Insight: {aiReply.strategicNote}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[600px] border border-dashed border-white/10 rounded-[48px] flex flex-col items-center justify-center text-white/20 space-y-4">
                                <Users size={48} strokeWidth={1} />
                                <p className="text-xs font-black uppercase tracking-widest">Wybierz prospekta, aby zobaczyć szczegóły</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
