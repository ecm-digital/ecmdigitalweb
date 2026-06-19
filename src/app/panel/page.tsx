'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
    const { user, login, register, loginWithGoogle } = useAuth();
    const { T } = useLanguage();
    const router = useRouter();
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    React.useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isRegister) {
                await register(email, password, name);
            } else {
                await login(email, password);
            }
            router.push('/dashboard');
        } catch (err: any) {
            const code = err?.code || '';
            if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
                setError(T('login.errInvalid'));
            } else if (code === 'auth/email-already-in-use') {
                setError(T('login.errExists'));
            } else if (code === 'auth/weak-password') {
                setError(T('login.errWeak'));
            } else {
                setError(T('login.errGeneric'));
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
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Google Auth UI Error:', err);
            setError(`${T('login.errGoogle')} (${err.code || 'Error'}).`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Ambient shapes */}
            <div style={{
                position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(233,69,96,0.15) 0%, transparent 70%)',
                top: '-100px', right: '-100px', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
                bottom: '-80px', left: '-80px', pointerEvents: 'none',
            }} />

            <div style={{
                width: '100%',
                maxWidth: '440px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '32px',
                padding: '48px 40px',
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <a href="/" style={{ textDecoration: 'none', fontSize: '1.8rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
                        ECM<span style={{ color: 'var(--brand-accent, #e94560)' }}>Digital</span>
                    </a>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '8px' }}>
                        {isRegister ? T('login.createAccount') : T('login.clientPanel')}
                    </p>
                </div>

                {/* Google Sign-In */}
                <button
                    onClick={handleGoogle}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'white',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        transition: 'all 0.3s ease',
                        marginBottom: '24px',
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    {T('login.google')}
                </button>

                {/* Divider */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px',
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>{T('login.or')}</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 500 }}>
                                {T('login.name')}
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                placeholder="Jan Kowalski"
                                style={{
                                    width: '100%', padding: '14px 16px', borderRadius: '14px',
                                    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
                                    color: 'white', fontSize: '0.95rem', outline: 'none',
                                    transition: 'border-color 0.2s', boxSizing: 'border-box',
                                }}
                            />
                        </div>
                    )}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 500 }}>
                            {T('login.email')}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="jan@firma.pl"
                            style={{
                                width: '100%', padding: '14px 16px', borderRadius: '14px',
                                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
                                color: 'white', fontSize: '0.95rem', outline: 'none',
                                transition: 'border-color 0.2s', boxSizing: 'border-box',
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 500 }}>
                            {T('login.password')}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            minLength={6}
                            style={{
                                width: '100%', padding: '14px 16px', borderRadius: '14px',
                                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
                                color: 'white', fontSize: '0.95rem', outline: 'none',
                                transition: 'border-color 0.2s', boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    {error && (
                        <p style={{ color: '#e94560', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                            background: 'linear-gradient(135deg, #e94560, #c23152)',
                            color: 'white', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                            transition: 'all 0.3s ease', opacity: loading ? 0.6 : 1,
                            boxShadow: '0 8px 32px rgba(233,69,96,0.3)',
                        }}
                    >
                        {loading ? T('login.loading') : isRegister ? T('login.register') : T('login.submit')}
                    </button>
                </form>

                {/* Toggle */}
                <p style={{ textAlign: 'center', marginTop: '24px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                    {isRegister ? T('login.hasAccount') : T('login.noAccount')}{' '}
                    <button
                        onClick={() => { setIsRegister(!isRegister); setError(''); }}
                        style={{
                            background: 'none', border: 'none', color: 'var(--brand-accent, #e94560)',
                            cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                        }}
                    >
                        {isRegister ? T('login.submit') : T('login.createBtn')}
                    </button>
                </p>
            </div>
        </div>
    );
}
