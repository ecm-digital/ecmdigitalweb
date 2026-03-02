'use client';
import { useSearchParams } from 'next/navigation';
import ServicePage from '../ServicePage';
import { Suspense } from 'react';

function DynamicServiceContent() {
    const searchParams = useSearchParams();
    const slug = searchParams.get('slug');
    if (!slug) return <div>Nie znaleziono usługi</div>;
    return <ServicePage serviceKey={slug} />;
}

export default function Page() {
    return (
        <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Ładowanie...</div>}>
            <DynamicServiceContent />
        </Suspense>
    );
}
