'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IndexHtmlRedirect() {
    const router = useRouter();
    
    useEffect(() => {
        // Redirect client-side back to the root page
        router.replace('/');
    }, [router]);

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050507',
            color: '#ffffff',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <div style={{ textAlign: 'center' }}>
                <p>Przekierowanie...</p>
            </div>
        </div>
    );
}
