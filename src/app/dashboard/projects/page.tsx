'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Project, getUserProjects } from '@/lib/firestoreService';
import { useAuth } from '@/context/AuthContext';
import CommentThread from '@/components/CommentThread';

const statusConfig = {
    'Planowanie': { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: '📝' },
    'W trakcie': { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: '🔨' },
    'Testowanie': { color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: '🧪' },
    'Ukończone': { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: '✅' },
};

export default function ClientProjectsPage() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const loadData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getUserProjects(user.uid);
            setProjects(data);
            if (data.length > 0 && !selectedProject) {
                // Optionally select the first one by default if needed, 
                // but let's keep it null for clean initial state
            }
        } catch (error) {
            console.error("Load projects error:", error);
        }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, [user]);

    return (
        <DashboardLayout>
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black font-space-grotesk tracking-tighter uppercase italic text-white flex items-center gap-3">
                            🎯 {selectedProject ? `Projekt: ${selectedProject.title}` : 'Twoje Projekty'}
                        </h2>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-2">
                            {selectedProject ? 'Szczegóły zadania i dyskusja z zespołem' : 'Śledź etap realizacji i postępy swoich zleceń'}
                        </p>
                    </div>
                    {selectedProject && (
                        <button
                            onClick={() => setSelectedProject(null)}
                            className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            ← Powrót do listy
                        </button>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex flex-col xl:flex-row gap-10">
                    {/* Project List/Detail */}
                    <div className={`${selectedProject ? 'xl:w-1/2' : 'w-full'} transition-all duration-700`}>
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {[1, 2].map(i => <div key={i} className="h-[400px] bg-white/5 rounded-[48px] animate-pulse border border-white/5"></div>)}
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="py-32 bg-[#050508]/40 backdrop-blur-3xl border border-white/5 border-dashed rounded-[48px] text-center group">
                                <div className="text-7xl mb-10 grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000">🎯</div>
                                <h3 className="text-2xl font-black font-space-grotesk italic uppercase tracking-tighter mb-2">Brak aktywnych projektów</h3>
                                <p className="text-white/30 text-sm max-w-md mx-auto px-6 font-medium">Aktualnie nie realizujemy żadnych projektów dla Twojej marki. Twoje projekty pojawią się tutaj po zaakceptowaniu oferty.</p>
                                <button className="mt-12 px-10 py-5 bg-brand-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all">
                                    Rozpocznij Nowy Projekt
                                </button>
                            </div>
                        ) : selectedProject ? (
                            <div className="bg-[#050508]/40 backdrop-blur-3xl border border-white/5 p-12 rounded-[48px] shadow-2xl relative overflow-hidden h-full">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 blur-[100px] -mr-32 -mt-32 rounded-full"></div>

                                <span className={`inline-flex items-center gap-2 text-[10px] px-4 py-2 rounded-full font-black uppercase tracking-widest border mb-8 transition-colors ${(statusConfig[selectedProject.status as keyof typeof statusConfig] || statusConfig['Planowanie']).color}`}>
                                    {(statusConfig[selectedProject.status as keyof typeof statusConfig] || statusConfig['Planowanie']).icon} {selectedProject.status}
                                </span>

                                <h3 className="text-4xl font-black font-space-grotesk tracking-tighter uppercase italic leading-tight mb-6">{selectedProject.title}</h3>

                                <div className="space-y-8 mb-12">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end text-[12px] font-black uppercase tracking-widest italic text-white/40">
                                            <span>Postęp Realizacji</span>
                                            <span className="text-brand-accent text-lg">{selectedProject.progress}%</span>
                                        </div>
                                        <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                            <div className="h-full rounded-full transition-all duration-1000 relative shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                                                style={{ width: `${selectedProject.progress}%`, background: 'var(--gradient-accent)' }}>
                                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
                                        <div>
                                            <span className="text-[10px] text-white/20 font-black uppercase tracking-widest italic">Data Rozpoczęcia</span>
                                            <p className="text-white/60 font-bold mt-1">{new Date(selectedProject.createdAt.seconds * 1000).toLocaleDateString('pl-PL')}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-white/20 font-black uppercase tracking-widest italic">Status</span>
                                            <p className="text-white/60 font-bold mt-1">{selectedProject.status}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-white/5 rounded-[32px] border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4 italic">Krótki opis celu</h4>
                                    <p className="text-sm text-white/60 leading-relaxed font-medium">
                                        Ten widok pozwala na bieżąco monitorować szczegóły projektu i zadawać pytania zespołowi realizacyjnemu. Wykorzystaj panel obok, aby wysłać wiadomość.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {projects.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => setSelectedProject(p)}
                                        className="bg-[#050508]/40 backdrop-blur-3xl border border-white/5 p-10 rounded-[48px] group hover:bg-white/[0.05] transition-all cursor-pointer relative overflow-hidden shadow-2xl flex flex-col"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 blur-[100px] -mr-32 -mt-32 rounded-full transition-all duration-1000 group-hover:bg-brand-accent/10"></div>

                                        <div className="flex justify-between items-start mb-10 relative z-10">
                                            <div className="flex-1 pr-4">
                                                <div className="text-[9px] font-black text-brand-accent uppercase tracking-[0.2em] mb-3 italic">ID: {p.id.slice(-6).toUpperCase()}</div>
                                                <h3 className="text-3xl font-black font-space-grotesk tracking-tighter uppercase italic leading-tight group-hover:text-brand-accent transition-colors mb-4">{p.title}</h3>
                                                <span className={`text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest border transition-colors ${(statusConfig[p.status as keyof typeof statusConfig] || statusConfig['Planowanie']).color}`}>
                                                    {(statusConfig[p.status as keyof typeof statusConfig] || statusConfig['Planowanie']).icon} {p.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-auto space-y-6 relative z-10">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest italic text-white/40">
                                                    <span>Postęp Realizacji</span>
                                                    <span className="text-brand-accent">{p.progress}%</span>
                                                </div>
                                                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                                    <div className="h-full rounded-full transition-all duration-1000 relative shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                                                        style={{ width: `${p.progress}%`, background: 'var(--gradient-accent)' }}>
                                                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] text-white/20 font-black uppercase tracking-widest italic">Kliknij by otworzyć dyskusję</span>
                                                </div>
                                                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest group-hover:bg-brand-accent group-hover:border-brand-accent transition-all">
                                                    Szczegóły & Czat
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Chat Panel */}
                    {selectedProject && (
                        <div className="xl:w-1/2 min-h-[500px] animate-in slide-in-from-right-10 duration-700">
                            <CommentThread
                                parentId={selectedProject.id}
                                title={`Dyskusja: ${selectedProject.title}`}
                            />
                        </div>
                    )}
                </div>

                {/* Team Contact (Only show in grid view) */}
                {!selectedProject && (
                    <div className="p-10 bg-[#050508]/40 backdrop-blur-3xl border border-white/5 rounded-[48px] shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-[28px] bg-brand-accent/20 flex items-center justify-center text-3xl shadow-inner border border-brand-accent/30 group-hover:rotate-12 transition-transform duration-700">💬</div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2 italic">Twój Opiekun Projektu</h4>
                                    <h5 className="text-xl font-black font-space-grotesk uppercase italic tracking-tighter">Zespół Realizacyjny ECM</h5>
                                </div>
                            </div>
                            <button className="px-10 py-5 bg-brand-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all">
                                Skontaktuj się w sprawie projektu
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
