'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { AIService } from '@/services/aiService';
import { getAgencyService, updateAgencyService, ServiceData } from '@/lib/firestoreService';
import { useNotifications } from '@/context/NotificationContext';

const panelStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 32,
    padding: 40,
    height: '100%',
};

const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 800,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 12,
    display: 'block',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: '16px 20px',
    color: 'white',
    fontSize: 15,
    outline: 'none',
    fontFamily: 'inherit',
};

export default function ServiceWorkspaceClient({ slug }: { slug: string }) {
    const { lang } = useLanguage();
    const { showToast } = useNotifications();
    const [service, setService] = useState<ServiceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // AI State
    const [aiResult, setAiResult] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Form State (Local Copy)
    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await getAgencyService(slug);
                if (data) {
                    setService(data);
                    // Initialize form data with PL translations as base
                    setFormData({
                        title: data.translations.pl.title,
                        subtitle: data.translations.pl.subtitle,
                        long: data.translations.pl.long,
                        features: [...data.translations.pl.features],
                        price: data.price,
                        techs: [...data.techs]
                    });
                }
            } catch (error) {
                console.error('Error fetching service:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [slug]);

    const handleFieldChange = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        handleFieldChange('features', newFeatures);
    };

    const handleSave = async () => {
        if (!service) return;
        setSaving(true);
        try {
            const updatedData: Partial<ServiceData> = {
                price: formData.price,
                techs: formData.techs,
                translations: {
                    ...service.translations,
                    pl: {
                        title: formData.title,
                        subtitle: formData.subtitle,
                        long: formData.long,
                        features: formData.features
                    }
                }
            };
            await updateAgencyService(service.id, updatedData);
            showToast('Usługa została zaktualizowana! 🚀', 'success');
        } catch (error) {
            console.error('Error saving service:', error);
            showToast('Błąd podczas zapisywania.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleGenerateAI = async () => {
        setIsGenerating(true);
        setAiResult(null);
        try {
            const res = await AIService.developService(
                formData.title,
                formData.long,
                formData.features
            );
            if (res.error) {
                setAiResult(`Błąd: ${res.error}`);
            } else {
                setAiResult(res.text);
            }
        } catch (err) {
            setAiResult('Wystąpił nieoczekiwany błąd.');
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading) return (
        <AdminLayout>
            <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>Ładowanie danych Firestore...</div>
        </AdminLayout>
    );

    if (!service || !formData) return (
        <AdminLayout>
            <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>Usługa nie znaleziona.</div>
        </AdminLayout>
    );

    const accentColor = service.gradient.match(/#([0-9a-fA-F]{6})/)?.[0] || '#3b82f6';

    return (
        <AdminLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

                {/* Navigation & Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <Link href="/admin/services" style={{
                        width: 48, height: 48, borderRadius: 16,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', textDecoration: 'none', fontSize: 20
                    }}>
                        ←
                    </Link>
                    <div>
                        <div style={labelStyle}>Workspace Usługi (Dynamic)</div>
                        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: 16 }}>
                            {service.icon} {formData.title}
                        </h1>
                    </div>
                </div>

                {/* Workspace Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>

                    {/* Left Panel: Content & Strategy */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div style={panelStyle}>
                            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ color: accentColor }}>📝</span> Treść i Komunikacja
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <label style={labelStyle}>Nagłówek (H1)</label>
                                    <input
                                        style={inputStyle}
                                        value={formData.title}
                                        onChange={(e) => handleFieldChange('title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Podtytuł (Subtitle)</label>
                                    <textarea
                                        style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
                                        value={formData.subtitle}
                                        onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Długi opis (Long Description)</label>
                                    <textarea
                                        style={{ ...inputStyle, minHeight: 180, resize: 'vertical' }}
                                        value={formData.long}
                                        onChange={(e) => handleFieldChange('long', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={panelStyle}>
                            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ color: accentColor }}>💎</span> Kluczowe Funkcje (Features)
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                {formData.features.map((feat: string, i: number) => (
                                    <div key={i}>
                                        <label style={labelStyle}>Funkcja 0{i + 1}</label>
                                        <input
                                            style={inputStyle}
                                            value={feat}
                                            onChange={(e) => handleFeatureChange(i, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Mechanics & AI Context */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                        {/* Technical Details */}
                        <div style={{ ...panelStyle, background: 'rgba(59,130,246,0.03)', border: '1px solid rgba(59,130,246,0.1)' }}>
                            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ color: '#3b82f6' }}>🛠️</span> Parametry Techniczne
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <label style={labelStyle}>Cena bazowa</label>
                                    <input
                                        style={inputStyle}
                                        value={formData.price}
                                        onChange={(e) => handleFieldChange('price', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Stack Technologiczny</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                                        {formData.techs.map((tech: string) => (
                                            <div key={tech} style={{
                                                padding: '8px 16px', borderRadius: 12,
                                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                                fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)'
                                            }}>
                                                {tech}
                                            </div>
                                        ))}
                                        <button style={{
                                            padding: '8px 16px', borderRadius: 12,
                                            background: 'rgba(59,130,246,0.1)', border: '1px dashed rgba(59,130,246,0.3)',
                                            fontSize: 18, color: '#3b82f6', cursor: 'pointer'
                                        }}>+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI & Innovation Panel */}
                        <div style={{
                            ...panelStyle,
                            background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.1))',
                            border: '1px solid rgba(139,92,246,0.2)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 12,
                                    background: '#8b5cf6', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    fontSize: 20, boxShadow: '0 4px 15px rgba(139,92,246,0.3)'
                                }}>🧠</div>
                                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}>AI Development</h2>
                            </div>

                            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 24 }}>
                                Wykorzystaj AI, aby wygenerować nowe propozycje wartości dla usługi <span style={{ color: 'white', fontWeight: 700 }}>{formData.title}</span> na podstawie trendów rynkowych 2026.
                            </p>

                            <button
                                onClick={handleGenerateAI}
                                disabled={isGenerating}
                                style={{
                                    width: '100%', padding: '18px 0',
                                    background: isGenerating ? 'rgba(255,255,255,0.1)' : 'white',
                                    color: isGenerating ? 'rgba(255,255,255,0.3)' : '#070710',
                                    fontWeight: 800, fontSize: 14, borderRadius: 16,
                                    border: 'none', cursor: isGenerating ? 'not-allowed' : 'pointer',
                                    boxShadow: isGenerating ? 'none' : '0 4px 20px rgba(255,255,255,0.15)',
                                    textTransform: 'uppercase', letterSpacing: '0.05em',
                                    marginBottom: 12,
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {isGenerating ? '⌛ Generowanie...' : '✨ Generuj Ulepszenia AI'}
                            </button>

                            {aiResult && (
                                <div style={{
                                    marginTop: 16,
                                    padding: 20,
                                    background: 'rgba(0,0,0,0.2)',
                                    borderRadius: 16,
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    fontSize: 14,
                                    color: 'rgba(255,255,255,0.9)',
                                    lineHeight: 1.6,
                                    maxHeight: 300,
                                    overflowY: 'auto',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {aiResult}
                                </div>
                            )}

                            <button style={{
                                width: '100%', padding: '18px 0',
                                background: 'rgba(255,255,255,0.05)', color: 'white',
                                fontWeight: 800, fontSize: 14, borderRadius: 16,
                                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                                marginTop: 12
                            }}>
                                📊 Analizuj Konkurencję
                            </button>
                        </div>

                        {/* Save Action */}
                        <div style={{ marginTop: 'auto' }}>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                style={{
                                    width: '100%', padding: '24px 0',
                                    background: saving ? 'rgba(59,130,246,0.5)' : '#3b82f6',
                                    color: 'white',
                                    fontWeight: 900, fontSize: 16, borderRadius: 20,
                                    border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                                    boxShadow: saving ? 'none' : '0 8px 32px rgba(59,130,246,0.4)',
                                    textTransform: 'uppercase', letterSpacing: '0.1em',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {saving ? '⌛ Zapisywanie...' : '💾 Zapisz Zmiany w Usłudze'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
