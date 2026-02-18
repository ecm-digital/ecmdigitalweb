'use client';

import { AuthProvider } from '@/context/AuthContext';
import { AgencyProvider } from '@/context/AgencyContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { LanguageProvider } from '@/context/LanguageContext';
import ToastController from './ToastController';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AgencyProvider>
                <NotificationProvider>
                    <LanguageProvider>
                        <ToastController />
                        {children}
                    </LanguageProvider>
                </NotificationProvider>
            </AgencyProvider>
        </AuthProvider>
    );
}
