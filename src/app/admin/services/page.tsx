'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/context/LanguageContext';
import { getAgencyServices, deleteAgencyService, ServiceData } from '@/lib/firestoreService';

const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: 32,
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    position: 'relative',
    overflow: 'hidden',
};

const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 800,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
};

export default function AdminServicesPage() {
    const { T, lang } = useLanguage();
    const [services, setServices] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<string | null>(null);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const data = await getAgencyServices();
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
            setStatus(T('admin.services.errorFetch'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (slug: string) => {
        if (!window.confirm(T('admin.services.confirmDelete'))) return;
        try {
            await deleteAgencyService(slug);
            setServices(s => s.filter(service => service.slug !== slug));
        } catch (error) {
            console.error('Error deleting service', error);
            alert(T('admin.services.errorDelete'));
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    if (loading) return (
        <AdminLayout>
            <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>
                <div style={{ fontSize: 24, marginBottom: 20 }}>⌛</div>
                {T('admin.services.loading')}
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.03em', margin: 0, color: 'white' }}>
                            {T('admin.services.title')} <span style={{ color: '#3b82f6' }}>(Dynamic)</span>
                        </h1>
                        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginTop: 8, fontWeight: 500 }}>
                            {T('admin.services.subtitle')}
                        </p>
                    </div>
                </div>

                {/* Services Grid */}
                {services.length === 0 ? (
                    <div style={{
                        padding: '80px 40px',
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.02)',
                        border: '2px dashed rgba(255,255,255,0.05)',
                        borderRadius: 32,
                        color: 'rgba(255,255,255,0.4)'
                    }}>
                        <div style={{ fontSize: 40, marginBottom: 16 }}>📂</div>
                        <h3 style={{ fontSize: 20, color: 'white', marginBottom: 8 }}>{T('admin.services.empty')}</h3>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                        gap: 24,
                    }}>
                        {services.map((service) => {
                            const accentColor = service.gradient?.match(/#([0-9a-fA-F]{6})/)?.[0] || '#3b82f6';

                            return (
                                <div key={service.slug} style={cardStyle}>
                                    {/* Background Accent Glow */}
                                    <div style={{
                                        position: 'absolute', top: -40, right: -40,
                                        width: 120, height: 120, borderRadius: '50%',
                                        background: accentColor, opacity: 0.1, filter: 'blur(40px)',
                                        pointerEvents: 'none',
                                    }} />

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                        <div style={{
                                            width: 64, height: 64, borderRadius: 20,
                                            background: `${accentColor}15`,
                                            border: `1px solid ${accentColor}30`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 32,
                                            boxShadow: `0 8px 20px ${accentColor}15`,
                                        }}>
                                            {service.icon || '📦'}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'white' }}>
                                                {service.translations?.[lang]?.title || service.translations?.pl?.title || service.slug}
                                            </h3>
                                            <div style={{ ...labelStyle, marginTop: 4 }}>Slug: {service.slug}</div>
                                        </div>
                                    </div>

                                    <p style={{
                                        fontSize: 14,
                                        color: 'rgba(255,255,255,0.5)',
                                        lineHeight: 1.6,
                                        margin: '8px 0',
                                        flex: 1,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {service.translations?.[lang]?.subtitle || service.translations?.pl?.subtitle || T('admin.services.noDesc')}
                                    </p>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: 20,
                                        borderTop: '1px solid rgba(255,255,255,0.06)',
                                    }}>
                                        <div>
                                            <div style={labelStyle}>{T('admin.services.basePrice')}</div>
                                            <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginTop: 4 }}>
                                                {service.price}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Link
                                                href={`/admin/services/view?slug=${service.slug}`}
                                                style={{
                                                    padding: '10px 16px', borderRadius: 12,
                                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                                    color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                {T('admin.services.btnExpand')}
                                            </Link>
                                            {/* Preview Link */}
                                            {(() => {
                                                const existingSlugs = ['ai-agents', 'websites', 'ecommerce', 'automation', 'ai-executive', 'edu', 'mvp', 'ai-audit'];
                                                const isDynamic = !existingSlugs.includes(service.slug);
                                                const targetUrl = isDynamic ? `/services/view?slug=${service.slug}` : `/services/${service.slug}`;
                                                return (
                                                    <a
                                                        href={targetUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            padding: '10px 16px', borderRadius: 12,
                                                            background: `${accentColor}15`, border: `1px solid ${accentColor}30`,
                                                            color: accentColor, fontSize: 13, fontWeight: 700, textDecoration: 'none',
                                                        }}
                                                    >
                                                        {T('admin.services.btnPreview')}
                                                    </a>
                                                );
                                            })()}
                                            <button
                                                onClick={() => handleDelete(service.slug)}
                                                style={{
                                                    padding: '10px 16px', borderRadius: 12,
                                                    background: 'rgba(239, 68, 68, 0.1)', border: 'none',
                                                    color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tech Tags */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                                        {service.techs?.slice(0, 4).map((tech: string) => (
                                            <span key={tech} style={{
                                                fontSize: 10, fontWeight: 700,
                                                padding: '4px 8px', borderRadius: 6,
                                                background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                color: 'rgba(255,255,255,0.4)',
                                            }}>
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
