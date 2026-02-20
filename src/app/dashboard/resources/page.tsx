'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { UserFile, getUserFiles } from '@/lib/firestoreService';
import { useAuth } from '@/context/AuthContext';

const typeIcons = {
    PDF: '📕',
    XLS: '📗',
    IMG: '🖼️',
    DOC: '📘',
};

const typeColors = {
    PDF: 'text-red-400 bg-red-400/10 border-red-400/20',
    XLS: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    IMG: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    DOC: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
};

export default function ClientResourcesPage() {
    const { user } = useAuth();
    const [files, setFiles] = useState<UserFile[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getUserFiles(user.uid);
            setFiles(data);
        } catch (error) {
            console.error("Load files error:", error);
        }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, [user]);

    const handleDownload = (url: string, name: string) => {
        window.open(url, '_blank');
    };

    return (
        <DashboardLayout>
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black font-space-grotesk tracking-tighter uppercase italic text-white flex items-center gap-3">
                            📁 Baza Wiedzy
                        </h2>
                        <p className="text-sm text-white/30 font-black uppercase tracking-[0.2em] mt-2">Dostęp do ważnych dokumentów, raportów i zasobów projektowych</p>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => <div key={i} className="h-[200px] bg-white/5 rounded-[40px] animate-pulse border border-white/5"></div>)}
                    </div>
                ) : files.length === 0 ? (
                    <div className="py-32 bg-white/[0.04] backdrop-blur-xl border border-white/10 border-dashed rounded-[48px] text-center group">
                        <div className="text-7xl mb-10 grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000">📁</div>
                        <h3 className="text-2xl font-black font-space-grotesk italic uppercase tracking-tighter mb-2">Brak udostępnionych plików</h3>
                        <p className="text-white/30 text-base max-w-md mx-auto px-6 font-medium">Twój opiekun nie udostępnił jeszcze żadnych dokumentów. Wszystkie raporty miesięczne i faktury pojawią się w tym miejscu.</p>
                        <button className="mt-12 px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-brand-accent transition-all">
                            Zgłoś potrzebę dokumentu
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                        {files.map(f => (
                            <div key={f.id} className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-8 rounded-[40px] group hover:bg-white/[0.05] transition-all relative overflow-hidden shadow-2xl flex flex-col">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-accent/5 blur-[80px] -mr-24 -mt-24 rounded-full transition-all duration-1000 group-hover:bg-brand-accent/10"></div>

                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${typeColors[f.type] || 'text-white bg-white/10 border-white/20'} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                        {typeIcons[f.type] || '📄'}
                                    </div>
                                    <span className="text-xs font-black font-mono text-white/20 uppercase tracking-widest">{f.size}</span>
                                </div>

                                <div className="flex-1 mb-8 relative z-10">
                                    <h4 className="text-lg font-black font-space-grotesk tracking-tighter uppercase italic text-white group-hover:text-brand-accent transition-colors truncate mb-2">{f.name}</h4>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-md font-black uppercase tracking-widest border ${typeColors[f.type] || ''}`}>
                                            {f.type}
                                        </span>
                                        <span className="text-xs text-white/20 font-black uppercase tracking-widest italic">{new Date(f.createdAt.seconds * 1000).toLocaleDateString('pl-PL')}</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 relative z-10">
                                    <button
                                        onClick={() => handleDownload(f.url, f.name)}
                                        className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-accent hover:border-brand-accent transition-all flex items-center justify-center gap-3 shadow-lg"
                                    >
                                        <span>Pobierz Plik</span>
                                        <span className="text-sm group-hover:translate-y-1 transition-transform">⬇️</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Secure storage note */}
                <div className="p-10 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="text-7xl group-hover:animate-bounce transition-all">🔒</div>
                        <div>
                            <h4 className="text-xl font-black font-space-grotesk uppercase italic mb-3 tracking-tighter">Szyfrowane Przechowywanie</h4>
                            <p className="text-base text-white/60 leading-relaxed font-medium max-w-2xl">
                                Wszystkie pliki są przechowywane w bezpiecznej chmurze ECM Digital z dostępem ograniczonym wyłącznie dla Twojej organizacji. Używamy protokołu SSL/TLS 1.3 dla najwyższego poziomu prywatności Twoich danych biznesowych.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
