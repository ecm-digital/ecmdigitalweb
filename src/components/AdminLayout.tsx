'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import NotificationCenter from './NotificationCenter';
import AdminAIAssistant from './AdminAIAssistant';
import { useNotifications } from '@/context/NotificationContext';
import { useLanguage } from '@/context/LanguageContext';
import { seedAgencyServices } from '@/lib/seedServices';
import { seedCaseStudies } from '@/lib/firestoreService';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
    const { user, loading, logout } = useAuth();
    const { showToast } = useNotifications();
    const { T } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/admin/login');
        }
        if (user) {
            seedAgencyServices();
            seedCaseStudies();
        }
    }, [user, loading, router]);

    const menuGroups = [
        {
            label: null,
            items: [
                { name: T('admin.nav.dashboard'), icon: '📊', href: '/admin' },
            ],
        },
        {
            label: 'CRM & Sprzedaż',
            items: [
                { name: T('admin.nav.clients'), icon: '👥', href: '/admin/clients' },
                { name: T('admin.nav.projects'), icon: '🚀', href: '/admin/client-projects' },
                { name: T('admin.nav.offers'), icon: '💼', href: '/admin/offers' },
                { name: T('admin.nav.calendar'), icon: '📅', href: '/admin/calendar' },
            ],
        },
        {
            label: 'Marketing',
            items: [
                { name: T('admin.nav.campaigns'), icon: '📢', href: '/admin/campaigns' },
                { name: T('admin.nav.cases'), icon: '🏆', href: '/admin/cases' },
                { name: T('admin.nav.services'), icon: '🛠️', href: '/admin/services' },
                { name: 'Opinie klientów', icon: '⭐', href: '/admin/testimonials' },
                { name: 'Posty blogowe', icon: '📝', href: '/admin/blog-posts' },
            ],
        },
        {
            label: 'AI & Automatyzacja',
            items: [
                { name: T('admin.nav.aiInsights'), icon: '🤖', href: '/admin/ai-insights' },
                { name: T('admin.nav.contextOs'), icon: '🧠', href: '/admin/context-os' },
                { name: T('admin.nav.meetingAi'), icon: '🗣️', href: '/admin/meeting-intelligence' },
                { name: T('admin.nav.marketAnalysis'), icon: '📈', href: '/admin/market-analysis' },
                { name: T('admin.nav.aiosLogs'), icon: '🪵', href: '/admin/aios-logs' },
            ],
        },
        {
            label: 'Operacje',
            items: [
                { name: T('admin.nav.tasks'), icon: '📋', href: '/admin/kanban' },
                { name: T('admin.nav.support'), icon: '🎟️', href: '/admin/support' },
            ],
        },
        {
            label: 'Sales & Analytics',
            items: [
                { name: '⭐ Lead Scoring', icon: '⭐', href: '/admin/lead-scoring' },
            ],
        },
        {
            label: 'Guides & Resources',
            items: [
                { name: '📚 Setup Guides', icon: '📚', href: '/admin/guides' },
            ],
        },
        {
            label: null,
            items: [
                { name: T('admin.nav.settings'), icon: '⚙️', href: '/admin/settings' },
            ],
        },
    ];

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#070710', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 16, animation: 'pulse 1.5s infinite' }}>⏳</div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{T('admin.loading')}</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const displayName = user.displayName || user.email?.split('@')[0] || 'Admin';
    const initials = displayName.charAt(0).toUpperCase();

    const handleLogout = async () => {
        await logout();
        router.push('/admin/login');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#070710', color: 'white', display: 'flex', fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif' }}>
            {/* Sidebar */}
            <aside style={{
                width: isSidebarOpen ? 280 : 80,
                background: 'rgba(255,255,255,0.025)',
                borderInlineEnd: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.3s ease',
                flexShrink: 0,
                position: 'relative',
                zIndex: 40,
            }}>
                {/* Logo + Toggle */}
                <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {isSidebarOpen && (
                        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em' }}>
                            <span style={{ color: '#3b82f6' }}>ECM</span>
                            <span>Admin v3</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        style={{
                            width: 32, height: 32, borderRadius: 10,
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                        }}
                    >
                        {isSidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
                    {menuGroups.map((group, gi) => (
                        <div key={gi} style={{ marginBottom: 8 }}>
                            {group.label && isSidebarOpen && (
                                <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '10px 18px 6px' }}>
                                    {group.label}
                                </div>
                            )}
                            {group.label && !isSidebarOpen && gi > 0 && (
                                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 16px' }} />
                            )}
                            {group.items.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 14,
                                            padding: isSidebarOpen ? '11px 18px' : '11px 0',
                                            borderRadius: 14,
                                            marginBottom: 2,
                                            textDecoration: 'none',
                                            color: isActive ? 'white' : 'rgba(255,255,255,0.45)',
                                            background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                                            border: isActive ? '1px solid rgba(59,130,246,0.25)' : '1px solid transparent',
                                            transition: 'all 0.2s',
                                            justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        {isActive && (
                                            <div style={{ position: 'absolute', insetInlineStart: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, background: '#3b82f6', borderRadius: '0 4px 4px 0', boxShadow: '0 0 10px rgba(59,130,246,0.5)' }} />
                                        )}
                                        <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                                        {isSidebarOpen && (
                                            <span style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Logout */}
                <div style={{ padding: '16px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            width: '100%', padding: '12px 14px', borderRadius: 14,
                            border: 'none', background: 'transparent',
                            color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                            fontSize: 14, fontWeight: 600,
                            justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                        }}
                    >
                        <span style={{ fontSize: 18 }}>🚪</span>
                        {isSidebarOpen && T('admin.logout')}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {/* Header */}
                <header style={{
                    height: 72,
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(7,7,16,0.85)',
                    backdropFilter: 'blur(12px)',
                    position: 'sticky', top: 0, zIndex: 30,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 36px',
                }}>
                    <div>
                        <p style={{ fontSize: 17, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                            {T('admin.welcome')}, <span style={{ fontWeight: 800, color: 'white' }}>{displayName}</span>! 👋
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ position: 'relative' }}>
                            <NotificationCenter />
                        </div>

                        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{displayName}</div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{user.email?.split('@')[0]}</div>
                            </div>
                            <div style={{
                                width: 44, height: 44, borderRadius: 14,
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 900, fontSize: 18, color: 'white',
                                boxShadow: '0 4px 15px rgba(59,130,246,0.3)',
                            }}>
                                {initials}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ padding: '32px 36px', flex: 1 }}>
                    {children}
                </div>

                {/* Floating AI Button */}
                <button
                    onClick={() => setIsVoiceAssistantOpen(true)}
                    style={{
                        position: 'fixed', bottom: 28, insetInlineEnd: 28,
                        width: 56, height: 56, borderRadius: 18,
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 8px 30px rgba(59,130,246,0.4)',
                        fontSize: 24, zIndex: 50,
                    }}
                >
                    🤖
                </button>

                <AdminAIAssistant
                    isOpen={isVoiceAssistantOpen}
                    onClose={() => setIsVoiceAssistantOpen(false)}
                    onActionDetected={(intent, data) => {
                        console.log('Admin AI Action:', intent, data);
                        showToast(`AI: ${intent}`, 'success');
                    }}
                />
            </main>
        </div>
    );
}
