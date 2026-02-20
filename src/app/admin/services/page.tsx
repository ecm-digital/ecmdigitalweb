'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { getAgencyServices, ServiceData } from '@/lib/firestoreService';

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
    const [services, setServices] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<string | null>(null);

    const fetchServices = async () => {
        setLoading(true);
        try {
            console.log('Fetching services from Firestore...');
            const data = await getAgencyServices();
            console.log('Fetched services:', data.length);
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
            setStatus('Błąd pobierania danych.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    if (loading) return (
        <AdminLayout>
            <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>
                <div style={{ fontSize: 24, marginBottom: 20 }}>⌛</div>
                Ładowanie katalogu usług...
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
                            Katalog <span style={{ color: '#3b82f6' }}>Usług</span> (Dynamic)
                        </h1>
                        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginTop: 8, fontWeight: 500 }}>
                            Zarządzaj ofertą usług wyświetlaną na stronie głównej i w panelu klienta. Dane pobierane z Firestore.
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
                        <h3 style={{ fontSize: 20, color: 'white', marginBottom: 8 }}>Brak usług w bazie danych</h3>
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
                                                {service.translations?.pl?.title || service.slug}
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
                                        {service.translations?.pl?.subtitle || 'Brak opisu'}
                                    </p>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: 20,
                                        borderTop: '1px solid rgba(255,255,255,0.06)',
                                    }}>
                                        <div>
                                            <div style={labelStyle}>Cena bazowa</div>
                                            <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginTop: 4 }}>
                                                {service.price}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Link
                                                href={`/admin/services/${service.slug}`}
                                                style={{
                                                    padding: '10px 16px', borderRadius: 12,
                                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                                    color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                Rozwijaj
                                            </Link>
                                            <a
                                                href={`/services/${service.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    padding: '10px 16px', borderRadius: 12,
                                                    background: `${accentColor}15`, border: `1px solid ${accentColor}30`,
                                                    color: accentColor, fontSize: 13, fontWeight: 700, textDecoration: 'none',
                                                }}
                                            >
                                                Podgląd
                                            </a>
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
