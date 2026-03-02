'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { getCaseStudies, CaseStudy, addCaseStudy, deleteCaseStudy, CaseStudyStat } from '@/lib/firestoreService';
import { useNotifications } from '@/context/NotificationContext';
import { useLanguage } from '@/context/LanguageContext';

/* ─── Styles ─────────────────────────────────────────── */
const glass: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
};

const inp: React.CSSProperties = {
    width: '100%', padding: '12px 16px', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, color: 'white', fontSize: 14, outline: 'none',
};

const label: React.CSSProperties = {
    fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, display: 'block',
};

const COLOR_PRESETS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#eab308', '#06b6d4', '#6366f1', '#14b8a6'];
const CATEGORIES = ['AI & Automatyzacja', 'Agent AI', 'E-commerce', 'Web Design', 'Mobile App', 'MVP', 'Marketing', 'Inne'];
const YEARS = ['2025', '2024', '2023', '2022', '2021'];
const TECHS = ['n8n', 'Gemini AI', 'OpenAI', 'React', 'Next.js', 'Node.js', 'Firebase', 'Shopify', 'WordPress', 'PostgreSQL', 'Python', 'Zapier', 'Make', 'AWS', 'Vite'];

type Tab = 'basic' | 'content' | 'stats' | 'testimonial';

interface FormState {
    title: string; category: string; client: string; industry: string;
    description: string; challenge: string; solution: string; results: string;
    color: string; year: string; duration: string; featured: boolean;
    technologies: string[];
    stats: CaseStudyStat[];
    testimonialQuote: string; testimonialAuthor: string; testimonialRole: string;
}

const EMPTY_FORM: FormState = {
    title: '', category: 'AI & Automatyzacja', client: '', industry: '',
    description: '', challenge: '', solution: '', results: '',
    color: '#3b82f6', year: '2025', duration: '', featured: false,
    technologies: [], stats: [{ value: '', label: '' }, { value: '', label: '' }, { value: '', label: '' }],
    testimonialQuote: '', testimonialAuthor: '', testimonialRole: '',
};

