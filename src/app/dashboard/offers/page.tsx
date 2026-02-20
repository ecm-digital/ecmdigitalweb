'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Offer, getUserOffers, updateOffer } from '@/lib/firestoreService';
import { useAuth } from '@/context/AuthContext';
import { trackOfferAction } from '@/lib/ga';
import VideoReview from '@/components/VideoReview';
import CommentThread from '@/components/CommentThread';

const statusColors = {
    Robocza: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    Wysłana: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Zaakceptowana: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Odrzucona: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function ClientOffersPage() {
    const { user } = useAuth();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

    const loadData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getUserOffers(user.uid);
            setOffers(data);
        } catch (error) {
            console.error("Load offers error:", error);
        }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, [user]);

    const handleAccept = async (id: string) => {
        if (confirm('Czy na pewno chcesz zaakceptować tę ofertę? Rozpocznie to proces realizacji.')) {
            await updateOffer(id, { status: 'Zaakceptowana' });
            trackOfferAction(id, 'Accepted');
            loadData();
            if (selectedOffer?.id === id) {
                setSelectedOffer(prev => prev ? { ...prev, status: 'Zaakceptowana' } : null);
            }
        }
    };

    const handleReject = async (id: string) => {
        if (confirm('Czy na pewno chcesz odrzucić tę ofertę? Możesz podać powód w wiadomości do opiekuna.')) {
            await updateOffer(id, { status: 'Odrzucona' });
            trackOfferAction(id, 'Rejected');
            loadData();
            if (selectedOffer?.id === id) {
                setSelectedOffer(prev => prev ? { ...prev, status: 'Odrzucona' } : null);
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black font-space-grotesk tracking-tighter uppercase italic text-white flex items-center gap-3">
                            📜 {selectedOffer ? `Oferta: ${selectedOffer.title}` : 'Twoje Oferty'}
                        </h2>
                        <p className="text-sm text-white/30 font-black uppercase tracking-[0.2em] mt-2">
                            {selectedOffer ? 'Szczegóły propozycji i dyskusja z opiekunem' : 'Przeglądaj i zatwierdzaj przygotowane strategie rozwoju'}
                        </p>
                    </div>
                    {selectedOffer && (
                        <button
                            onClick={() => setSelectedOffer(null)}
                            className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            ← Powrót do listy
                        </button>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex flex-col xl:flex-row gap-10">
                    {/* Offers List/Detail */}
                    <div className={`${selectedOffer ? 'xl:w-[55%]' : 'w-full'} transition-all duration-700`}>
                        {loading ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {[1, 2].map(i => <div key={i} className="h-[450px] bg-white/5 rounded-[48px] animate-pulse border border-white/5"></div>)}
                            </div>
                        ) : offers.length === 0 ? (
                            <div className="py-32 bg-white/[0.04] backdrop-blur-xl border border-white/10 border-dashed rounded-[48px] text-center group">
                                <div className="text-7xl mb-10 grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000">💼</div>
                                <h3 className="text-2xl font-black font-space-grotesk italic uppercase tracking-tighter mb-2">Brak aktywnych ofert</h3>
                                <p className="text-white/30 text-base max-w-md mx-auto px-6 font-medium">Skontaktuj się ze swoim opiekunem, aby przygotować spersonalizowaną ofertę dla Twojego biznesu.</p>
                                <button className="mt-12 px-10 py-5 bg-brand-accent text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all">
                                    Zamów Nową Wycenę
                                </button>
                            </div>
                        ) : selectedOffer ? (
                            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-10 md:p-12 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col h-full">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 blur-[100px] -mr-32 -mt-32 rounded-full"></div>

                                <div className="flex justify-between items-start mb-10 relative z-10">
                                    <div>
                                        <div className="text-xs font-black text-brand-accent uppercase tracking-[0.2em] mb-3">Oferta nr {selectedOffer.id.slice(-6).toUpperCase()}</div>
                                        <h3 className="text-3xl font-black font-space-grotesk tracking-tighter uppercase italic leading-tight">{selectedOffer.title || 'Strategia Rozwoju'}</h3>
                                    </div>
                                    <span className={`text-xs px-4 py-2 rounded-full font-black uppercase tracking-widest border transition-colors ${statusColors[selectedOffer.status] || ''}`}>
                                        {selectedOffer.status}
                                    </span>
                                </div>

                                <div className="space-y-4 mb-12 relative z-10">
                                    {selectedOffer.items.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center p-6 rounded-[32px] bg-white/5 border border-white/5">
                                            <div className="flex-1 pr-6">
                                                <div className="text-lg font-bold tracking-tight text-white mb-1 uppercase font-space-grotesk italic">{item.service}</div>
                                                <div className="text-sm text-white/30 font-medium uppercase tracking-widest leading-relaxed">{item.description}</div>
                                            </div>
                                            <div className="text-2xl font-black font-space-grotesk text-white whitespace-nowrap">{item.price.toLocaleString('pl-PL')} <span className="text-sm text-white/20 non-italic">PLN</span></div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                                    <div>
                                        <div className="text-sm uppercase tracking-widest text-white/30 font-black mb-2 italic">Całkowita wartość inwestycji</div>
                                        <div className="text-5xl font-black font-space-grotesk text-white italic tracking-tighter">{selectedOffer.totalPrice.toLocaleString('pl-PL')} <span className="text-lg text-white/30 non-italic">PLN</span></div>
                                    </div>

                                    {selectedOffer.status === 'Wysłana' && (
                                        <div className="flex gap-4 w-full md:w-auto">
                                            <button
                                                onClick={() => handleReject(selectedOffer.id)}
                                                className="flex-1 md:flex-none px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-sm font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all font-space-grotesk"
                                            >
                                                Odrzuć
                                            </button>
                                            <button
                                                onClick={() => handleAccept(selectedOffer.id)}
                                                className="flex-1 md:flex-none px-10 py-5 bg-brand-accent text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:scale-105 transition-all font-space-grotesk"
                                            >
                                                Akceptuję Ofertę
                                            </button>
                                        </div>
                                    )}

                                    {selectedOffer.status === 'Zaakceptowana' && (
                                        <div className="flex items-center gap-3 text-emerald-400 font-black text-sm uppercase tracking-widest bg-emerald-500/10 px-8 py-5 rounded-2xl border border-emerald-500/20">
                                            <span className="text-lg">✅</span> Zaakceptowano Propozycję
                                        </div>
                                    )}
                                </div>

                                {selectedOffer.videoUrl && (
                                    <div className="mt-12 pt-10 border-t border-white/5 relative z-10">
                                        <div className="text-sm font-black text-brand-accent uppercase tracking-[0.2em] mb-6 italic">Wideo-omówienie strategii:</div>
                                        <div className="rounded-[40px] overflow-hidden border border-white/10 aspect-video bg-black shadow-2xl">
                                            <iframe
                                                src={selectedOffer.videoUrl.includes('loom.com') ? `https://www.loom.com/embed/${selectedOffer.videoUrl.split('/').pop()?.split('?')[0]}` : selectedOffer.videoUrl}
                                                frameBorder="0"
                                                allowFullScreen
                                                className="w-full h-full"
                                            ></iframe>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {offers.map(o => (
                                    <div
                                        key={o.id}
                                        onClick={() => setSelectedOffer(o)}
                                        className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-10 rounded-[48px] group hover:bg-white/[0.05] transition-all cursor-pointer relative overflow-hidden shadow-2xl flex flex-col"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 blur-[100px] -mr-32 -mt-32 rounded-full transition-all duration-1000 group-hover:bg-brand-accent/10"></div>

                                        <div className="flex justify-between items-start mb-10 relative z-10">
                                            <div>
                                                <div className="text-xs font-black text-brand-accent uppercase tracking-[0.2em] mb-3">Oferta nr {o.id.slice(-6).toUpperCase()}</div>
                                                <h3 className="text-2xl font-black font-space-grotesk tracking-tighter uppercase italic leading-tight group-hover:text-brand-accent transition-colors">{o.title || 'Strategia Rozwoju'}</h3>
                                            </div>
                                            <span className={`text-xs px-3 py-1.5 rounded-full font-black uppercase tracking-widest border transition-colors ${statusColors[o.status] || ''}`}>
                                                {o.status}
                                            </span>
                                        </div>

                                        <div className="space-y-4 mb-10 flex-1 relative z-10">
                                            {o.items.slice(0, 3).map((item, i) => (
                                                <div key={i} className="flex justify-between items-center p-5 rounded-[24px] bg-white/5 border border-white/5">
                                                    <div className="text-base font-bold tracking-tight text-white/80">{item.service}</div>
                                                    <div className="text-base font-black font-space-grotesk text-white/50">{item.price.toLocaleString('pl-PL')} PLN</div>
                                                </div>
                                            ))}
                                            {o.items.length > 3 && <div className="text-xs text-center font-black text-white/20 uppercase tracking-widest">+ {o.items.length - 3} więcej usług</div>}
                                        </div>

                                        <div className="pt-8 border-t border-white/5 flex justify-between items-center relative z-10">
                                            <div className="text-2xl font-black font-space-grotesk text-white italic">{o.totalPrice.toLocaleString('pl-PL')} <span className="text-sm text-white/30 non-italic">PLN</span></div>
                                            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest group-hover:bg-brand-accent group-hover:border-brand-accent transition-all">
                                                Szczegóły & Czat
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Chat Panel */}
                    {selectedOffer && (
                        <div className="xl:w-[45%] min-h-[500px] animate-in slide-in-from-right-10 duration-700">
                            <CommentThread
                                parentId={selectedOffer.id}
                                title={`Dyskusja: ${selectedOffer.title}`}
                            />
                        </div>
                    )}
                </div>

                {/* Notes (Only show in grid view) */}
                {!selectedOffer && (
                    <div className="p-10 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="relative z-10">
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/30 mb-6 italic">Wskazówki dla partnera</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <p className="text-base text-white/60 leading-relaxed font-medium">
                                    Wszystkie oferty są ważne przez 14 dni od daty wystawienia. Akceptacja oferty oznacza rozpoczęcie procedury wdrożeniowej oraz przydzielenie dedykowanego zespołu projektowego.
                                </p>
                                <p className="text-base text-white/60 leading-relaxed font-medium">
                                    Szczegóły techniczne i terminy realizacji zostaną uszczegółowione na spotkaniu kick-off, które umówimy natychmiast po otrzymaniu Twojej akceptacji.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
