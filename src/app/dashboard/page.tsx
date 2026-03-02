'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { getUserProjects, getUserFiles, getUserStats, getUserCampaigns, UserStats, Campaign } from '@/lib/firestoreService';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import VideoReview from '@/components/VideoReview';
import DashboardCharts from '@/components/DashboardCharts';
import { useLanguage } from '@/context/LanguageContext';

/* ---- Shared inline style helpers ---- */
const card = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 24,
  padding: 32,
  transition: 'background 0.25s',
} as const;

const label = {
  fontSize: 13,
  fontWeight: 700 as const,
  color: 'rgba(255,255,255,0.45)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { T } = useLanguage();
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
    { label: T('dash.activeProjects'), value: stats?.activeProjects ?? 0, icon: '🎯', accent: '#3b82f6' },
    { label: T('dash.completedTasks'), value: stats?.completedTasks ?? 0, icon: '✅', accent: '#10b981' },
    { label: T('dash.cooperationMonths'), value: stats?.cooperationMonths ?? 0, icon: '🤝', accent: '#8b5cf6' },
    { label: T('dash.investmentValue'), value: `${(stats?.investmentValue ?? 0).toLocaleString()} PLN`, icon: '📈', accent: '#f59e0b' },
  ];

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

        {/* ═══ Page Header ═══ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>
              {T('dash.panel')}
            </h2>
            <p style={{ ...label, marginTop: 8 }}>{T('dash.overview')}</p>
          </div>
          <Link
            href="/dashboard/offers"
            style={{
              padding: '12px 28px', borderRadius: 14,
              background: '#3b82f6', color: 'white', fontWeight: 700,
              fontSize: 14, textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(59,130,246,0.35)',
            }}
          >
            {T('dash.seeOffers')}
          </Link>
        </div>

        {/* ═══ Video Review ═══ */}
        {!loading && stats?.videoUrl && (
          <VideoReview url={stats.videoUrl} title={stats.videoTitle} />
        )}

        {/* ═══ Stats Grid ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {loading
            ? [1, 2, 3, 4].map(i => (
              <div key={i} style={{ ...card, height: 160, opacity: 0.4 }} />
            ))
            : statCards.map((stat, i) => (
              <div key={i} style={{ ...card, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', top: -20, right: -20,
                  width: 80, height: 80, borderRadius: '50%',
                  background: stat.accent, opacity: 0.08, filter: 'blur(25px)',
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, marginBottom: 20,
                  }}>
                    {stat.icon}
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6, color: 'white' }}>
                    {stat.value}
                  </div>
                  <div style={label}>{stat.label}</div>
                </div>
              </div>
            ))
          }
        </div>

        {/* ═══ Visual Analytics ═══ */}
        {!loading && campaigns.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 4, height: 28, background: '#3b82f6', borderRadius: 4 }} />
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{T('dash.analytics')}</h3>
            </div>
            <DashboardCharts campaigns={campaigns} />
          </div>
        )}

        {/* ═══ Content Grid (Projects + Side) ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28, alignItems: 'start' }}>

          {/* ─── Projects Panel ─── */}
          <div style={{ ...card, padding: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div>
                <h3 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{T('dash.projectStatus')}</h3>
                <p style={{ ...label, marginTop: 6 }}>{T('dash.projectDesc')}</p>
              </div>
              <Link href="/dashboard/projects" style={{ fontSize: 14, fontWeight: 700, color: '#3b82f6', textDecoration: 'none' }}>
                {T('dash.viewAll')}
              </Link>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ height: 48, background: 'rgba(255,255,255,0.05)', borderRadius: 12, opacity: 0.5 }} />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px dashed rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
                <h4 style={{ fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{T('dash.emptyProjects')}</h4>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)' }}>{T('dash.emptyProjectsDesc')}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {projects.map((project) => (
                  <div key={project.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: project.color, boxShadow: `0 0 8px ${project.color}` }} />
                        <span style={{ fontSize: 17, fontWeight: 700, color: 'white' }}>{project.title}</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{project.progress}%</span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 8,
                        background: `linear-gradient(90deg, ${project.color}, ${project.color}aa)`,
                        width: `${project.progress}%`,
                        transition: 'width 0.8s ease',
                        boxShadow: `0 0 12px ${project.color}40`,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── Right Sidebar ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* VIP CTA */}
            <div style={{
              ...card,
              background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
              border: '1px solid rgba(59,130,246,0.25)',
            }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, margin: 0 }}>{T('dash.premiumCare')}</h3>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: '12px 0 24px' }}>
                {T('dash.premiumDesc')}
              </p>
              <button style={{
                width: '100%', padding: '16px 0',
                background: 'white', color: '#080810',
                fontWeight: 800, fontSize: 14, borderRadius: 16,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(255,255,255,0.15)',
                letterSpacing: '0.04em',
              }}>
                {T('dash.writeManager')}
              </button>
            </div>

            {/* Resources Preview */}
            <div style={{ ...card }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{T('dash.resources')}</h3>
                <span style={{ ...label, fontSize: 12 }}>{files.length} {T('dash.filesCount')}</span>
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ height: 56, background: 'rgba(255,255,255,0.04)', borderRadius: 12 }} />
                  ))}
                </div>
              ) : files.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 16px', opacity: 0.3 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{T('dash.noFiles')}</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {files.map((file) => (
                    <div key={file.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px', borderRadius: 14,
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 42, height: 42, borderRadius: 12,
                          background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 800, color: '#3b82f6',
                        }}>
                          {file.type ? file.type.toUpperCase() : 'PDF'}
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{file.name}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                            {file.size} · {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString('pl-PL') : '—'}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 18, cursor: 'pointer' }}>⬇️</span>
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
