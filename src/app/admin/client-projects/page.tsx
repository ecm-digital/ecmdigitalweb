'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
    Project, Client, ServiceData,
    getProjects, addProject, updateProject, deleteProject, getClients, getAgencyServices, addCaseStudy
} from '@/lib/firestoreService';
import { useNotifications } from '@/context/NotificationContext';
import ProjectVault from '@/components/ProjectVault';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useLanguage } from '@/context/LanguageContext';

type ProjectStatus = 'Planowanie' | 'W trakcie' | 'Testowanie' | 'Ukończone';

const columns: { key: ProjectStatus; title: string; color: string; icon: string }[] = [
    { key: 'Planowanie', title: 'Planowanie (Wyceń)', color: '#f59e0b', icon: '📝' },
    { key: 'W trakcie', title: 'W trakcie', color: '#3b82f6', icon: '🔨' },
    { key: 'Testowanie', title: 'Testowanie', color: '#8b5cf6', icon: '🧪' },
    { key: 'Ukończone', title: 'Ukończone', color: '#10b981', icon: '✅' },
];

export default function ClientProjectsAdminPage() {
    const { showToast } = useNotifications();
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [services, setServices] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [draggedProject, setDraggedProject] = useState<string | null>(null);

    // RAG AI State
    const [aiQuestion, setAiQuestion] = useState('');
    const [aiAnswer, setAiAnswer] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);

    const [form, setForm] = useState({
        title: '',
        status: 'Planowanie' as ProjectStatus,
        progress: 0,
        userId: '',
    });

    // Case Study Generator State
    const [generatingCase, setGeneratingCase] = useState(false);
    const [caseData, setCaseData] = useState<any | null>(null);
    const { T, lang } = useLanguage();

    const loadData = async () => {
        setLoading(true);
        try {
            const [pData, cData, sData] = await Promise.all([getProjects(), getClients(), getAgencyServices()]);
            setProjects(pData);
            setClients(cData);
            setServices(sData);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const openNew = (status: ProjectStatus = 'Planowanie') => {
        setEditingProject(null);
        setForm({ title: '', status, progress: 0, userId: clients[0]?.id || '' });
        setAiQuestion(''); setAiAnswer(null); setAiLoading(false);
        setShowModal(true);
    };

    const openEdit = (p: Project) => {
        setEditingProject(p);
        setForm({ title: p.title, status: p.status, progress: p.progress, userId: p.userId || '' });
        setAiQuestion(''); setAiAnswer(null); setAiLoading(false);
        setShowModal(true);
    };

    const handleAskAI = async () => {
        if (!aiQuestion.trim()) return;
        setAiLoading(true);
        setAiAnswer(null);

        const matchingService = services.find(s => (s.translations?.pl?.title || s.slug) === form.title);

        try {
            const res = await fetch('/api/ai/project-rag', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: aiQuestion,
                    knowledgeBase: matchingService?.internalKnowledge || '',
                    serviceName: form.title,
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setAiAnswer(data.text);
        } catch (error: any) {
            setAiAnswer(`Błąd połączenia z Bazą Wiedzy AI: ${error.message}`);
            showToast('Błąd działania AI', 'error');
        } finally {
            setAiLoading(false);
        }
    };

    const handleSave = async () => {
        if (!form.title.trim()) {
            showToast('Podaj nazwę projektu', 'error');
            return;
        }

        try {
            const baseColor = columns.find(c => c.key === form.status)?.color || '#3b82f6';

            if (editingProject) {
                await updateProject(editingProject.id, {
                    title: form.title,
                    status: form.status,
                    progress: Number(form.progress),
                    userId: form.userId,
                    color: baseColor,
                });
                showToast('Zapisano zaktualizowany projekt.', 'success');
            } else {
                await addProject({
                    title: form.title,
                    status: form.status,
                    progress: Number(form.progress),
                    userId: form.userId,
                    color: baseColor,
                });
                showToast('Stworzono nowy proces projektowy.', 'success');
            }
            setShowModal(false);
            loadData();
        } catch (err: any) {
            showToast('Błąd: ' + err.message, 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Czy na pewno chcesz usunąć ten projekt klienta?')) {
            try {
                await deleteProject(id);
                showToast('Projekt usunięty', 'info');
                loadData();
            } catch (err) {
                showToast('Błąd operacji', 'error');
            }
        }
    };

    const handleDragStart = (id: string) => setDraggedProject(id);

    const handleDrop = async (status: ProjectStatus) => {
        if (!draggedProject) return;
        const baseColor = columns.find(c => c.key === status)?.color || '#3b82f6';

        try {
            // Optimistic update
            setProjects(prev => prev.map(p => p.id === draggedProject ? { ...p, status, color: baseColor } : p));
            await updateProject(draggedProject, { status, color: baseColor });
        } catch (err) {
            showToast('Akcja nie powiodła se', 'error');
            loadData();
        } finally {
            setDraggedProject(null);
        }
    };

    const generateCaseStudy = async () => {
        if (!editingProject) return;
        setGeneratingCase(true);
        setCaseData(null);

        const clientName = clients.find(c => c.id === form.userId)?.name || 'Klient';

        try {
            const apiKey = (window as any).NEXT_PUBLIC_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY');
            const genAI = new GoogleGenerativeAI(apiKey || '');
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const prompt = `Jesteś copywriterem agencji ECM Digital. Stwórz profesjonalne Case Study z ukończonego projektu: "${form.title}" dla klienta "${clientName}".
            Zwróć odpowiedź WYŁĄCZNIE jako JSON:
            {
              "title": "Chwytliwy tytuł (np. Automatyzacja leadów dla...)",
              "category": "AI & Automatyzacja | Agent AI | E-commerce | Marketing",
              "industry": "Branża klienta",
              "description": "Krótki wstęp (2-3 zdania)",
              "challenge": "Główny problem klienta przed wdrożeniem",
              "solution": "Jak go rozwiązaliśmy używając AI/Software",
              "results": "Główny wynik (np. 40% oszczędności czasu)",
              "stats": [{"value": "40%", "label": "Oszczędność czasu"}, {"value": "2x", "label": "Więcej leadów"}],
              "technologies": ["n8n", "Gemini AI", "Next.js"],
              "metaTitle": "SEO meta title (50-60 znaków)",
              "metaDescription": "SEO meta description (120-150 znaków) z wezwaniem do działania"
            }
            Wszystkie treści w języku polskim. Pamiętaj o słowach kluczowych związanych z AI i biznesem.`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            setCaseData(JSON.parse(jsonStr));
            showToast('Case Study wygenerowane!', 'success');
        } catch (e: any) {
            console.error('Case generation error:', e);
            showToast('Błąd generowania: ' + e.message, 'error');
        } finally {
            setGeneratingCase(false);
        }
    };

    const publishCaseStudy = async () => {
        if (!caseData) return;
        try {
            await addCaseStudy({
                slug: caseData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                color: '#3b82f6',
                featured: false,
                order: 10,
                year: '2025',
                translations: {
                    pl: {
                        category: caseData.category,
                        title: caseData.title,
                        client: clients.find(c => c.id === form.userId)?.name,
                        industry: caseData.industry,
                        description: caseData.description,
                        challenge: caseData.challenge,
                        solution: caseData.solution,
                        results: caseData.results,
                        resultsStats: caseData.stats,
                        technologies: caseData.technologies,
                        metaTitle: caseData.metaTitle,
                        metaDescription: caseData.metaDescription
                    }
                }
            });
            showToast('Case Study opublikowane w Portfolio! 🚀', 'success');
            setCaseData(null);
        } catch (e: any) {
            showToast('Błąd publikacji: ' + e.message, 'error');
        }
    };

    return (
        <AdminLayout>
            <div className="crm-page">
                <div className="crm-header">
                    <div>
                        <h1 className="crm-title">Procesy i Realizacje 🛠️</h1>
                        <p className="crm-subtitle">Zarządzaj zleceniami i projektami które wyświetlają się i aktualizują natychmiastowo w Panelu Klienta.</p>
                    </div>
                    <button className="crm-btn-primary" onClick={() => openNew()}>+ Nowy Projekt Klienta</button>
                </div>

                {loading ? (
                    <div className="crm-loading">{[1, 2, 3, 4].map(i => <div key={i} className="crm-skeleton-row"></div>)}</div>
                ) : (
                    <div className="kanban-board">
                        {columns.map(col => {
                            const colProjects = projects.filter(p => p.status === col.key);
                            return (
                                <div key={col.key} className="kanban-column"
                                    onDragOver={e => e.preventDefault()}
                                    onDrop={() => handleDrop(col.key)}>
                                    <div className="kanban-column-header" style={{ borderBottomColor: col.color }}>
                                        <h3>{col.icon} {col.title}</h3>
                                        <span className="kanban-count">{colProjects.length}</span>
                                    </div>
                                    <div className="kanban-cards">
                                        {colProjects.map(p => {
                                            const clientName = clients.find(c => c.id === p.userId)?.name || 'Nieprzypisany';

                                            return (
                                                <div key={p.id} className="kanban-card" draggable
                                                    onDragStart={() => handleDragStart(p.id)} onClick={() => openEdit(p)}>
                                                    <div className="kanban-card-priority" style={{ background: col.color }}></div>
                                                    <h4 style={{ fontSize: '1.05rem', marginBottom: 8, marginTop: 4 }}>{p.title}</h4>

                                                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 12 }}>
                                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Klient układu</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>👤 {clientName}</div>
                                                    </div>

                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                                        <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                                                            <div style={{ height: '100%', background: col.color, width: `${p.progress}%`, transition: 'all 0.3s' }}></div>
                                                        </div>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: col.color }}>{p.progress}%</span>
                                                    </div>

                                                    <div className="kanban-card-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, marginTop: 4 }}>
                                                        <span className="crm-status-badge" style={{ background: col.color + '20', color: col.color, borderColor: col.color + '40', fontSize: '0.7rem', padding: '2px 8px' }}>
                                                            {p.id.slice(-6).toUpperCase()}
                                                        </span>
                                                        <button className="crm-btn-icon crm-btn-danger" onClick={e => { e.stopPropagation(); handleDelete(p.id); }} style={{ fontSize: '0.7rem' }}>🗑️</button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <button className="kanban-add-btn" onClick={() => openNew(col.key)}>+ Utwórz Proces</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {showModal && (
                    <div className="crm-modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="crm-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 800, width: '90%' }}>
                            <h2>{editingProject ? 'Edytuj Realizację' : 'Nowa Realizacja (Dla Klienta)'}</h2>
                            <div className="crm-modal-form">
                                <div className="crm-form-group"><label>Tytuł Projektu / Zakupiona Usługa</label>
                                    <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                                        <select
                                            value={services.some(s => (s.translations?.pl?.title || s.slug) === form.title) ? form.title : ''}
                                            onChange={e => {
                                                if (e.target.value) setForm({ ...form, title: e.target.value });
                                            }}
                                            style={{ marginBottom: 4 }}
                                        >
                                            <option value="">-- Wybierz usługę z bazy CMS --</option>
                                            {services.map(s => {
                                                const serviceTitle = s.translations?.pl?.title || s.slug;
                                                return <option key={s.slug} value={serviceTitle}>{serviceTitle}</option>
                                            })}
                                        </select>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>Lub wpisz własną (niestandardową):</span>
                                            <input style={{ flex: 1, margin: 0 }} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Nazwa usługi..." />
                                        </div>
                                    </div>
                                </div>

                                <div className="crm-form-group"><label>Klient / Właściciel Zlecenia</label>
                                    <select value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })}>
                                        <option value="">Wybierz klienta (Opcjonalnie)</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                                        ))}
                                    </select>
                                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                                        Po przypisaniu użytkownika, projekt będzie dla niego widoczny w jego Panelu Klienta ECM.
                                    </p>
                                </div>

                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>Obecny Status Czasowy</label>
                                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as ProjectStatus })}>
                                            {columns.map(c => <option key={c.key} value={c.key}>{c.title}</option>)}
                                        </select>
                                    </div>
                                    <div className="crm-form-group"><label>Procent Ukończenia (%)</label>
                                        <input type="number" min="0" max="100" value={form.progress} onChange={e => setForm({ ...form, progress: parseInt(e.target.value) || 0 })} />
                                    </div>
                                </div>
                            </div>

                            {(() => {
                                const matchingService = services.find(s => (s.translations?.pl?.title || s.slug) === form.title);
                                if (matchingService?.internalKnowledge) {
                                    return (
                                        <div style={{ marginTop: 24, padding: 20, background: 'linear-gradient(135deg, rgba(236,72,153,0.05), rgba(139,92,246,0.05))', border: '1px solid rgba(236,72,153,0.2)', borderRadius: 16 }}>
                                            <h4 style={{ fontSize: 13, color: '#ec4899', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span>🧠</span> Baza Wiedzy (Instrukcja dla Zespołu):
                                            </h4>
                                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap', lineHeight: 1.6, maxHeight: 200, overflowY: 'auto', paddingRight: 8 }}>
                                                {matchingService.internalKnowledge}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}

                            {/* PROJECT AI ASSISTANT RAG */}
                            <div style={{ marginTop: 24, padding: 20, background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 16 }}>
                                <h4 style={{ fontSize: 13, color: '#3b82f6', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span>🤖</span> Asystent Projektowy RAG (Chatbot Wiedzy)
                                </h4>
                                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                                    <input
                                        type="text"
                                        value={aiQuestion}
                                        onChange={e => setAiQuestion(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleAskAI()}
                                        placeholder="Zadaj pytanie asystentowi (np. Jak wdrożyć krok 4?)..."
                                        style={{ flex: 1, padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: 14 }}
                                    />
                                    <button
                                        onClick={handleAskAI}
                                        disabled={aiLoading || !aiQuestion.trim()}
                                        style={{ padding: '0 24px', borderRadius: 12, background: aiLoading ? 'rgba(59,130,246,0.3)' : '#3b82f6', color: 'white', fontWeight: 700, border: 'none', cursor: aiLoading ? 'wait' : 'pointer', fontSize: 14, transition: 'all 0.2s' }}
                                    >
                                        {aiLoading ? 'Myśli...' : 'Zapytaj'}
                                    </button>
                                </div>
                                {aiAnswer && (
                                    <div style={{ padding: 16, background: 'rgba(0,0,0,0.4)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                        {aiAnswer}
                                    </div>
                                )}
                            </div>

                            {/* PROJECT VAULT (ONLY EDIT MODE) */}
                            {editingProject && (
                                <div style={{ marginTop: 24 }}>
                                    <ProjectVault projectId={editingProject.id} isAdmin={true} />
                                </div>
                            )}

                            {/* CASE STUDY GENERATOR (FOR COMPLETED PROJECTS) */}
                            {editingProject && form.status === 'Ukończone' && (
                                <div style={{ marginTop: 24, padding: 24, background: 'linear-gradient(135deg, #10b98115, #3b82f615)', border: '1px solid #10b98140', borderRadius: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <div>
                                            <h4 style={{ margin: 0, color: '#10b981', fontWeight: 800 }}>✨ Automatyczne Case Study</h4>
                                            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Zamień ukończony projekt w profesjonalny wpis do Portfolo.</p>
                                        </div>
                                        <button
                                            onClick={generateCaseStudy}
                                            disabled={generatingCase}
                                            style={{ padding: '10px 20px', borderRadius: 12, background: '#10b981', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                                        >
                                            {generatingCase ? 'Generowanie...' : 'Generuj (AI)'}
                                        </button>
                                    </div>

                                    {caseData && (
                                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <h5 style={{ margin: '0 0 12px', fontSize: 16 }}>{caseData.title}</h5>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                                                <div>
                                                    <strong style={{ display: 'block', color: '#10b981', marginBottom: 4 }}>Wyzwanie:</strong>
                                                    {caseData.challenge}
                                                </div>
                                                <div>
                                                    <strong style={{ display: 'block', color: '#3b82f6', marginBottom: 4 }}>Wynik:</strong>
                                                    {caseData.results}
                                                </div>
                                            </div>
                                            <button
                                                onClick={publishCaseStudy}
                                                style={{ width: '100%', marginTop: 20, padding: '12px', borderRadius: 12, background: 'white', color: 'black', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                                            >
                                                🚀 Publikuj w Portfolio
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="crm-modal-actions" style={{ marginTop: 32 }}>
                                <button className="crm-btn-ghost" onClick={() => setShowModal(false)}>Anuluj</button>
                                <button className="crm-btn-primary" onClick={handleSave}>{editingProject ? 'Zapisz Wdrożenie' : 'Utwórz i Dodaj do Panelu'}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
