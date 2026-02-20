'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import NotificationCenter from './NotificationCenter';
import VoiceAssistant from './VoiceAssistant';
import { useNotifications } from '@/context/NotificationContext';
import { seedAgencyServices } from '@/lib/seedServices';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
    const { user, loading, logout } = useAuth();
    const { showToast } = useNotifications();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/admin/login');
        }
        if (user) {
            seedAgencyServices();
        }
    }, [user, loading, router]);

    const menuItems = [
        { name: 'Dashboard', icon: '📊', href: '/admin' },
        { name: 'Klienci', icon: '👥', href: '/admin/clients' },
        { name: 'Oferty', icon: '💼', href: '/admin/offers' },
        { name: 'AI Insights', icon: '🤖', href: '/admin/ai-insights' },
        { name: 'Kampanie', icon: '📢', href: '/admin/campaigns' },
        { name: 'Projekty', icon: '📋', href: '/admin/kanban' },
        { name: 'Usługi', icon: '🛠️', href: '/admin/services' },
        { name: 'Kalendarz', icon: '📅', href: '/admin/calendar' },
        { name: 'Ustawienia', icon: '⚙️', href: '/admin/settings' },
    ];

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#070710', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 16, animation: 'pulse 1.5s infinite' }}>⏳</div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Ładowanie...</p>
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
                borderRight: '1px solid rgba(255,255,255,0.08)',
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
                            <span>Agency</span>
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
                <nav style={{ flex: 1, padding: '20px 12px', overflowY: 'auto' }}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 14,
                                    padding: isSidebarOpen ? '14px 18px' : '14px 0',
                                    borderRadius: 16,
                                    marginBottom: 4,
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
                                    <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 4, height: 24, background: '#3b82f6', borderRadius: '0 4px 4px 0', boxShadow: '0 0 12px rgba(59,130,246,0.5)' }} />
                                )}
                                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                                {isSidebarOpen && (
                                    <span style={{ fontSize: 15, fontWeight: 600 }}>{item.name}</span>
                                )}
                            </Link>
                        );
                    })}
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
                        {isSidebarOpen && 'Wyloguj się'}
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
                            Witaj, <span style={{ fontWeight: 800, color: 'white' }}>{displayName}</span>! 👋
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
                        position: 'fixed', bottom: 28, right: 28,
                        width: 56, height: 56, borderRadius: 18,
                        background: '#3b82f6', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 8px 30px rgba(59,130,246,0.4)',
                        fontSize: 24, zIndex: 50,
                    }}
                >
                    🎙️
                </button>

                <VoiceAssistant
                    isOpen={isVoiceAssistantOpen}
                    onClose={() => setIsVoiceAssistantOpen(false)}
                    onActionDetected={(intent, data) => {
                        console.log('Detected Action:', intent, data);
                        showToast(`AI Wykonało Akcję: ${intent}`, 'success');
                    }}
                />
            </main>
        </div>
    );
}
