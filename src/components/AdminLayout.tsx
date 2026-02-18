'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import NotificationCenter from './NotificationCenter';
import VoiceAssistant from './VoiceAssistant';
import { useNotifications } from '@/context/NotificationContext';
import '@/app/portal.css';

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
    }, [user, loading, router]);

    const menuItems = [
        { name: 'Dashboard', icon: '📊', href: '/admin' },
        { name: 'Klienci', icon: '👥', href: '/admin/clients' },
        { name: 'Oferty', icon: '💼', href: '/admin/offers' },
        { name: 'AI Insights', icon: '🤖', href: '/admin/ai-insights' },
        { name: 'Kampanie', icon: '📢', href: '/admin/campaigns' },
        { name: 'Projekty', icon: '📋', href: '/admin/kanban' },
        { name: 'Kalendarz', icon: '📅', href: '/admin/calendar' },
        { name: 'Ustawienia', icon: '⚙️', href: '/admin/settings' },
    ];

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#050505', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '16px', animation: 'pulse 1.5s infinite' }}>⏳</div>
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>Ładowanie...</p>
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
        <div className="min-h-screen bg-[#020202] text-white flex overflow-hidden font-inter selection:bg-brand-accent/30">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-[#0a0a0a]/40 backdrop-blur-3xl border-r border-white/5 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col flex-shrink-0 z-40`}
            >
                <div className="p-8 flex items-center justify-between">
                    {isSidebarOpen && (
                        <div className="text-xl font-black font-space-grotesk tracking-tighter">
                            <span className="text-brand-accent">ECM</span>
                            <span className="text-white">Agency</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-xs text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                        {isSidebarOpen ? '❮' : '❯'}
                    </button>
                </div>

                <nav className="flex-1 px-5 mt-10 space-y-2.5 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    flex items-center gap-4 px-5 py-4 rounded-[22px] transition-all duration-500 group relative overflow-hidden
                                    ${isActive ? 'bg-white/5 border border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]' : 'hover:bg-white/[0.03] border border-transparent'}
                                `}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-brand-accent rounded-r-full shadow-[0_0_20px_rgba(233,69,96,0.6)]" />
                                )}
                                <span className={`text-2xl ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(233,69,96,0.3)]' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110'} transition-all duration-500`}>
                                    {item.icon}
                                </span>
                                {isSidebarOpen && (
                                    <span className={`
                                        text-[14px] font-bold tracking-tight transition-colors duration-500
                                        ${isActive ? 'text-white' : 'text-white/30 group-hover:text-white/70'}
                                    `}>
                                        {item.name}
                                    </span>
                                )}
                                {!isSidebarOpen && isActive && (
                                    <div className="absolute right-3 w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_12px_rgba(233,69,96,0.8)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-4 py-3 w-full rounded-2xl text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all text-xs font-bold uppercase tracking-widest group"
                    >
                        <span className="text-lg grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100">🚪</span>
                        {isSidebarOpen && 'Wyloguj Się'}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto relative bg-[#020202] flex flex-col">
                {/* Background Glows */}
                <div className="fixed top-[-10%] right-[-5%] w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[180px] -z-10 pointer-events-none animate-pulse-slow" />
                <div className="fixed bottom-[-5%] left-[280px] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

                <header className="h-24 border-b border-white/5 bg-[#020202]/40 backdrop-blur-2xl sticky top-0 z-30 flex items-center justify-between px-12">
                    <div className="animate-fade-in translate-y-[-2px]">
                        <h2 className="text-sm font-medium text-white/40 tracking-tight">
                            Witaj z powrotem, <span className="text-white font-black tracking-tighter font-space-grotesk text-lg uppercase">{displayName}</span>! 👋
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <NotificationCenter />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-brand-accent rounded-full border-2 border-[#050505] animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                        </div>

                        <div className="h-8 w-px bg-white/5 mx-2" />

                        <div className="flex items-center gap-4 pl-4 group cursor-pointer">
                            <div className="text-right hidden sm:block transition-all transform group-hover:-translate-x-1">
                                <div className="text-[13px] font-black tracking-tight text-white/90">{displayName}</div>
                                <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{user.email?.split('@')[0]}</div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-accent to-indigo-600 p-[1px] shadow-lg shadow-brand-accent/10 group-hover:shadow-brand-accent/20 transition-all">
                                <div className="w-full h-full rounded-[15px] bg-[#0a0a0a] flex items-center justify-center font-black text-white text-sm">
                                    {initials}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10 relative z-10">
                    {children}
                </div>

                {/* Floating AI Assistant Trigger */}
                <button
                    onClick={() => setIsVoiceAssistantOpen(true)}
                    className="fixed bottom-8 right-8 w-16 h-16 rounded-2xl bg-brand-accent text-white flex items-center justify-center shadow-2xl shadow-brand-accent/40 hover:scale-110 active:scale-95 transition-all z-50 group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-2xl group-hover:rotate-12 transition-transform">🎙️</span>
                </button>

                <VoiceAssistant
                    isOpen={isVoiceAssistantOpen}
                    onClose={() => setIsVoiceAssistantOpen(false)}
                    onActionDetected={(intent, data) => {
                        console.log('Detected Action:', intent, data);
                        showToast(`AI Wykonało Akcję: ${intent}`, 'success');
                        // In next steps we'll link this to real Firebase actions
                    }}
                />
            </main>
        </div>
    );
}
