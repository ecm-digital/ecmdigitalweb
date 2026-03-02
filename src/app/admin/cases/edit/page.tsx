'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import CaseStudyWorkspaceClient from './CaseStudyWorkspaceClient';
import AdminLayout from '@/components/AdminLayout';

function CaseStudyEditContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [exists, setExists] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setExists(false);
            setLoading(false);
            return;
        }

        const checkDoc = async () => {
            try {
                const docRef = doc(db, 'agency_case_studies', id);
                const docSnap = await getDoc(docRef);
                setExists(docSnap.exists());
            } catch (error) {
                console.error('Error checking case study:', error);
                setExists(false);
            } finally {
                setLoading(false);
            }
        };
        checkDoc();
    }, [id]);

    if (loading) return (
        <AdminLayout>
            <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>Sprawdzanie dokumentu...</div>
        </AdminLayout>
    );

    if (!id || exists === false) return (
        <AdminLayout>
            <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>Case Study nie istnieje lub brak ID.</div>
        </AdminLayout>
    );

    return <CaseStudyWorkspaceClient id={id} />;
}

export default function CaseStudyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CaseStudyEditContent />
        </Suspense>
    );
}
