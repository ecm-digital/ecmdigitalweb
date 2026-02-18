'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { getUserProjects, getUserFiles, getUserStats, getUserCampaigns, UserStats, Campaign } from '@/lib/firestoreService';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import VideoReview from '@/components/VideoReview';
import DashboardCharts from '@/components/DashboardCharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [userProjects, userFiles, userStats, userCampaigns] = await Promise.all([
          getUserProjects(user.uid),
          getUserFiles(user.uid),
          getUserStats(user.uid),
          getUserCampaigns(user.uid)
        ]);

        setProjects(userProjects || []);
        setFiles((userFiles || []).slice(0, 5));
        setStats(userStats);
        setCampaigns(userCampaigns || []);
      } catch (error) {
        console.error("Dashboard data load error:", error);
      }
      setLoading(false);
    };
    loadDashboardData();
  }, [user]);

  const statCards = [
    { label: 'Aktywne Projekty', value: stats?.activeProjects ?? 0, icon: '🎯', color: 'from-blue-500/20 to-cyan-500/20' },
    { label: 'Zrealizowane Zadania', value: stats?.completedTasks ?? 0, icon: '✅', color: 'from-emerald-500/20 to-teal-500/20' },
    { label: 'Miesiące Współpracy', value: stats?.cooperationMonths ?? 0, icon: '🤝', color: 'from-purple-500/20 to-pink-500/20' },
    { label: 'Wartość Inwestycji', value: `${(stats?.investmentValue ?? 0).toLocaleString()} PLN`, icon: '📈', color: 'from-orange-500/20 to-yellow-500/20' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black font-space-grotesk tracking-tighter uppercase italic text-white flex items-center gap-3">
              🚀 Twój Panel ECM
            </h2>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-2">Przegląd strategii i wyników Twojego biznesu</p>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard/offers" className="px-6 py-3 bg-white/5 hover:bg-brand-accent border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              Zobacz Oferty
            </Link>
          </div>
        </div>

        {/* Video Review Section */}
        {!loading && stats?.videoUrl && (
          <VideoReview
            url={stats.videoUrl}
            title={stats.videoTitle}
          />
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white/5 rounded-[32px] animate-pulse border border-white/5"></div>)
          ) : (
            statCards.map((stat, i) => (
              <div key={i} className="bg-[#050508]/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[32px] hover:bg-white/[0.05] transition-all group overflow-hidden relative shadow-2xl">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner mb-6">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-black font-space-grotesk mb-1 tracking-tighter italic text-white">{stat.value}</div>
                  <div className="text-[10px] text-white/30 font-black uppercase tracking-widest">{stat.label}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Visual Analytics Section */}
        {!loading && campaigns.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-8 bg-brand-accent rounded-full"></div>
              <h3 className="text-2xl font-black font-space-grotesk tracking-tighter uppercase italic">Analityka Wizualna</h3>
            </div>
            <DashboardCharts campaigns={campaigns} />
          </div>
        )}

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Active Projects */}
          <div className="lg:col-span-2 bg-[#050508]/40 backdrop-blur-3xl border border-white/5 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 blur-[100px] -mr-32 -mt-32 rounded-full transition-all duration-1000 group-hover:bg-brand-accent/10"></div>

            <div className="flex items-center justify-between mb-12 relative z-10">
              <div>
                <h3 className="text-2xl font-black font-space-grotesk tracking-tighter uppercase italic">Status Projektów</h3>
                <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">Realizacja bieżących celów agencyjnych</p>
              </div>
              <Link href="/dashboard/projects" className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-accent hover:text-white transition-all flex items-center gap-2 group/link">
                Wszystkie <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            {loading ? (
              <div className="space-y-10">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="flex justify-between mb-4">
                      <div className="h-6 w-56 bg-white/10 rounded-xl"></div>
                      <div className="h-4 w-16 bg-white/5 rounded-lg"></div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden"></div>
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20 px-10 bg-white/5 rounded-[32px] border border-white/5 border-dashed relative z-10">
                <div className="text-6xl mb-8 grayscale group-hover:grayscale-0 transition-all duration-1000">📂</div>
                <h4 className="text-lg font-bold tracking-tight text-white/60 mb-2">Baza projektów jest pusta</h4>
                <p className="text-sm text-white/30">Czekamy na rozpoczęcie Twojej pierwszej kampanii z nami.</p>
              </div>
            ) : (
              <div className="space-y-12 relative z-10">
                {projects.map((project) => (
                  <div key={project.id} className="group/item cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: project.color, color: project.color }}></div>
                        <span className="font-bold tracking-tight text-xl group-hover/item:text-brand-accent transition-colors italic uppercase font-space-grotesk">{project.title}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30 group-hover/item:text-white transition-colors">{project.progress}% completed</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                      <div
                        className="h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.1)] relative"
                        style={{ width: `${project.progress}%`, backgroundColor: project.color }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side Info & Files */}
          <div className="space-y-10">
            {/* VIP CTA */}
            <div className="bg-gradient-to-br from-brand-accent/30 via-purple-600/30 to-blue-600/30 backdrop-blur-3xl border border-white/20 p-10 rounded-[48px] relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-all duration-1000"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-black font-space-grotesk uppercase italic mb-3 tracking-tighter">Opiekun Premium</h3>
                <p className="text-[12px] text-white/60 leading-relaxed font-medium mb-10">Twój dedykowany ekspert jest gotowy do wsparcia Twoich celów biznesowych 24/7.</p>
                <button className="w-full bg-white text-black font-black py-5 rounded-[24px] hover:bg-black hover:text-white transition-all duration-500 shadow-2xl text-[10px] tracking-[0.2em] uppercase">
                  Napisz do Opiekuna
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-1000 select-none pointer-events-none">🛡️</div>
            </div>

            {/* Recent Resources */}
            <div className="bg-[#050508]/40 backdrop-blur-3xl border border-white/5 p-10 rounded-[48px] shadow-2xl group">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black font-space-grotesk uppercase italic tracking-tighter">Zasoby</h3>
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{files.length} ITEMS</span>
              </div>

              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-5 p-4 animate-pulse">
                      <div className="w-14 h-14 rounded-2xl bg-white/5"></div>
                      <div className="flex-1">
                        <div className="h-4 w-32 bg-white/10 rounded-lg mb-2"></div>
                        <div className="h-3 w-16 bg-white/5 rounded-lg"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-12 opacity-20 group-hover:opacity-40 transition-all duration-700">
                  <div className="text-5xl mb-6">📁</div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em]">Brak Udostępnionych Plików</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-5 rounded-3xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5 group/file relative overflow-hidden">
                      <div className="flex items-center gap-5 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-[#0a0a0f] flex items-center justify-center text-[10px] font-black text-brand-accent border border-white/5 shadow-inner group-hover/file:scale-110 transition-transform">
                          {file.type ? file.type.toUpperCase() : 'PDF'}
                        </div>
                        <div>
                          <div className="text-sm font-bold truncate max-w-[130px] tracking-tight text-white/80 group-hover/file:text-white transition-colors">{file.name}</div>
                          <div className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-1">{file.size} · {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString('pl-PL') : 'FILE'}</div>
                        </div>
                      </div>
                      <button className="w-10 h-10 flex items-center justify-center opacity-0 group-hover/file:opacity-100 bg-white/5 rounded-xl hover:bg-brand-accent hover:text-white transition-all transform hover:scale-110 z-10">
                        <span className="text-xs">⬇️</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
