'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

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
        try {
            await loginWithGoogle();
            router.push('/admin');
        } catch (err: any) {
            const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
            if (err.code === 'auth/account-exists-with-different-credential') {
                setError('To konto e-mail jest już powiązane z loginem hasło/e-mail. Zaloguj się tradycyjnie lub połącz konta w ustawieniach.');
            } else {
                setError(`Logowanie Google nieudane: ${err.code} (Domena: ${hostname}).`);
            }
        } finally {
            setLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 16,
        padding: '16px 20px',
        fontSize: 15,
        color: 'white',
        outline: 'none',
        transition: 'all 0.2s',
        fontFamily: 'inherit',
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#070710',
            position: 'relative',
            overflow: 'hidden',
            padding: 24,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
        }}>
            {/* Background glow effects */}
            <div style={{
                position: 'absolute', top: -150, right: -100,
                width: 600, height: 600, borderRadius: '50%',
                background: 'rgba(59,130,246,0.08)',
                filter: 'blur(120px)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: -120, left: -100,
                width: 500, height: 500, borderRadius: '50%',
                background: 'rgba(139,92,246,0.06)',
                filter: 'blur(100px)', pointerEvents: 'none',
            }} />

            {/* Login Card */}
            <div style={{
                width: '100%',
                maxWidth: 460,
                position: 'relative',
                zIndex: 10,
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 32,
                    padding: '48px 40px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Top line glow */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                    }} />

                    {/* Admin badge */}
                    <div style={{ textAlign: 'center', marginBottom: 28 }}>
                        <span style={{
                            display: 'inline-block',
                            padding: '8px 18px',
                            borderRadius: 999,
                            background: 'rgba(59,130,246,0.1)',
                            border: '1px solid rgba(59,130,246,0.2)',
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#3b82f6',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase' as const,
                        }}>
                            🔒 Panel Administracyjny
                        </span>
                    </div>

                    {/* Logo */}
                    <div style={{ textAlign: 'center', marginBottom: 36 }}>
                        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.03em', margin: 0, color: 'white' }}>
                            ECM<span style={{ color: '#3b82f6' }}>Agency</span>
                        </h1>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: 10, letterSpacing: '0.05em' }}>
                            Zarządzanie agencją • CRM • Projekty
                        </p>
                    </div>

                    {/* Google Sign-In */}
                    <button
                        onClick={handleGoogle}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '16px 24px',
                            borderRadius: 16,
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            color: 'white',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 12,
                            fontSize: 15,
                            fontWeight: 700,
                            transition: 'all 0.2s',
                            opacity: loading ? 0.5 : 1,
                            fontFamily: 'inherit',
                        }}
                    >
                        <svg width={20} height={20} viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        Zaloguj przez Google
                    </button>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '28px 0' }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>lub e-mail</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label style={{
                                display: 'block', fontSize: 12, fontWeight: 700,
                                color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
                                letterSpacing: '0.08em', marginBottom: 8, paddingLeft: 4,
                            }}>
                                E-mail służbowy
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder="osoba@ecm-digital.com"
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block', fontSize: 12, fontWeight: 700,
                                color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
                                letterSpacing: '0.08em', marginBottom: 8, paddingLeft: 4,
                            }}>
                                Klucz dostępu
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                minLength={6}
                                style={inputStyle}
                            />
                        </div>

                        {error && (
                            <div style={{
                                padding: '14px 18px',
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.2)',
                                borderRadius: 14,
                            }}>
                                <p style={{ fontSize: 13, color: '#f87171', fontWeight: 600, textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
                                    {error}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '18px 0',
                                borderRadius: 16,
                                background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                                color: 'white',
                                fontWeight: 800,
                                fontSize: 15,
                                letterSpacing: '0.04em',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: '0 8px 30px rgba(59,130,246,0.3)',
                                opacity: loading ? 0.6 : 1,
                                transition: 'all 0.2s',
                                fontFamily: 'inherit',
                            }}
                        >
                            {loading ? '⏳ Autoryzacja...' : '🔐 Uzyskaj dostęp'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div style={{ marginTop: 32, textAlign: 'center' }}>
                        <a
                            href="/"
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: 'rgba(255,255,255,0.3)',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                transition: 'color 0.2s',
                            }}
                        >
                            ← Powrót do serwisu
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
