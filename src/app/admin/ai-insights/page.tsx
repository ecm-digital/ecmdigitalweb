'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getLatestAISessions, getAIChatHistory, getAIFeedbackStats } from '@/lib/firestoreService';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function AIInsightsPage() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [feedback, setFeedback] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const [sessionsData, feedbackData] = await Promise.all([
                    getLatestAISessions(20),
                    getAIFeedbackStats()
                ]);
                setSessions(sessionsData);
                setFeedback(feedbackData);
            } catch (err) {
                console.error('Error loading AI insights:', err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const handleSessionClick = async (sessionId: string) => {
        setSelectedSession(sessionId);
        setHistoryLoading(true);
        try {
            const history = await getAIChatHistory(sessionId, 50);
            setChatHistory(history);
        } catch (err) {
            console.error('Error loading history:', err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const getFeedbackForMessage = (messageId: string) => {
        return feedback.find(f => f.messageId === messageId);
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fade-in">
                <div>
                    <h1 className="text-4xl font-black font-space-grotesk tracking-tighter text-white uppercase italic">
                        🤖 AI <span className="text-brand-accent">Insights</span>
                    </h1>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                        Monitoring interakcji asystenta i analiza zapytań klientów
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sessions List */}
                    <div className="lg:col-span-1 bg-[#0a0a0f]/40 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden flex flex-col h-[700px]">
                        <div className="p-6 border-b border-white/5 bg-white/5">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white/70">Ostatnie Rozmowy</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />)
                            ) : sessions.length === 0 ? (
                                <div className="text-center py-10 opacity-30 text-xs font-bold uppercase tracking-widest">Brak sesji</div>
                            ) : (
                                sessions.map(session => (
                                    <button
                                        key={session.sessionId}
                                        onClick={() => handleSessionClick(session.sessionId)}
                                        className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedSession === session.sessionId
                                                ? 'bg-brand-accent/20 border-brand-accent/40 shadow-lg shadow-brand-accent/10'
                                                : 'bg-white/5 border-transparent hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black text-white/30 uppercase tracking-tighter">
                                                ID: {session.sessionId.slice(-8)}
                                            </span>
                                            <span className="text-[10px] bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded-full font-bold">
                                                {session.messageCount} msg
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-white/80 line-clamp-1 mb-2">{session.lastMessage}</p>
                                        <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">
                                            {session.lastActivity ? format(session.lastActivity.toDate(), 'HH:mm (dd.MM)', { locale: pl }) : 'Brak daty'}
                                        </p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat History View */}
                    <div className="lg:col-span-2 bg-[#0a0a0f]/40 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden flex flex-col h-[700px]">
                        {selectedSession ? (
                            <>
                                <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white/70">Przebieg Rozmowy</h3>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Sesja: {selectedSession}</span>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6 bg-black/20">
                                    {historyLoading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    ) : (
                                        chatHistory.map((msg, idx) => {
                                            const msgFeedback = getFeedbackForMessage(msg.id);
                                            return (
                                                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                                    <div className={`max-w-[80%] p-5 rounded-3xl relative group ${msg.role === 'user'
                                                            ? 'bg-white/5 text-white/90 rounded-tr-none'
                                                            : 'bg-brand-accent/10 border border-brand-accent/20 text-white rounded-tl-none'
                                                        }`}>
                                                        <p className="text-[13px] leading-relaxed font-medium">{msg.text}</p>

                                                        {msg.role === 'bot' && (
                                                            <div className="absolute -bottom-6 left-0 flex items-center gap-2">
                                                                {msgFeedback ? (
                                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${msgFeedback.helpful ? 'text-green-500' : 'text-red-500'
                                                                        }`}>
                                                                        OCENA: {msgFeedback.helpful ? '👍 POZYTYWNA' : '👎 NEGATYWNA'}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[9px] font-black text-white/10 uppercase tracking-widest italic">Brak oceny</span>
                                                                )}
                                                            </div>
                                                        )}
                                                        <span className={`text-[8px] font-bold opacity-20 absolute -top-4 ${msg.role === 'user' ? 'right-0' : 'left-0'}`}>
                                                            {msg.createdAt ? format(msg.createdAt.toDate(), 'HH:mm:ss') : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                                <div className="text-6xl mb-6 opacity-10">💬</div>
                                <h3 className="text-xl font-black font-space-grotesk tracking-tight text-white/40 uppercase mb-2">Wybierz sesję</h3>
                                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest max-w-xs">
                                    Wybierz rozmowę z listy po lewej stronie, aby przeanalizować jej przebieg i oceny klienta.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
