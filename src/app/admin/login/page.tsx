'use client';

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import '@/app/portal.css';

export default function AdminLoginPage() {
    const { login, loginWithGoogle } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            router.push('/admin');
        } catch (err: any) {
            const code = err?.code || '';
            if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
                setError('Nieprawidłowy e-mail lub hasło.');
            } else {
                setError('Wystąpił błąd. Spróbuj ponownie.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError('');
        setLoading(true);
        console.log('Initiating Google Login...');
        try {
            await loginWithGoogle();
            console.log('Google Login success, redirecting to /admin');
            router.push('/admin');
        } catch (err: any) {
            console.error('Google Login Error:', err);
            const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
            if (err.code === 'auth/account-exists-with-different-credential') {
                setError('To konto e-mail jest już powiązane z loginem hasło/e-mail. Zaloguj się tradycyjnie lub połącz konta w ustawieniach.');
            } else {
                setError(`Logowanie Google nieudane: ${err.code} (Domena: ${hostname}). Sprawdź konsolę.`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050510] relative overflow-hidden p-6">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-150px] right-[-100px] w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[-120px] left-[-100px] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-[440px] relative z-10 animate-fade-in">
                {/* Login Card */}
                <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 md:p-12 shadow-2xl relative overflow-hidden group">
                    {/* Subtle Top Light Glow */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {/* Admin Badge */}
                    <div className="flex justify-center mb-8">
                        <span className="px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-[10px] font-bold text-brand-accent uppercase tracking-widest">
                            🔒 Panel Administracyjny
                        </span>
                    </div>

                    {/* Logo Section */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black font-space-grotesk tracking-tighter text-white">
                            ECM<span className="text-brand-accent">Agency</span>
                        </h1>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-3">
                            Zarządzanie agencją • CRM • Projekty
                        </p>
                    </div>

                    {/* Google Sign-In */}
                    <button
                        onClick={handleGoogle}
                        disabled={loading}
                        className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-3 group/btn disabled:opacity-50"
                    >
                        <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        <span className="text-sm font-bold text-white/90">Zaloguj przez Google</span>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">lub e-mail</span>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2.5 ml-1">
                                E-mail służbowy
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder="osoba@ecm-digital.com"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-accent/50 focus:bg-white/[0.08] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2.5 ml-1">
                                Klucz dostępu
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                minLength={6}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-accent/50 focus:bg-white/[0.08] transition-all"
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                <p className="text-red-400 text-xs font-bold text-center leading-relaxed">
                                    {error}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 rounded-2xl bg-gradient-to-br from-brand-accent to-purple-700 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-accent/20 hover:shadow-brand-accent/40 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {loading ? '⏳ Autoryzacja...' : '🔐 Uzyskaj dostęp'}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-10 text-center">
                        <a href="/" className="text-[10px] font-bold text-white/20 hover:text-white/40 uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                            <span>←</span> powrót do serwisu
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
