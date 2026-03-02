'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
    KanbanTask, KanbanColumn,
    getKanbanTasks, addKanbanTask, updateKanbanTask, deleteKanbanTask,
} from '@/lib/firestoreService';
import { useLanguage } from '@/context/LanguageContext';

const columns: { key: KanbanColumn; emoji: string; color: string }[] = [
    { key: 'todo', emoji: '📋', color: '#6b7280' },
    { key: 'inprogress', emoji: '🔨', color: '#3b82f6' },
    { key: 'review', emoji: '👁️', color: '#f59e0b' },
    { key: 'done', emoji: '✅', color: '#10b981' },
];

const priorityColors = { low: '#6b7280', medium: '#3b82f6', high: '#f59e0b', urgent: '#ef4444' };

export default function KanbanPage() {
    const { T } = useLanguage();
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
        if (confirm(T('admin.kanban.deleteConfirm'))) { await deleteKanbanTask(id); loadTasks(); }
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
                        <h1 className="crm-title">📋 {T('admin.kanban.title')}</h1>
                        <p className="crm-subtitle">{T('admin.kanban.subtitle', { count: tasks.length })}</p>
                    </div>
                    <button className="crm-btn-primary" onClick={() => openNew()}>+ {T('admin.kanban.newTask')}</button>
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
                                        <h3>{col.emoji} {T(`admin.kanban.col.${col.key}`)}</h3>
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
                                                        {T(`admin.kanban.priority.${t.priority}`)}
                                                    </span>
                                                    <button className="crm-btn-icon crm-btn-danger" onClick={e => { e.stopPropagation(); handleDelete(t.id); }} style={{ fontSize: '0.7rem' }}>🗑️</button>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="kanban-add-btn" onClick={() => openNew(col.key)}>+ {T('admin.kanban.btnAdd')}</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {showModal && (
                    <div className="crm-modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="crm-modal" onClick={e => e.stopPropagation()}>
                            <h2>{editingTask ? T('admin.kanban.editTask') : T('admin.kanban.newTask')}</h2>
                            <div className="crm-modal-form">
                                <div className="crm-form-group"><label>{T('admin.kanban.form.title')}</label>
                                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder={T('admin.kanban.form.titlePlaceholder')} />
                                </div>
                                <div className="crm-form-group"><label>{T('admin.kanban.form.description')}</label>
                                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder={T('admin.kanban.form.descPlaceholder')} rows={3} />
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>{T('admin.kanban.form.column')}</label>
                                        <select value={form.column} onChange={e => setForm({ ...form, column: e.target.value as KanbanColumn })}>
                                            {columns.map(c => <option key={c.key} value={c.key}>{c.emoji} {T(`admin.kanban.col.${c.key}`)}</option>)}
                                        </select>
                                    </div>
                                    <div className="crm-form-group"><label>{T('admin.kanban.form.priority')}</label>
                                        <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as KanbanTask['priority'] })}>
                                            <option value="low">{T('admin.kanban.priority.low')}</option>
                                            <option value="medium">{T('admin.kanban.priority.medium')}</option>
                                            <option value="high">{T('admin.kanban.priority.high')}</option>
                                            <option value="urgent">{T('admin.kanban.priority.urgent')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>{T('admin.kanban.form.client')}</label>
                                        <input value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} placeholder={T('admin.kanban.form.clientPlaceholder')} />
                                    </div>
                                    <div className="crm-form-group"><label>{T('admin.kanban.form.deadline')}</label>
                                        <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="crm-modal-actions">
                                <button className="crm-btn-ghost" onClick={() => setShowModal(false)}>{T('admin.kanban.modal.cancel')}</button>
                                <button className="crm-btn-primary" onClick={handleSave}>{editingTask ? T('admin.kanban.modal.save') : T('admin.kanban.modal.create')}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
