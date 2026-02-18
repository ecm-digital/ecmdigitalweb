'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Comment, addComment, subscribeToComments } from '@/lib/firestoreService';
import { useAuth } from '@/context/AuthContext';

interface CommentThreadProps {
    parentId: string;
    title?: string;
}

export default function CommentThread({ parentId, title }: CommentThreadProps) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!parentId) return;

        const unsubscribe = subscribeToComments(parentId, (data) => {
            setComments(data);
            // Scroll to bottom on new comments
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            }, 100);
        });

        return () => unsubscribe();
    }, [parentId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user || isSending) return;

        setIsSending(true);
        try {
            await addComment({
                parentId,
                userId: user.uid,
                userName: user.displayName || user.email || 'Klient',
                userRole: 'client', // In a real app, this would come from user context/profile
                text: newComment.trim(),
            });
            setNewComment('');
        } catch (error) {
            console.error("Error sending comment:", error);
        }
        setIsSending(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#050508]/40 backdrop-blur-3xl border border-white/5 rounded-[48px] overflow-hidden shadow-2xl group transition-all">
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black font-space-grotesk tracking-tighter uppercase italic">{title || 'Dyskusja'}</h3>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">Bezpośrednia komunikacja z opiekunem</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-xl">
                    💬
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-8 space-y-6 min-h-[400px] max-h-[600px] scrollbar-thin scrollbar-thumb-white/10"
            >
                {comments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                        <div className="text-5xl mb-6">✉️</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Brak wiadomości. Rozpocznij rozmowę.</p>
                    </div>
                ) : (
                    comments.map((comment) => {
                        const isMe = comment.userId === user?.uid;
                        return (
                            <div
                                key={comment.id}
                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-2`}
                            >
                                <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{comment.userName}</span>
                                    <span className="text-[8px] text-white/10 uppercase font-black">{comment.createdAt ? new Date(comment.createdAt.toDate()).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) : '...'}</span>
                                </div>
                                <div
                                    className={`max-w-[80%] p-5 rounded-[24px] text-sm leading-relaxed border ${isMe
                                            ? 'bg-brand-accent/20 border-brand-accent/20 text-white rounded-tr-none'
                                            : 'bg-white/5 border-white/5 text-white/80 rounded-tl-none'
                                        }`}
                                >
                                    {comment.text}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-8 border-t border-white/5 bg-white/[0.02]">
                <div className="flex gap-4 items-end">
                    <div className="flex-1 relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Wpisz wiadomość..."
                            rows={1}
                            className="w-full bg-black/40 border border-white/10 rounded-[24px] py-4 px-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand-accent/50 transition-all resize-none overflow-hidden"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(e as any);
                                }
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!newComment.trim() || isSending}
                        className="w-14 h-14 bg-brand-accent text-white rounded-[20px] flex items-center justify-center hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-105 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100 shadow-2xl"
                    >
                        {isSending ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <span className="text-xl rotate-45 -translate-y-0.5 -translate-x-0.5">✈️</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
