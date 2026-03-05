'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function PostHogPageView() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (pathname) {
            const consent = localStorage.getItem('cookie-consent');
            if (consent !== 'accepted') return;

            let url = window.origin + pathname;
            if (searchParams && searchParams.toString()) {
                url = url + `?${searchParams.toString()}`;
            }
            // Add a small delay for safety to ensure init finishes
            setTimeout(() => {
                posthog.capture('$pageview', {
                    '$current_url': url,
                });
            }, 50);
        }
    }, [pathname, searchParams]);

    return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const consent = localStorage.getItem('cookie-consent');
        if (consent !== 'accepted') return;

        if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
                api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
                person_profiles: 'always',
                capture_pageview: false // Default false because PostHogPageView captures manually
            });
        }
    }, []);

    return (
        <PHProvider client={posthog}>
            <Suspense fallback={null}>
                <PostHogPageView />
            </Suspense>
            {children}
        </PHProvider>
    );
}
