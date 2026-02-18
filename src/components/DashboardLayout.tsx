'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import '@/app/portal.css';

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
            <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-accent/10 border-t-brand-accent rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Inicjalizacja portalu...</p>
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
        <div className="min-h-screen bg-[#fbfbfb] text-gray-900 font-inter flex overflow-hidden selection:bg-brand-accent/10">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-accent/[0.03] blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-purple-600/[0.02] blur-[100px] rounded-full" />
            </div>

            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-white/80 backdrop-blur-3xl border-r border-black/[0.03] transition-all duration-500 flex flex-col z-20 relative`}
            >
                <div className="p-8 flex items-center justify-between">
                    {isSidebarOpen ? (
                        <div className="text-xl font-black font-space-grotesk tracking-tighter text-gray-900 uppercase italic">
                            ECM<span className="text-brand-accent">Portal</span>
                        </div>
                    ) : (
                        <div className="w-full flex justify-center">
                            <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center font-black text-xs italic">E</div>
                        </div>
                    )}
                </div>

                <nav className="flex-1 px-4 mt-8 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center p-4 rounded-2xl transition-all duration-300 group relative ${isActive
                                    ? 'bg-white border border-black/[0.03] text-gray-900 shadow-xl shadow-black/[0.03]'
                                    : 'text-gray-400 hover:text-gray-900 hover:bg-black/[0.02]'
                                    }`}
                            >
                                <span className={`text-xl transition-all duration-500 ${isSidebarOpen ? 'mr-4' : 'mx-auto'} ${isActive ? 'scale-110 grayscale-0' : 'grayscale group-hover:grayscale-0 group-hover:scale-110'}`}>
                                    {item.icon}
                                </span>
                                {isSidebarOpen && (
                                    <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
                                )}
                                {isActive && (
                                    <div className="absolute left-0 w-1 h-6 bg-brand-accent rounded-r-full shadow-[0_0_10px_#8b5cf6]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-8 border-t border-black/[0.03] space-y-4">
                    <button onClick={handleLogout} className="flex items-center p-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-all w-full group">
                        <span className={`transition-transform duration-300 group-hover:translate-x-1 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`}>🚪</span>
                        {isSidebarOpen && 'Wyloguj Się'}
                    </button>
                    <Link href="/" className="flex items-center p-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all w-full group">
                        <span className={`transition-transform duration-300 group-hover:-translate-x-1 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`}>🔙</span>
                        {isSidebarOpen && 'Strona Główna'}
                    </Link>
                </div>

                {/* Sidebar Toggle */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-24 w-6 h-6 bg-white border border-black/[0.03] backdrop-blur-xl rounded-full flex items-center justify-center text-[10px] hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all animate-in fade-in zoom-in duration-500 shadow-lg"
                >
                    {isSidebarOpen ? '❮' : '❯'}
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
                <header className="h-20 border-b border-black/[0.03] bg-white/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-10">
                    <div>
                        <h1 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Partner Hub</h1>
                        <p className="text-sm font-bold tracking-tight mt-0.5">Witaj, <span className="text-brand-accent">{displayName}</span> 👋</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="w-12 h-12 rounded-2xl bg-white border border-black/[0.03] flex items-center justify-center hover:bg-gray-50 transition-all relative group shadow-sm">
                            <span className="text-xl group-hover:scale-110 transition-transform">🔔</span>
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-brand-accent rounded-full border-2 border-white shadow-[0_0_10px_rgba(233,69,96,0.3)]"></span>
                        </button>

                        <div className="flex items-center gap-4 pl-6 border-l border-black/[0.03]">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-black tracking-tight leading-none uppercase italic text-gray-900">{displayName}</div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Status: Klient B2B</div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-accent via-rose-500 to-amber-500 border border-white/10 flex items-center justify-center font-black italic text-lg shadow-lg shadow-brand-accent/20 transform hover:rotate-3 transition-all cursor-pointer text-white">
                                {initials}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
