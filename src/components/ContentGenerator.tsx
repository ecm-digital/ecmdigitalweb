'use client';

import React, { useState } from 'react';
import { AIService } from '@/services/aiService';

interface ContentGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    campaignName?: string;
}

const formats = [
    { id: 'google_search', label: 'Google Search Ad', icon: '🔍' },
    { id: 'fb_instagram', label: 'FB/Instagram Post', icon: '📸' },
    { id: 'linkedin', label: 'LinkedIn Article', icon: '💼' },
    { id: 'yt_short', label: 'YouTube Short Script', icon: '🎥' }
];

export default function ContentGenerator({ isOpen, onClose, campaignName }: ContentGeneratorProps) {
    const [goal, setGoal] = useState(`Promocja ${campaignName || 'nowej usługi'}`);
    const [format, setFormat] = useState('fb_instagram');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedText, setGeneratedText] = useState('');

    const handleGenerate = async () => {
        setIsGenerating(true);
        setGeneratedText('');
        try {
            const result = await AIService.generateContent(goal, format);
            if (result.text) {
                setGeneratedText(result.text);
            }
        } catch (error) {
            console.error('Content gen error:', error);
            setGeneratedText('Wystąpił błąd podczas generowania treści.');
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-[#0a0a0f]/80 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black font-space-grotesk tracking-tighter text-white uppercase italic flex items-center gap-3">
                            ✨ AI Content Generator
                        </h2>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">Twórz treści reklamowe w kilka sekund</p>
                    </div>
                    <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Cel Kampanii</label>
                            <textarea
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-brand-accent transition-all"
                                rows={3}
                                placeholder="Co chcesz wypromować?"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Format Treści</label>
                            <div className="grid grid-cols-2 gap-2">
                                {formats.map(f => (
                                    <button
                                        key={f.id}
                                        onClick={() => setFormat(f.id)}
                                        className={`p-3 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-2 ${format === f.id ? 'bg-brand-accent border-brand-accent text-white' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
                                    >
                                        <span>{f.icon}</span>
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !goal}
                            className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${isGenerating ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20 hover:scale-[1.02] active:scale-95'}`}
                        >
                            {isGenerating ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Generowanie...
                                </span>
                            ) : 'Generuj Treści'}
                        </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative flex flex-col min-h-[300px]">
                        <div className="absolute top-4 left-6 text-[9px] font-black text-white/20 uppercase tracking-widest">Wynik AI</div>
                        <div className="mt-6 flex-1 text-sm leading-relaxed text-white/70 overflow-auto whitespace-pre-wrap font-inter">
                            {isGenerating ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-4 bg-white/10 rounded w-3/4" />
                                    <div className="h-4 bg-white/10 rounded w-full" />
                                    <div className="h-4 bg-white/10 rounded w-5/6" />
                                    <div className="h-32 bg-white/5 rounded w-full" />
                                </div>
                            ) : generatedText ? (
                                generatedText
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
                                    <div className="text-4xl mb-4">🪄</div>
                                    <p className="px-10 italic">Wypełnij dane i kliknij generuj, aby zobaczyć magię AI.</p>
                                </div>
                            )}
                        </div>
                        {generatedText && (
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(generatedText);
                                    alert('Skopiowano do schowka! 📋');
                                }}
                                className="mt-4 p-2 text-[10px] font-black text-brand-accent hover:text-white transition-colors uppercase tracking-widest self-end"
                            >
                                📋 Kopiuj Treść
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
