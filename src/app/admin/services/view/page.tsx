'use client';
import { useSearchParams } from 'next/navigation';
import ServiceWorkspaceClient from '../ServiceWorkspaceClient';
import { Suspense } from 'react';
import AdminLayout from '@/components/AdminLayout';

function DynamicAdminServiceContent() {
    const searchParams = useSearchParams();
    const slug = searchParams.get('slug');
    if (!slug) return <AdminLayout><div style={{ padding: 40 }}>Nie znaleziono parametru uslugi</div></AdminLayout>;
    return <ServiceWorkspaceClient slug={slug} />;
}

export default function Page() {
    return (
        <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Ładowanie edytora...</div>}>
            <DynamicAdminServiceContent />
        </Suspense>
    );
}
