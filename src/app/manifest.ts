import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'ECM Digital – Panel Agencji',
        short_name: 'ECM Digital',
        description: 'Panel zarządzania agencją – CRM, oferty, kampanie, projekty i kalendarz',
        start_url: '/dashboard',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#050505',
        theme_color: '#050505',
        categories: ['business', 'productivity'],
        icons: [
            {
                src: '/icons/icon-72x72.png',
                sizes: '72x72',
                type: 'image/png',
            },
            {
                src: '/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
        shortcuts: [
            {
                name: 'Klienci',
                short_name: 'CRM',
                url: '/dashboard/clients',
                icons: [{ src: '/icons/icon-72x72.png', sizes: '72x72' }],
            },
            {
                name: 'Oferty',
                short_name: 'Oferty',
                url: '/dashboard/offers',
                icons: [{ src: '/icons/icon-72x72.png', sizes: '72x72' }],
            },
            {
                name: 'Kanban',
                short_name: 'Projekty',
                url: '/dashboard/kanban',
                icons: [{ src: '/icons/icon-72x72.png', sizes: '72x72' }],
            },
            {
                name: 'Kalendarz',
                short_name: 'Kalendarz',
                url: '/dashboard/calendar',
                icons: [{ src: '/icons/icon-72x72.png', sizes: '72x72' }],
            },
        ],
    };
}
