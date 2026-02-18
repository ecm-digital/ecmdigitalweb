'use client';

'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
    KanbanTask, KanbanColumn,
    getKanbanTasks, addKanbanTask, updateKanbanTask, deleteKanbanTask,
} from '@/lib/firestoreService';

const columns: { key: KanbanColumn; title: string; color: string }[] = [
    { key: 'todo', title: '📋 Do zrobienia', color: '#6b7280' },
    { key: 'inprogress', title: '🔨 W trakcie', color: '#3b82f6' },
    { key: 'review', title: '👁️ Review', color: '#f59e0b' },
    { key: 'done', title: '✅ Gotowe', color: '#10b981' },
];

const priorityColors = { low: '#6b7280', medium: '#3b82f6', high: '#f59e0b', urgent: '#ef4444' };
const priorityLabels = { low: 'Niski', medium: 'Średni', high: 'Wysoki', urgent: 'Pilne' };

export default function KanbanPage() {
    const [tasks, setTasks] = useState<KanbanTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
    const [draggedTask, setDraggedTask] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: '', description: '', column: 'todo' as KanbanColumn,
        priority: 'medium' as KanbanTask['priority'], clientName: '', deadline: '',
    });

    const loadTasks = async () => {
        setLoading(true);
        const data = await getKanbanTasks();
        setTasks(data);
        setLoading(false);
    };

    useEffect(() => { loadTasks(); }, []);

    const openNew = (column: KanbanColumn = 'todo') => {
        setEditingTask(null);
        setForm({ title: '', description: '', column, priority: 'medium', clientName: '', deadline: '' });
        setShowModal(true);
    };

    const openEdit = (t: KanbanTask) => {
        setEditingTask(t);
        setForm({ title: t.title, description: t.description, column: t.column, priority: t.priority, clientName: t.clientName, deadline: t.deadline });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (editingTask) {
            await updateKanbanTask(editingTask.id, form);
        } else {
            await addKanbanTask(form);
        }
        setShowModal(false);
        loadTasks();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Usunąć zadanie?')) { await deleteKanbanTask(id); loadTasks(); }
    };

    const handleDragStart = (taskId: string) => setDraggedTask(taskId);

    const handleDrop = async (column: KanbanColumn) => {
        if (!draggedTask) return;
        await updateKanbanTask(draggedTask, { column });
        setDraggedTask(null);
        loadTasks();
    };

    return (
        <AdminLayout>
            <div className="crm-page">
                <div className="crm-header">
                    <div>
                        <h1 className="crm-title">📋 Tablica Kanban</h1>
                        <p className="crm-subtitle">{tasks.length} zadań</p>
                    </div>
                    <button className="crm-btn-primary" onClick={() => openNew()}>+ Nowe Zadanie</button>
                </div>

                {loading ? (
                    <div className="crm-loading">{[1, 2, 3, 4].map(i => <div key={i} className="crm-skeleton-row"></div>)}</div>
                ) : (
                    <div className="kanban-board">
                        {columns.map(col => {
                            const colTasks = tasks.filter(t => t.column === col.key);
                            return (
                                <div key={col.key} className="kanban-column"
                                    onDragOver={e => e.preventDefault()}
                                    onDrop={() => handleDrop(col.key)}>
                                    <div className="kanban-column-header" style={{ borderBottomColor: col.color }}>
                                        <h3>{col.title}</h3>
                                        <span className="kanban-count">{colTasks.length}</span>
                                    </div>
                                    <div className="kanban-cards">
                                        {colTasks.map(t => (
                                            <div key={t.id} className="kanban-card" draggable
                                                onDragStart={() => handleDragStart(t.id)} onClick={() => openEdit(t)}>
                                                <div className="kanban-card-priority" style={{ background: priorityColors[t.priority] }}></div>
                                                <h4>{t.title}</h4>
                                                {t.description && <p className="kanban-card-desc">{t.description}</p>}
                                                <div className="kanban-card-meta">
                                                    {t.clientName && <span className="kanban-card-client">👤 {t.clientName}</span>}
                                                    {t.deadline && <span className="kanban-card-deadline">📅 {t.deadline}</span>}
                                                </div>
                                                <div className="kanban-card-footer">
                                                    <span className="crm-status-badge" style={{ background: priorityColors[t.priority] + '20', color: priorityColors[t.priority], borderColor: priorityColors[t.priority] + '40', fontSize: '0.7rem', padding: '2px 8px' }}>
                                                        {priorityLabels[t.priority]}
                                                    </span>
                                                    <button className="crm-btn-icon crm-btn-danger" onClick={e => { e.stopPropagation(); handleDelete(t.id); }} style={{ fontSize: '0.7rem' }}>🗑️</button>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="kanban-add-btn" onClick={() => openNew(col.key)}>+ Dodaj</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {showModal && (
                    <div className="crm-modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="crm-modal" onClick={e => e.stopPropagation()}>
                            <h2>{editingTask ? 'Edytuj Zadanie' : 'Nowe Zadanie'}</h2>
                            <div className="crm-modal-form">
                                <div className="crm-form-group"><label>Tytuł</label>
                                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Zaprojektować stronę główną" />
                                </div>
                                <div className="crm-form-group"><label>Opis</label>
                                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Szczegóły zadania..." rows={3} />
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>Kolumna</label>
                                        <select value={form.column} onChange={e => setForm({ ...form, column: e.target.value as KanbanColumn })}>
                                            {columns.map(c => <option key={c.key} value={c.key}>{c.title}</option>)}
                                        </select>
                                    </div>
                                    <div className="crm-form-group"><label>Priorytet</label>
                                        <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as KanbanTask['priority'] })}>
                                            <option value="low">Niski</option>
                                            <option value="medium">Średni</option>
                                            <option value="high">Wysoki</option>
                                            <option value="urgent">Pilne</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>Klient</label>
                                        <input value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} placeholder="Nazwa klienta" />
                                    </div>
                                    <div className="crm-form-group"><label>Deadline</label>
                                        <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="crm-modal-actions">
                                <button className="crm-btn-ghost" onClick={() => setShowModal(false)}>Anuluj</button>
                                <button className="crm-btn-primary" onClick={handleSave}>{editingTask ? 'Zapisz' : 'Utwórz'}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
