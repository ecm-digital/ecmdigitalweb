'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
    Client, ClientStatus,
    getClients, addClient, updateClient, deleteClient, addNotification
} from '@/lib/firestoreService';
import { useNotifications } from '@/context/NotificationContext';
import { useAgency } from '@/context/AgencyContext';
import { useLanguage } from '@/context/LanguageContext';
import { AIService } from '@/services/aiService';

const statusColors: Record<ClientStatus, string> = {
    Lead: '#f59e0b',
    Prospekt: '#3b82f6',
    Klient: '#10b981',
    VIP: '#8b5cf6',
};

const avatarColors = ['#e94560', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

export default function AdminClientsPage() {
    const { T, lang } = useLanguage();
    const { settings } = useAgency();
    const { showToast } = useNotifications();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [isScoring, setIsScoring] = useState(false);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<ClientStatus | 'all'>('all');
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const [form, setForm] = useState({
        name: '', company: '', email: '', phone: '',
        status: 'Lead' as ClientStatus, source: '', service: '', value: 0, notes: '',
    });

    const loadClients = async () => {
        setLoading(true);
        try {
            const data = await getClients();
            setClients(data);
        } catch (err) {
            console.error(err);
            showToast(T('admin.crm.toast.loadingError'), 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAIScore = async () => {
        const leads = clients.filter(c => c.status === 'Lead');
        if (leads.length === 0) {
            showToast(T('admin.crm.toast.noLeads'), 'info');
            return;
        }

        setIsScoring(true);
        showToast(T('admin.crm.toast.scanningInfo', { count: leads.length }), 'info');

        try {
            for (const lead of leads) {
                const result = await AIService.scoreLead(lead);
                if (result.text) {
                    const parsed = JSON.parse(result.text);
                    await updateClient(lead.id, {
                        notes: (lead.notes || '') + `\n\n[AI SCORE: ${parsed.score}/100 - ${parsed.category}]\nRationale: ${parsed.rationale}`
                    });
                }
            }
            showToast(T('admin.crm.toast.scannedSuccess'), 'success');
            loadClients();
        } catch (err) {
            console.error('AI Scoring Error:', err);
            showToast(T('admin.crm.toast.scanError'), 'error');
        } finally {
            setIsScoring(false);
        }
    };

    useEffect(() => { loadClients(); }, []);

    const openNew = () => {
        setEditingClient(null);
        setForm({ name: '', company: '', email: '', phone: '', status: 'Lead', source: T('admin.crm.source.manual'), service: '', value: 0, notes: '' });
        setShowModal(true);
    };

    const openEdit = (c: Client) => {
        setEditingClient(c);
        setForm({ name: c.name, company: c.company, email: c.email, phone: c.phone, status: c.status, source: c.source, service: c.service || '', value: c.value, notes: c.notes });
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (editingClient) {
                await updateClient(editingClient.id, form);
                showToast(T('admin.crm.toast.updated'), 'success');
            } else {
                const clientId = await addClient(form);
                showToast(T('admin.crm.toast.added'), 'success');

                // Add notification
                await addNotification({
                    title: T('admin.crm.toast.added'),
                    message: `${T('admin.crm.modal.new')}: ${form.name} (${form.company || '—'})`,
                    type: 'lead',
                    link: `/admin/clients`
                });
            }
            setShowModal(false);
            loadClients();
        } catch (err) {
            console.error(err);
            showToast(T('admin.crm.toast.saveError'), 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm(T('admin.crm.confirmDelete'))) {
            try {
                await deleteClient(id);
                showToast(T('admin.crm.toast.deleted'), 'info');
                loadClients();
            } catch (err) {
                showToast(T('admin.crm.toast.deleteError'), 'error');
            }
        }
    };

    const filtered = clients
        .filter(c => filterStatus === 'all' || c.status === filterStatus)
        .filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.company.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <AdminLayout>
            <div className="crm-page">
                <div className="crm-header">
                    <div>
                        <h1 className="crm-title">👥 {T('admin.crm.title')}</h1>
                        <p className="crm-subtitle">{T('admin.crm.subtitle', { count: clients.length })}</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className={`crm-btn-ghost ${isScoring ? 'animate-pulse opacity-50' : ''}`}
                            onClick={handleAIScore}
                            disabled={isScoring}
                        >
                            {isScoring ? `🤖 ${T('admin.crm.scanning')}` : `✨ ${T('admin.crm.scanLeads')}`}
                        </button>
                        <button className="crm-btn-primary" onClick={openNew}>+ {T('admin.crm.newClient')}</button>
                    </div>
                </div>

                <div className="crm-mini-stats">
                    {(['Lead', 'Prospekt', 'Klient', 'VIP'] as ClientStatus[]).map(s => (
                        <div key={s} className="crm-mini-stat" onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
                            style={{ borderColor: filterStatus === s ? statusColors[s] : 'rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                            <span className="crm-mini-stat-dot" style={{ background: statusColors[s] }}></span>
                            <span className="crm-mini-stat-label">{T(`admin.crm.status.${s}`)}</span>
                            <span className="crm-mini-stat-count">{clients.filter(c => c.status === s).length}</span>
                        </div>
                    ))}
                </div>

                <div className="crm-search-bar">
                    <input className="crm-search-input" placeholder={T('admin.crm.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                {loading ? (
                    <div className="crm-loading">
                        {[1, 2, 3].map(i => <div key={i} className="crm-skeleton-row" style={{ height: '70px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '12px' }}></div>)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="crm-empty"><span className="crm-empty-icon">👥</span><p>{T('admin.crm.noClients')}</p></div>
                ) : (
                    <div className="crm-table-wrap">
                        <table className="crm-table">
                            <thead><tr><th>{T('admin.crm.table.client')}</th><th>{T('admin.crm.table.company')}</th><th>{T('admin.crm.table.status')}</th><th>{T('admin.crm.table.service')}</th><th>{T('admin.crm.table.value')}</th><th>{T('admin.crm.table.source')}</th><th></th></tr></thead>
                            <tbody>
                                {filtered.map(c => (
                                    <tr key={c.id}>
                                        <td>
                                            <div className="crm-client-cell">
                                                <div className="crm-avatar" style={{ background: avatarColors[c.name.charCodeAt(0) % avatarColors.length] }}>
                                                    {c.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="crm-client-name">{c.name}</div>
                                                    <div className="crm-client-email">{c.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="crm-cell-secondary">{c.company || '—'}</td>
                                        <td><span className="crm-status-badge" style={{ background: statusColors[c.status] + '20', color: statusColors[c.status], borderColor: statusColors[c.status] + '40' }}>{T(`admin.crm.status.${c.status}`)}</span></td>
                                        <td><div style={{ fontSize: '0.85rem', color: '#8b5cf6', fontWeight: 500 }}>{c.service || '—'}</div></td>
                                        <td className="crm-cell-value">{c.value > 0 ? `${c.value.toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US')} PLN` : '—'}</td>
                                        <td className="crm-cell-secondary">{c.source || '—'}</td>
                                        <td>
                                            <div className="crm-actions">
                                                <button className="crm-btn-icon" onClick={() => openEdit(c)}>✏️</button>
                                                <button className="crm-btn-icon crm-btn-danger" onClick={() => handleDelete(c.id)}>🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showModal && (
                    <div className="crm-modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="crm-modal" onClick={e => e.stopPropagation()}>
                            <h2 style={{ marginBottom: '24px' }}>{editingClient ? T('admin.crm.modal.edit') : T('admin.crm.modal.new')}</h2>
                            <div className="crm-modal-form">
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>{T('admin.crm.modal.name')}</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={T('admin.crm.modal.namePlaceholder')} /></div>
                                    <div className="crm-form-group"><label>{T('admin.crm.table.company')}</label><input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder={T('admin.crm.modal.companyPlaceholder')} /></div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>{T('admin.crm.modal.email')}</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jan@firma.pl" /></div>
                                    <div className="crm-form-group"><label>{T('admin.crm.modal.phone')}</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+48 500 000 000" /></div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>{T('admin.crm.table.status')}</label>
                                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as ClientStatus })}>
                                            <option value="Lead">{T('admin.crm.status.Lead')}</option>
                                            <option value="Prospekt">{T('admin.crm.status.Prospekt')}</option>
                                            <option value="Klient">{T('admin.crm.status.Klient')}</option>
                                            <option value="VIP">{T('admin.crm.status.VIP')}</option>
                                        </select>
                                    </div>
                                    <div className="crm-form-group"><label>{T('admin.crm.table.service')}</label>
                                        <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                                            <option value="">{T('admin.crm.modal.selectService')}</option>
                                            {settings?.services?.map((s, i) => (
                                                <option key={i} value={s.title}>{s.icon} {s.title}</option>
                                            ))}
                                            <option value="Inna">{T('admin.crm.modal.otherService')}</option>
                                        </select>
                                    </div>
                                    <div className="crm-form-group"><label>{T('admin.crm.table.source')}</label><input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder={T('admin.crm.modal.sourcePlaceholder')} /></div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>{T('admin.crm.table.value')} (PLN)</label><input type="number" value={form.value} onChange={e => setForm({ ...form, value: parseInt(e.target.value) || 0 })} /></div>
                                    <div className="crm-form-group"><label>{T('admin.crm.modal.notes')}</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder={T('admin.crm.modal.notesPlaceholder')} /></div>
                                </div>
                            </div>
                            <div className="crm-modal-actions" style={{ marginTop: '32px' }}>
                                <button className="crm-btn-ghost" onClick={() => setShowModal(false)}>{T('admin.crm.modal.cancel')}</button>
                                <button className="crm-btn-primary" onClick={handleSave}>{editingClient ? T('admin.crm.modal.save') : T('admin.crm.modal.add')}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
