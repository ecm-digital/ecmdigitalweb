'use client';

import React from 'react';

interface VideoReviewProps {
    url: string;
    title?: string;
    description?: string;
}

export default function VideoReview({ url, title, description }: VideoReviewProps) {
    // Helper to get embed URL
    const getEmbedUrl = (rawUrl: string) => {
        if (!rawUrl) return null;

        // Loom
        if (rawUrl.includes('loom.com')) {
            const id = rawUrl.split('/').pop()?.split('?')[0];
            return `https://www.loom.com/embed/${id}`;
        }

        // YouTube
        if (rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be')) {
            let id = '';
            if (rawUrl.includes('v=')) {
                id = rawUrl.split('v=')[1].split('&')[0];
            } else {
                id = rawUrl.split('/').pop() || '';
            }
            return `https://www.youtube.com/embed/${id}`;
        }

        // Vimeo
        if (rawUrl.includes('vimeo.com')) {
            const id = rawUrl.split('/').pop();
            return `https://player.vimeo.com/video/${id}`;
        }

        return rawUrl; // Assume it's already an embed link if no match
    };

    const embedUrl = getEmbedUrl(url);

    if (!embedUrl) return null;

    return (
        <div className="bg-white/70 backdrop-blur-3xl border border-black/[0.03] rounded-[48px] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-10 items-start">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse shadow-[0_0_10px_rgba(233,69,96,0.5)]"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent">Wiadomość od Opiekuna</span>
                        </div>
                        <h3 className="text-3xl font-black font-space-grotesk italic uppercase tracking-tighter text-gray-900">
                            {title || 'Omówienie Strategii i Wyników'}
                        </h3>
                        {description && (
                            <p className="text-gray-500 text-sm leading-relaxed max-w-xl font-medium">
                                {description}
                            </p>
                        )}
                    </div>

                    <div className="w-full md:w-[500px] aspect-video rounded-[32px] overflow-hidden border border-black/[0.05] shadow-2xl relative group bg-black">
                        <iframe
                            src={embedUrl}
                            frameBorder="0"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}
