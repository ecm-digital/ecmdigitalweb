'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useNotifications } from '@/context/NotificationContext';
import { CaseStudy } from '@/lib/firestoreService';

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

export default function CaseStudyWorkspaceClient({ id }: { id: string }) {
    const { lang } = useLanguage();
    const { showToast } = useNotifications();
    const [caseData, setCaseData] = useState<CaseStudy | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        const fetchCase = async () => {
            try {
                const docRef = doc(db, 'agency_case_studies', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = { id: docSnap.id, ...docSnap.data() } as CaseStudy;
                    setCaseData(data);
                    setFormData({
                        slug: data.slug,
                        color: data.color,
                        title: data.translations.pl.title,
                        category: data.translations.pl.category,
                        description: data.translations.pl.description,
                        results: data.translations.pl.results || '',
                        order: data.order || 0,
                    });
                }
            } catch (error) {
                console.error('Error fetching case:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCase();
    }, [id]);

    const handleFieldChange = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (!caseData) return;
        setSaving(true);
        try {
            const updatedData = {
                slug: formData.slug,
                color: formData.color,
                order: Number(formData.order),
                translations: {
                    ...caseData.translations,
                    pl: {
                        title: formData.title,
                        category: formData.category,
                        description: formData.description,
                        results: formData.results
                    }
                },
                updatedAt: serverTimestamp()
            };
            await updateDoc(doc(db, 'agency_case_studies', id), updatedData);
            showToast('Zaktualizowano Case Study! 🚀', 'success');
        } catch (error) {
            console.error('Error saving case:', error);
            showToast('Błąd podczas zapisywania.', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Ładowanie...</div>;
    if (!caseData || !formData) return <div>Błąd ładowania.</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <Link href="/admin/cases" style={{
                    width: 48, height: 48, borderRadius: 16,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', textDecoration: 'none', fontSize: 20
                }}>←</Link>
                <h1 style={{ fontSize: 32, fontWeight: 900, color: 'white', margin: 0 }}>Edytuj: {formData.title}</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
                <div style={panelStyle}>
                    <h2 style={{ fontSize: 20, color: 'white', marginBottom: 24 }}>Treść (PL)</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label style={labelStyle}>Tytuł Projektu</label>
                            <input style={inputStyle} value={formData.title} onChange={e => handleFieldChange('title', e.target.value)} />
                        </div>
                        <div>
                            <label style={labelStyle}>Kategoria</label>
                            <input style={inputStyle} value={formData.category} onChange={e => handleFieldChange('category', e.target.value)} />
                        </div>
                        <div>
                            <label style={labelStyle}>Opis Sukcesu</label>
                            <textarea style={{ ...inputStyle, minHeight: 150 }} value={formData.description} onChange={e => handleFieldChange('description', e.target.value)} />
                        </div>
                        <div>
                            <label style={labelStyle}>Wyniki / KPI</label>
                            <textarea style={{ ...inputStyle, minHeight: 100 }} value={formData.results} onChange={e => handleFieldChange('results', e.target.value)} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={panelStyle}>
                        <h2 style={{ fontSize: 20, color: 'white', marginBottom: 24 }}>Ustawienia</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <label style={labelStyle}>Slug (URL)</label>
                                <input style={inputStyle} value={formData.slug} onChange={e => handleFieldChange('slug', e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Kolor Akcentu (Hex)</label>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <input style={{ ...inputStyle, flex: 1 }} value={formData.color} onChange={e => handleFieldChange('color', e.target.value)} />
                                    <div style={{ width: 54, height: 54, borderRadius: 12, background: formData.color, border: '2px solid rgba(255,255,255,0.1)' }} />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Kolejność Wyświetlania</label>
                                <input type="number" style={inputStyle} value={formData.order} onChange={e => handleFieldChange('order', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            padding: '24px', background: saving ? 'rgba(236, 72, 153, 0.5)' : '#ec4899',
                            color: 'white', fontWeight: 900, borderRadius: 20, border: 'none',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.1em'
                        }}
                    >
                        {saving ? 'Zapisywanie...' : 'Zapisz Case Study'}
                    </button>
                </div>
            </div>
        </div>
    );
}