export default function AdminCasesPage() {
    const [cases, setCases] = useState<CaseStudy[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('basic');
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const { showToast } = useNotifications();
    const { T, lang } = useLanguage();

    const fetchCases = async () => {
        setLoading(true);
        try { setCases(await getCaseStudies()); }
        catch { showToast(T('admin.cases.toast.fetchError'), 'error'); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchCases();
        const onRefresh = () => { fetchCases(); showToast(T('admin.cases.toast.refreshed'), 'success'); };
        window.addEventListener('case-study-added', onRefresh);
        return () => window.removeEventListener('case-study-added', onRefresh);
    }, [T]);

    const slugify = (t: string) => t.toLowerCase()
        .replace(/[ąśćźżłóęń]/g, c => ({ ą: 'a', ś: 's', ć: 'c', ź: 'z', ż: 'z', ł: 'l', ó: 'o', ę: 'e', ń: 'n' }[c] || c))
        .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const setF = (patch: Partial<FormState>) => setForm(f => ({ ...f, ...patch }));

    const toggleTech = (tech: string) =>
        setF({
            technologies: form.technologies.includes(tech)
                ? form.technologies.filter(t => t !== tech)
                : [...form.technologies, tech]
        });

    const handleSave = async () => {
        if (!form.title.trim()) { showToast(T('admin.cases.modal.placeholder.title'), 'error'); return; }
        setSaving(true);
        try {
            const filteredStats = form.stats.filter(s => s.value && s.label);
            await addCaseStudy({
                slug: slugify(form.title),
                color: form.color,
                featured: form.featured,
                order: cases.length + 1,
                year: form.year,
                duration: form.duration || undefined,
                translations: {
                    [lang]: {
                        category: form.category,
                        title: form.title,
                        client: form.client || undefined,
                        industry: form.industry || undefined,
                        description: form.description,
                        challenge: form.challenge || undefined,
                        solution: form.solution || undefined,
                        results: form.results || undefined,
                        resultsStats: filteredStats.length ? filteredStats : undefined,
                        technologies: form.technologies.length ? form.technologies : undefined,
                        testimonial: form.testimonialQuote ? {
                            quote: form.testimonialQuote,
                            author: form.testimonialAuthor,
                            role: form.testimonialRole,
                        } : undefined,
                    }
                }
            });
            showToast(T('admin.cases.toast.added'), 'success');
            window.dispatchEvent(new CustomEvent('case-study-added'));
            setShowModal(false);
            setForm(EMPTY_FORM);
            setActiveTab('basic');
            fetchCases();
        } catch (e: any) {
            showToast(T('admin.cases.toast.saveError', { error: e.message }), 'error');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(T('admin.cases.card.confirmDelete'))) return;
        try { await deleteCaseStudy(id); showToast(T('admin.cases.toast.deleted'), 'success'); fetchCases(); }
        catch { showToast(T('admin.cases.toast.deleteError'), 'error'); }
    };

    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: 'basic', label: T('admin.cases.modal.tabs.basic'), icon: '📋' },
        { id: 'content', label: T('admin.cases.modal.tabs.content'), icon: '✍️' },
        { id: 'stats', label: T('admin.cases.modal.tabs.stats'), icon: '📊' },
        { id: 'testimonial', label: T('admin.cases.modal.tabs.testimonial'), icon: '💬' },
    ];

    if (loading) return (
        <AdminLayout>
            <div style={{ color: 'white', textAlign: 'center', padding: 100 }}>
                <div style={{ fontSize: 32, marginBottom: 20 }}>⌛</div>{T('admin.services.loading')}
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.03em', margin: 0, color: 'white' }}>
                            {T('admin.cases.title').split(' ')[0]} <span style={{ color: '#ec4899' }}>{T('admin.cases.title').split(' ').slice(1).join(' ') || 'Studies'}</span>
                        </h1>
                        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
                            {T('admin.cases.count', { count: cases.length })}
                        </p>
                    </div>
                    <button onClick={() => { setShowModal(true); setActiveTab('basic'); setForm(EMPTY_FORM); }}
                        style={{ padding: '14px 28px', background: 'linear-gradient(135deg,#ec4899,#8b5cf6)', color: 'white', borderRadius: 16, fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 15, boxShadow: '0 8px 24px rgba(236,72,153,0.3)' }}>
                        {T('admin.cases.btn.new')}
                    </button>
                </div>

                {/* Cards */}
                {cases.length === 0 ? (
                    <div style={{ padding: 80, textAlign: 'center', ...glass, borderStyle: 'dashed', color: 'rgba(255,255,255,0.2)' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
                        <p>{T('admin.cases.empty')}</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
                        {cases.map(cs => {
                            const t = (cs.translations?.[lang] || cs.translations?.pl || {}) as any;
                            return (
                                <div key={cs.id} style={{ ...glass, padding: 28, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: cs.color, opacity: 0.12, filter: 'blur(30px)' }} />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 8, background: `${cs.color}20`, color: cs.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                            {t.category}
                                        </span>
                                        {cs.featured && <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}>{T('admin.cases.card.featured')}</span>}
                                    </div>

                                    <div>
                                        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', margin: '0 0 4px' }}>{t.title}</h3>
                                        {t.client && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>👤 {t.client} {cs.year ? `• ${cs.year}` : ''}</div>}
                                    </div>

                                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0, flexGrow: 1 }}>
                                        {t.description || '–'}
                                    </p>

                                    {t.results && (
                                        <div style={{ padding: '8px 14px', borderRadius: 10, background: `${cs.color}15`, border: `1px solid ${cs.color}30`, fontSize: 13, color: cs.color, fontWeight: 700 }}>
                                            🚀 {t.results}
                                        </div>
                                    )}

                                    {t.technologies && t.technologies.length > 0 && (
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                            {t.technologies.slice(0, 4).map(tech => (
                                                <span key={tech} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>{tech}</span>
                                            ))}
                                            {t.technologies.length > 4 && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>+{t.technologies.length - 4}</span>}
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Link href={`/admin/cases/edit?id=${cs.id}`} style={{ flex: 1, textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: 10, color: 'white', fontWeight: 700, textDecoration: 'none', fontSize: 13, border: '1px solid rgba(255,255,255,0.08)' }}>
                                            {T('admin.cases.card.edit')}
                                        </Link>
                                        <button onClick={() => handleDelete(cs.id)} style={{ padding: '10px 16px', background: 'rgba(239,68,68,0.08)', borderRadius: 10, color: '#ef4444', fontWeight: 700, border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer', fontSize: 13 }}>
                                            {T('admin.cases.card.delete')}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Create Modal ──────────────────────────────────────── */}
            {showModal && (
                <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 680, background: 'rgba(8,8,18,0.99)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 28, overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.7)', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>

                        {/* Modal header */}
                        <div style={{ padding: '24px 32px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <h2 style={{ fontSize: 22, fontWeight: 900, color: 'white', margin: 0 }}>{T('admin.cases.modal.new')}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 20, cursor: 'pointer' }}>✕</button>
                            </div>

                            {/* Tabs */}
                            <div style={{ display: 'flex', gap: 4 }}>
                                {tabs.map(t => (
                                    <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                                        padding: '10px 16px', borderRadius: '10px 10px 0 0', border: 'none', cursor: 'pointer',
                                        background: activeTab === t.id ? 'rgba(255,255,255,0.07)' : 'transparent',
                                        color: activeTab === t.id ? 'white' : 'rgba(255,255,255,0.35)',
                                        fontWeight: activeTab === t.id ? 700 : 500, fontSize: 13,
                                        borderBottom: activeTab === t.id ? '2px solid #ec4899' : '2px solid transparent',
                                        transition: 'all 0.2s',
                                    }}>
                                        {t.icon} {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab content */}
                        <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1 }}>

                            {/* ── Tab: Basic ── */}
                            {activeTab === 'basic' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <div>
                                        <label style={label}>{T('admin.cases.modal.label.title')}</label>
                                        <input style={inp} placeholder={T('admin.cases.modal.placeholder.title')} value={form.title} onChange={e => setF({ title: e.target.value })} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div>
                                            <label style={label}>{T('admin.cases.modal.label.category')}</label>
                                            <select style={{ ...inp }} value={form.category} onChange={e => setF({ category: e.target.value })}>
                                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={label}>{T('admin.cases.modal.label.year')}</label>
                                            <select style={{ ...inp }} value={form.year} onChange={e => setF({ year: e.target.value })}>
                                                {YEARS.map(y => <option key={y}>{y}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div>
                                            <label style={label}>{T('admin.cases.modal.label.client')}</label>
                                            <input style={inp} placeholder={T('admin.cases.modal.placeholder.client')} value={form.client} onChange={e => setF({ client: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={label}>{T('admin.cases.modal.label.industry')}</label>
                                            <input style={inp} placeholder={T('admin.cases.modal.placeholder.industry')} value={form.industry} onChange={e => setF({ industry: e.target.value })} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div>
                                            <label style={label}>{T('admin.cases.modal.label.duration')}</label>
                                            <input style={inp} placeholder={T('admin.cases.modal.placeholder.duration')} value={form.duration} onChange={e => setF({ duration: e.target.value })} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 22 }}>
                                            <input type="checkbox" id="feat" checked={form.featured} onChange={e => setF({ featured: e.target.checked })} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                                            <label htmlFor="feat" style={{ ...label, margin: 0, cursor: 'pointer' }}>{T('admin.cases.modal.label.featured')}</label>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={label}>{T('admin.cases.modal.label.color')}</label>
                                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                                            {COLOR_PRESETS.map(c => (
                                                <div key={c} onClick={() => setF({ color: c })} style={{ width: 34, height: 34, borderRadius: 10, background: c, cursor: 'pointer', border: form.color === c ? '3px solid white' : '2px solid rgba(255,255,255,0.15)', transition: 'border 0.15s', boxShadow: form.color === c ? `0 0 12px ${c}80` : 'none' }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Tab: Content ── */}
                            {activeTab === 'content' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <div>
                                        <label style={label}>{T('admin.cases.modal.label.description')}</label>
                                        <textarea style={{ ...inp, minHeight: 100, resize: 'vertical' }} placeholder={T('admin.cases.modal.placeholder.description')} value={form.description} onChange={e => setF({ description: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={label}>{T('admin.cases.modal.label.challenge')}</label>
                                        <textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }} placeholder={T('admin.cases.modal.placeholder.challenge')} value={form.challenge} onChange={e => setF({ challenge: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={label}>{T('admin.cases.modal.label.solution')}</label>
                                        <textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }} placeholder={T('admin.cases.modal.placeholder.solution')} value={form.solution} onChange={e => setF({ solution: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={label}>{T('admin.cases.modal.label.results')}</label>
                                        <input style={inp} placeholder={T('admin.cases.modal.placeholder.results')} value={form.results} onChange={e => setF({ results: e.target.value })} />
                                    </div>
                                </div>
                            )}

                            {/* ── Tab: Stats & Tech ── */}
                            {activeTab === 'stats' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    <div>
                                        <label style={label}>{T('admin.cases.modal.label.stats')}</label>
                                        {form.stats.map((s, i) => (
                                            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10, marginBottom: 10 }}>
                                                <input style={inp} placeholder={T('admin.cases.modal.placeholder.statValue')} value={s.value} onChange={e => { const ns = [...form.stats]; ns[i] = { ...ns[i], value: e.target.value }; setF({ stats: ns }); }} />
                                                <input style={inp} placeholder={T('admin.cases.modal.placeholder.statLabel')} value={s.label} onChange={e => { const ns = [...form.stats]; ns[i] = { ...ns[i], label: e.target.value }; setF({ stats: ns }); }} />
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <label style={label}>{T('admin.cases.modal.label.tech')}</label>
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                                            {TECHS.map(tech => (
                                                <button key={tech} onClick={() => toggleTech(tech)} style={{
                                                    padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                                                    background: form.technologies.includes(tech) ? form.color : 'rgba(255,255,255,0.05)',
                                                    color: form.technologies.includes(tech) ? 'white' : 'rgba(255,255,255,0.5)',
                                                    border: form.technologies.includes(tech) ? `1px solid ${form.color}` : '1px solid rgba(255,255,255,0.1)',
                                                    boxShadow: form.technologies.includes(tech) ? `0 0 10px ${form.color}40` : 'none',
                                                }}>
                                                    {form.technologies.includes(tech) ? '✓ ' : ''}{tech}
                                                </button>
                                            ))}
                                        </div>
                                        <div style={{ marginTop: 12 }}>
                                            <input style={inp} placeholder={T('admin.cases.modal.placeholder.addTech')} onKeyDown={e => { if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) { toggleTech((e.target as HTMLInputElement).value.trim()); (e.target as HTMLInputElement).value = ''; } }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Tab: Testimonial ── */}
                            {activeTab === 'testimonial' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <div style={{ padding: 20, ...glass, borderRadius: 16, color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.6 }}>
                                        {T('admin.cases.modal.testimonial.info')}
                                    </div>
                                    <div>
                                        <label style={label}>{T('admin.cases.modal.label.quote')}</label>
                                        <textarea style={{ ...inp, minHeight: 100, resize: 'vertical' }} placeholder={T('admin.cases.modal.placeholder.quote')} value={form.testimonialQuote} onChange={e => setF({ testimonialQuote: e.target.value })} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div>
                                            <label style={label}>{T('admin.cases.modal.label.author')}</label>
                                            <input style={inp} placeholder={T('admin.cases.modal.placeholder.author')} value={form.testimonialAuthor} onChange={e => setF({ testimonialAuthor: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={label}>{T('admin.cases.modal.label.role')}</label>
                                            <input style={inp} placeholder={T('admin.cases.modal.placeholder.role')} value={form.testimonialRole} onChange={e => setF({ testimonialRole: e.target.value })} />
                                        </div>
                                    </div>
                                    {form.testimonialQuote && (
                                        <div style={{ padding: '20px 24px', background: `${form.color}10`, border: `1px solid ${form.color}25`, borderRadius: 16, marginTop: 8 }}>
                                            <div style={{ fontSize: 28, color: form.color, lineHeight: 1, marginBottom: 12 }}>&ldquo;</div>
                                            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', lineHeight: 1.7, margin: '0 0 12px' }}>{form.testimonialQuote}</p>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: form.color }}>{form.testimonialAuthor}</div>
                                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{form.testimonialRole}</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal footer */}
                        <div style={{ padding: '20px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 12, justifyContent: 'space-between', flexShrink: 0 }}>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {tabs.map((t, i) => i < tabs.length - 1 && activeTab === t.id && (
                                    <button key={t.id} onClick={() => setActiveTab(tabs[i + 1].id)} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                                        {T('admin.cases.modal.btn.next')}
                                    </button>
                                ))}
                            </div>
                            <button onClick={handleSave} disabled={saving} style={{
                                padding: '14px 32px', background: saving ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#ec4899,#8b5cf6)',
                                color: 'white', fontWeight: 800, border: 'none', borderRadius: 14, cursor: saving ? 'not-allowed' : 'pointer',
                                fontSize: 15, boxShadow: saving ? 'none' : '0 8px 24px rgba(236,72,153,0.3)', transition: 'all 0.2s',
                            }}>
                                {saving ? T('admin.cases.modal.saving') : T('admin.cases.modal.btn.add')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
