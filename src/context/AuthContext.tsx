'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { seedUserData } from '@/lib/firestoreService';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            setLoading(false);
            // Auto-seed Firestore data for new users
            if (u) {
                try {
                    await seedUserData(u.uid, u.displayName || u.email?.split('@')[0] || 'Klient');
                } catch (e) {
                    console.warn('Seed skipped:', e);
                }
            }
        });
        return unsubscribe;
    }, []);

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (email: string, password: string, name: string) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
    };

    const loginWithGoogle = async () => {
        try {
            console.log('Initiating Google Login (Popup)...');
            await signInWithPopup(auth, googleProvider);
            console.log('Google Login successful');
        } catch (error: any) {
            console.error('Google Auth Error:', error.code, error.message);
            throw error;
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
