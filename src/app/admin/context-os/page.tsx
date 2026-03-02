'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getContextOS, saveContextOS, ContextOSData } from '@/lib/firestoreService';
import { useLanguage } from '@/context/LanguageContext';

const card = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 32,
} as const;

const textareaStyle: React.CSSProperties = {
    width: '100%',
    minHeight: 160,
    padding: '16px 20px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    color: 'white',
    fontSize: 14,
    lineHeight: 1.7,
    fontFamily: '"Inter", -apple-system, sans-serif',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.3s',
};

const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: 8,
    display: 'block',
};

interface Section {
    key: keyof ContextOSData;
    icon: string;
    title: string;
    subtitle: string;
    accent: string;
    placeholder: string;
}

const getSections = (T: any): Section[] => [
    {
        key: 'toneOfVoice',
        icon: '🎙️',
        title: T('admin.context.section.toneOfVoice.title'),
        subtitle: T('admin.context.section.toneOfVoice.subtitle'),
        accent: '#3b82f6',
        placeholder: T('admin.context.section.toneOfVoice.placeholder'),
    },
    {
        key: 'sops',
        icon: '📋',
        title: T('admin.context.section.sops.title'),
        subtitle: T('admin.context.section.sops.subtitle'),
        accent: '#10b981',
        placeholder: T('admin.context.section.sops.placeholder'),
    },
    {
        key: 'businessGoals',
        icon: '🎯',
        title: T('admin.context.section.businessGoals.title'),
        subtitle: T('admin.context.section.businessGoals.subtitle'),
        accent: '#f59e0b',
        placeholder: T('admin.context.section.businessGoals.placeholder'),
    },
    {
        key: 'meetingNotes',
        icon: '🗣️',
        title: T('admin.context.section.meetingNotes.title'),
        subtitle: T('admin.context.section.meetingNotes.subtitle'),
        accent: '#8b5cf6',
        placeholder: T('admin.context.section.meetingNotes.placeholder'),
    },
    {
        key: 'customInstructions',
        icon: '⚡',
        title: T('admin.context.section.customInstructions.title'),
        subtitle: T('admin.context.section.customInstructions.subtitle'),
        accent: '#ec4899',
        placeholder: T('admin.context.section.customInstructions.placeholder'),
    },
];

export default function ContextOSPage() {
    const { T, lang } = useLanguage();
    const sections = getSections(T);
    const [data, setData] = useState<ContextOSData>({
        toneOfVoice: '',
        sops: '',
        businessGoals: '',
        meetingNotes: '',
        customInstructions: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const ctx = await getContextOS();
                setData(ctx);
            } catch (e) {
                console.error('Error loading Context OS:', e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveContextOS(data);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            console.error('Error saving Context OS:', e);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key: keyof ContextOSData, value: string) => {
        setData(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const contextCharCount = Object.values(data).filter(v => typeof v === 'string').join('').length;

    return (
        <AdminLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 960 }}>

                {/* ═══ Page Header ═══ */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>
                            🧠 {T('admin.context.title').split(' ')[0]} <span style={{ color: '#8b5cf6' }}>{T('admin.context.title').split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 8, lineHeight: 1.6 }}>
                            {T('admin.context.subtitle')}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{
                            padding: '8px 16px', borderRadius: 12,
                            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                            fontSize: 12, fontWeight: 700, color: '#a78bfa',
                        }}>
                            {T('admin.context.charCount', { count: contextCharCount.toLocaleString() })}
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            style={{
                                padding: '12px 28px', borderRadius: 14,
                                background: saved
                                    ? 'linear-gradient(135deg, #10b981, #059669)'
                                    : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                border: 'none',
                                color: 'white', fontWeight: 700, fontSize: 14,
                                cursor: saving ? 'wait' : 'pointer',
                                boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
                                transition: 'all 0.3s',
                            }}
                        >
                            {saving ? `⏳ ${T('admin.context.saving')}` : saved ? `✅ ${T('admin.context.saved')}` : `💾 ${T('admin.context.saveBtn')}`}
                        </button>
                    </div>
                </div>

                {/* ═══ Architecture Badge ═══ */}
                <div style={{
                    ...card,
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.08))',
                    border: '1px solid rgba(139,92,246,0.15)',
                    display: 'flex', alignItems: 'center', gap: 20, padding: 24,
                }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 18,
                        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 28, flexShrink: 0,
                        boxShadow: '0 8px 25px rgba(139,92,246,0.3)',
                    }}>🧠</div>
                    <div>
                        <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 4px', color: 'white' }}>
                            {T('admin.context.archTitle')}
                        </h3>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6 }}>
                            {T('admin.context.archSubtitle')}
                            <br />
                            {T('admin.context.archDetails')}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ ...card, height: 240, opacity: 0.3 }} />
                        ))}
                    </div>
                ) : (
                    <>
                        {sections.map((section) => (
                            <div key={section.key} style={{ ...card, position: 'relative', overflow: 'hidden' }}>
                                {/* Accent glow */}
                                <div style={{
                                    position: 'absolute', top: -30, right: -30,
                                    width: 120, height: 120, borderRadius: '50%',
                                    background: section.accent, opacity: 0.06, filter: 'blur(40px)',
                                    pointerEvents: 'none',
                                }} />

                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                                        <div style={{
                                            width: 48, height: 48, borderRadius: 14,
                                            background: `${section.accent}15`, border: `1px solid ${section.accent}30`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 24,
                                        }}>
                                            {section.icon}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'white' }}>
                                                {section.title}
                                            </h3>
                                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
                                                {section.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                    <textarea
                                        value={(data[section.key] as string) || ''}
                                        onChange={(e) => handleChange(section.key, e.target.value)}
                                        placeholder={section.placeholder}
                                        style={{
                                            ...textareaStyle,
                                            borderColor: 'rgba(255,255,255,0.1)',
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = section.accent + '60'}
                                        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    />
                                    <div style={{
                                        textAlign: 'right', marginTop: 8,
                                        fontSize: 11, color: 'rgba(255,255,255,0.25)',
                                    }}>
                                        {((data[section.key] as string) || '').length} {T('admin.context.chars')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
