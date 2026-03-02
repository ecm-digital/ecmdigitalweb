'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Project, getUserProjects, updateProject, addCaseStudy } from '@/lib/firestoreService';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import confetti from 'canvas-confetti';
import CommentThread from '@/components/CommentThread';
import ProjectVault from '@/components/ProjectVault';

const statusConfig = {
    'Planowanie': { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: '📝' },
    'W trakcie': { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: '🔨' },
    'Testowanie': { color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: '🧪' },
    'Ukończone': { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: '✅' },
};

export default function ClientProjectsPage() {
    const { user } = useAuth();
    const { T } = useLanguage();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // AI Review Modal State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [isCompleting, setIsCompleting] = useState(false);

    const loadData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getUserProjects(user.uid);
            setProjects(data);
            if (selectedProject) {
                const updated = data.find(p => p.id === selectedProject.id);
                if (updated) setSelectedProject(updated);
            }
        } catch (error) {
            console.error("Load projects error:", error);
        }
        setLoading(false);
    };

    const handleApproveClick = () => {
        setShowReviewModal(true);
    };

    const submitReviewAndApprove = async () => {
        if (!selectedProject) return;
        setIsCompleting(true);

        // 1. Generate & Save AI Case Study
        try {
            const res = await fetch('/api/ai/generate-casestudy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectName: selectedProject.title,
                    clientReview: reviewComment || 'Wspaniała współpraca.',
                    rating: reviewRating
                })
            });

            if (res.ok) {
                const caseStudyData = await res.json();
                if (caseStudyData && caseStudyData.translations) {
                    await addCaseStudy(caseStudyData);
                }
            }
        } catch (error) {
            console.error('Case study gen error', error);
        }

        // Trigger Magic Approval Confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981']
        });

        const newStatus = 'Ukończone';

        try {
            await updateProject(selectedProject.id, { status: newStatus, progress: 100 });
            await loadData();
        } catch (error) {
            console.error('Error', error);
            alert(T('dash.ticketError'));
        }

        setIsCompleting(false);
        setShowReviewModal(false);
    };

    useEffect(() => { loadData(); }, [user]);

    return (
        <DashboardLayout>
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black font-space-grotesk tracking-tighter uppercase italic text-white flex items-center gap-3">
                            🎯 {selectedProject ? `${T('dash.yourProjects')}: ${selectedProject.title}` : T('dash.yourProjects')}
                        </h2>
                        <p className="text-sm text-white/30 font-black uppercase tracking-[0.2em] mt-2">
                            {selectedProject ? T('dash.projectDetails') : T('dash.trackProgress')}
                        </p>
                    </div>
                    {selectedProject && (
                        <button
                            onClick={() => setSelectedProject(null)}
                            className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            {T('dash.backToList')}
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
                            <div className="py-32 bg-white/[0.04] backdrop-blur-xl border border-white/10 border-dashed rounded-[48px] text-center group">
                                <div className="text-7xl mb-10 grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000">🎯</div>
                                <h3 className="text-2xl font-black font-space-grotesk italic uppercase tracking-tighter mb-2">{T('dash.noProjectsActive')}</h3>
                                <p className="text-white/30 text-base max-w-md mx-auto px-6 font-medium">{T('dash.noProjectsDesc')}</p>
                                <button className="mt-12 px-10 py-5 bg-brand-accent text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all">
                                    {T('dash.startProject')}
                                </button>
                            </div>
                        ) : selectedProject ? (
                            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-12 rounded-[48px] shadow-2xl relative overflow-hidden h-full">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 blur-[100px] -mr-32 -mt-32 rounded-full"></div>

                                <span className={`inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full font-black uppercase tracking-widest border mb-8 transition-colors ${(statusConfig[selectedProject.status as keyof typeof statusConfig] || statusConfig['Planowanie']).color}`}>
                                    {(statusConfig[selectedProject.status as keyof typeof statusConfig] || statusConfig['Planowanie']).icon} {T(`status.${selectedProject.status}`)}
                                </span>

                                <h3 className="text-4xl font-black font-space-grotesk tracking-tighter uppercase italic leading-tight mb-6">{selectedProject.title}</h3>

                                <div className="space-y-8 mb-12">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end text-base font-black uppercase tracking-widest italic text-white/40">
                                            <span>{T('dash.progress')}</span>
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
                                            <span className="text-sm text-white/20 font-black uppercase tracking-widest italic">{T('dash.startDate')}</span>
                                            <p className="text-white/60 font-bold mt-1">{new Date(selectedProject.createdAt.seconds * 1000).toLocaleDateString('pl-PL')}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-white/20 font-black uppercase tracking-widest italic">Status</span>
                                            <p className="text-white/60 font-bold mt-1">{T(`status.${selectedProject.status}`)}</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedProject.status === 'Testowanie' && (
                                    <div className="mb-12 p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-[32px] border border-brand-accent/30 text-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-brand-accent/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500"></div>
                                        <div className="relative z-10">
                                            <h4 className="text-2xl font-black font-space-grotesk tracking-tighter uppercase italic mb-2">{T('dash.readyPickup')}</h4>
                                            <p className="text-sm text-white/60 font-medium mb-8">{T('dash.testedAll')}</p>
                                            <button
                                                onClick={handleApproveClick}
                                                className="px-12 py-5 bg-white text-black rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                                            >
                                                {T('dash.pickupProject')}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="p-8 bg-white/5 rounded-[32px] border border-white/5">
                                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/30 mb-4 italic">{T('dash.goalDesc')}</h4>
                                    <p className="text-base text-white/60 leading-relaxed font-medium">
                                        {T('dash.monitorDesc')}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {projects.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => setSelectedProject(p)}
                                        className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-10 rounded-[48px] group hover:bg-white/[0.05] transition-all cursor-pointer relative overflow-hidden shadow-2xl flex flex-col"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 blur-[100px] -mr-32 -mt-32 rounded-full transition-all duration-1000 group-hover:bg-brand-accent/10"></div>

                                        <div className="flex justify-between items-start mb-10 relative z-10">
                                            <div className="flex-1 pr-4">
                                                <div className="text-xs font-black text-brand-accent uppercase tracking-[0.2em] mb-3 italic">ID: {p.id.slice(-6).toUpperCase()}</div>
                                                <h3 className="text-3xl font-black font-space-grotesk tracking-tighter uppercase italic leading-tight group-hover:text-brand-accent transition-colors mb-4">{p.title}</h3>
                                                <span className={`text-xs px-3 py-1.5 rounded-full font-black uppercase tracking-widest border transition-colors ${(statusConfig[p.status as keyof typeof statusConfig] || statusConfig['Planowanie']).color}`}>
                                                    {(statusConfig[p.status as keyof typeof statusConfig] || statusConfig['Planowanie']).icon} {T(`status.${p.status}`)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-auto space-y-6 relative z-10">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-end text-sm font-black uppercase tracking-widest italic text-white/40">
                                                    <span>{T('dash.progress')}</span>
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
                                                    <span className="text-xs text-white/20 font-black uppercase tracking-widest italic">{T('dash.clickDiscussion')}</span>
                                                </div>
                                                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest group-hover:bg-brand-accent group-hover:border-brand-accent transition-all">
                                                    {T('dash.detailsChat')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Chat & Files Panel */}
                    {selectedProject && (
                        <div className="xl:w-1/2 min-h-[500px] animate-in slide-in-from-right-10 duration-700 flex flex-col gap-8">
                            <ProjectVault projectId={selectedProject.id} isAdmin={false} />

                            <CommentThread
                                parentId={selectedProject.id}
                                title={`${T('dash.discussion')}: ${selectedProject.title}`}
                            />
                        </div>
                    )}
                </div>

                {/* Team Contact (Only show in grid view) */}
                {!selectedProject && (
                    <div className="p-10 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-[28px] bg-brand-accent/20 flex items-center justify-center text-3xl shadow-inner border border-brand-accent/30 group-hover:rotate-12 transition-transform duration-700">💬</div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/30 mb-2 italic">{T('dash.projectManager')}</h4>
                                    <h5 className="text-xl font-black font-space-grotesk uppercase italic tracking-tighter">{T('dash.ecmTeam')}</h5>
                                </div>
                            </div>
                            <button className="px-10 py-5 bg-brand-accent text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all">
                                {T('dash.contactProject')}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* AI Review & Approval Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-white/10 border border-white/20 p-10 rounded-[32px] max-w-lg w-full text-center relative shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 blur-[60px] rounded-full"></div>
                        <h3 className="text-3xl font-black font-space-grotesk italic uppercase tracking-tighter mb-4">Gratulacje! 🥂</h3>
                        <p className="text-white/60 text-sm font-medium mb-8">{T('dash.reviewDesc')}</p>

                        <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setReviewRating(star)}
                                    className={`text-4xl transition-all ${star <= reviewRating ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] scale-110' : 'text-white/20 hover:text-white/50'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder={T('dash.reviewPlaceholder')}
                            className="w-full bg-black/20 border border-white/10 p-4 rounded-2xl text-sm text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none mb-8 resize-none min-h-[100px]"
                        ></textarea>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                            >
                                {T('dash.cancel')}
                            </button>
                            <button
                                onClick={submitReviewAndApprove}
                                disabled={isCompleting}
                                className="flex-1 px-6 py-4 bg-brand-accent text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all flex justify-center items-center"
                            >
                                {isCompleting ? T('dash.approving') : T('dash.pickupBtn')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
