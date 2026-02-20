'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const menuItems = [
        { name: 'Podsumowanie', icon: '📊', href: '/dashboard' },
        { name: 'Moje Oferty', icon: '📜', href: '/dashboard/offers' },
        { name: 'Projekty', icon: '🎯', href: '/dashboard/projects' },
        { name: 'Kampanie', icon: '🚀', href: '/dashboard/campaigns' },
        { name: 'Baza Wiedzy', icon: '📁', href: '/dashboard/resources' },
    ];

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#080810', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, border: '4px solid rgba(59,130,246,0.2)', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Ładowanie portalu...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const displayName = user?.displayName || user?.email?.split('@')[0] || 'Klient';
    const initials = displayName.charAt(0).toUpperCase();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#080810', color: 'white', display: 'flex', fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif' }}>
            {/* Sidebar */}
            <aside style={{
                width: isSidebarOpen ? 280 : 80,
                background: 'rgba(255,255,255,0.03)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.3s ease',
                flexShrink: 0,
                position: 'relative',
            }}>
                {/* Logo */}
                <div style={{ padding: '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {isSidebarOpen ? (
                        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em' }}>
                            ECM<span style={{ color: '#3b82f6' }}>Portal</span>
                        </div>
                    ) : (
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, margin: '0 auto' }}>E</div>
                    )}
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '20px 12px' }}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: isSidebarOpen ? '14px 16px' : '14px 0',
                                    borderRadius: 14,
                                    marginBottom: 4,
                                    textDecoration: 'none',
                                    color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                                    background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                                    border: isActive ? '1px solid rgba(59,130,246,0.25)' : '1px solid transparent',
                                    transition: 'all 0.2s',
                                    justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                                }}
                            >
                                <span style={{ fontSize: 22, marginRight: isSidebarOpen ? 14 : 0, flexShrink: 0 }}>{item.icon}</span>
                                {isSidebarOpen && (
                                    <span style={{ fontSize: 15, fontWeight: 600 }}>{item.name}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div style={{ padding: '20px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', width: '100%',
                            padding: '12px 14px', borderRadius: 12, border: 'none', background: 'transparent',
                            color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                            justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                        }}
                    >
                        <span style={{ fontSize: 18, marginRight: isSidebarOpen ? 10 : 0 }}>🚪</span>
                        {isSidebarOpen && 'Wyloguj się'}
                    </button>
                    <Link
                        href="/"
                        style={{
                            display: 'flex', alignItems: 'center', width: '100%',
                            padding: '12px 14px', borderRadius: 12, textDecoration: 'none',
                            color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 600,
                            justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                        }}
                    >
                        <span style={{ fontSize: 18, marginRight: isSidebarOpen ? 10 : 0 }}>🏠</span>
                        {isSidebarOpen && 'Strona główna'}
                    </Link>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    style={{
                        position: 'absolute', right: -14, top: 80,
                        width: 28, height: 28, borderRadius: '50%',
                        background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.15)',
                        color: 'white', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 12,
                        zIndex: 10,
                    }}
                >
                    {isSidebarOpen ? '◀' : '▶'}
                </button>
            </aside>

            {/* Main Area */}
            <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {/* Top Header Bar */}
                <header style={{
                    height: 72,
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(8,8,16,0.8)',
                    backdropFilter: 'blur(12px)',
                    position: 'sticky', top: 0, zIndex: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 40px',
                }}>
                    <div>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 2 }}>Partner Hub</p>
                        <p style={{ fontSize: 17, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                            Witaj, <span style={{ color: '#3b82f6' }}>{displayName}</span> 👋
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 14,
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                            cursor: 'pointer', position: 'relative',
                        }}>
                            🔔
                            <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: '#3b82f6', borderRadius: '50%', border: '2px solid #080810' }} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 20, borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{displayName}</div>
                                <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600 }}>Klient B2B</div>
                            </div>
                            <div style={{
                                width: 44, height: 44, borderRadius: 14,
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
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
                <div style={{ padding: '36px 40px', maxWidth: 1400, width: '100%', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
