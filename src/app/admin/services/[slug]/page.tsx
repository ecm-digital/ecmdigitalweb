import React from 'react';
import { services } from '@/app/services/serviceData';
import ServiceWorkspaceClient from '../ServiceWorkspaceClient';

export function generateStaticParams() {
    return Object.keys(services).map((slug) => ({
        slug: slug,
    }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <ServiceWorkspaceClient slug={slug} />;
}
