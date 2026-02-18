'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAgencySettings, AgencySettings } from '@/lib/firestoreService';

interface AgencyContextType {
    settings: AgencySettings | null;
    loading: boolean;
    refreshSettings: () => Promise<void>;
}

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

export function AgencyProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<AgencySettings | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshSettings = async () => {
        try {
            const data = await getAgencySettings();
            setSettings(data);
        } catch (error) {
            console.error('Error loading agency settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshSettings();
    }, []);

    return (
        <AgencyContext.Provider value={{ settings, loading, refreshSettings }}>
            {children}
        </AgencyContext.Provider>
    );
}

export function useAgency() {
    const context = useContext(AgencyContext);
    if (context === undefined) {
        throw new Error('useAgency must be used within an AgencyProvider');
    }
    return context;
}
