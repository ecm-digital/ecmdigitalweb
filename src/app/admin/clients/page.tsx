'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
    Client, ClientStatus,
    getClients, addClient, updateClient, deleteClient, addNotification
} from '@/lib/firestoreService';
import { useNotifications } from '@/context/NotificationContext';
import { useAgency } from '@/context/AgencyContext';
import { AIService } from '@/services/aiService';

const statusColors: Record<ClientStatus, string> = {
    Lead: '#f59e0b',
    Prospekt: '#3b82f6',
    Klient: '#10b981',
    VIP: '#8b5cf6',
};

const avatarColors = ['#e94560', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

export default function AdminClientsPage() {
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
            showToast('Błąd podczas ładowania klientów.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAIScore = async () => {
        const leads = clients.filter(c => c.status === 'Lead');
        if (leads.length === 0) {
            showToast('Brak nowych leadów do przeskanowania.', 'info');
            return;
        }

        setIsScoring(true);
        showToast(`AI skanuje ${leads.length} leadów...`, 'info');

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
            showToast('Leady zostały ocenione przez AI! 🤖', 'success');
            loadClients();
        } catch (err) {
            console.error('AI Scoring Error:', err);
            showToast('Błąd podczas skanowania leadów.', 'error');
        } finally {
            setIsScoring(false);
        }
    };

    useEffect(() => { loadClients(); }, []);

    const openNew = () => {
        setEditingClient(null);
        setForm({ name: '', company: '', email: '', phone: '', status: 'Lead', source: 'Ręczne dodanie', service: '', value: 0, notes: '' });
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
                showToast('Dane klienta zaktualizowane! ✅', 'success');
            } else {
                const clientId = await addClient(form);
                showToast('Nowy klient dodany! 👥', 'success');

                // Add notification
                await addNotification({
                    title: 'Nowy klient (CRM)',
                    message: `Dodano nowego klienta: ${form.name} (${form.company || 'Brak firmy'})`,
                    type: 'lead',
                    link: `/admin/clients`
                });
            }
            setShowModal(false);
            loadClients();
        } catch (err) {
            console.error(err);
            showToast('Wystąpił błąd podczas zapisywania.', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Usunąć klienta?')) {
            try {
                await deleteClient(id);
                showToast('Klient usunięty.', 'info');
                loadClients();
            } catch (err) {
                showToast('Błąd podczas usuwania.', 'error');
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
                        <h1 className="crm-title">👥 CRM Klienci</h1>
                        <p className="crm-subtitle">{clients.length} klientów w bazie</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className={`crm-btn-ghost ${isScoring ? 'animate-pulse opacity-50' : ''}`}
                            onClick={handleAIScore}
                            disabled={isScoring}
                        >
                            {isScoring ? '🤖 Skanowanie...' : '✨ Skanuj leady AI'}
                        </button>
                        <button className="crm-btn-primary" onClick={openNew}>+ Nowy Klient</button>
                    </div>
                </div>

                <div className="crm-mini-stats">
                    {(['Lead', 'Prospekt', 'Klient', 'VIP'] as ClientStatus[]).map(s => (
                        <div key={s} className="crm-mini-stat" onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
                            style={{ borderColor: filterStatus === s ? statusColors[s] : 'rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                            <span className="crm-mini-stat-dot" style={{ background: statusColors[s] }}></span>
                            <span className="crm-mini-stat-label">{s}</span>
                            <span className="crm-mini-stat-count">{clients.filter(c => c.status === s).length}</span>
                        </div>
                    ))}
                </div>

                <div className="crm-search-bar">
                    <input className="crm-search-input" placeholder="🔍 Szukaj klienta..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                {loading ? (
                    <div className="crm-loading">
                        {[1, 2, 3].map(i => <div key={i} className="crm-skeleton-row" style={{ height: '70px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '12px' }}></div>)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="crm-empty"><span className="crm-empty-icon">👥</span><p>Brak klientów</p></div>
                ) : (
                    <div className="crm-table-wrap">
                        <table className="crm-table">
                            <thead><tr><th>Klient</th><th>Firma</th><th>Status</th><th>Usługa</th><th>Wartość</th><th>Źródło</th><th></th></tr></thead>
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
                                        <td><span className="crm-status-badge" style={{ background: statusColors[c.status] + '20', color: statusColors[c.status], borderColor: statusColors[c.status] + '40' }}>{c.status}</span></td>
                                        <td><div style={{ fontSize: '0.85rem', color: '#8b5cf6', fontWeight: 500 }}>{c.service || '—'}</div></td>
                                        <td className="crm-cell-value">{c.value > 0 ? `${c.value.toLocaleString('pl-PL')} PLN` : '—'}</td>
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
                            <h2 style={{ marginBottom: '24px' }}>{editingClient ? 'Edytuj Klienta' : 'Nowy Klient'}</h2>
                            <div className="crm-modal-form">
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>Imię i nazwisko</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jan Kowalski" /></div>
                                    <div className="crm-form-group"><label>Firma</label><input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Nazwa firmy" /></div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>E-mail</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jan@firma.pl" /></div>
                                    <div className="crm-form-group"><label>Telefon</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+48 500 000 000" /></div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>Status</label>
                                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as ClientStatus })}>
                                            <option value="Lead">Lead</option><option value="Prospekt">Prospekt</option>
                                            <option value="Klient">Klient</option><option value="VIP">VIP</option>
                                        </select>
                                    </div>
                                    <div className="crm-form-group"><label>Usługa</label>
                                        <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                                            <option value="">Wybierz usługę...</option>
                                            {settings?.services?.map((s, i) => (
                                                <option key={i} value={s.title}>{s.icon} {s.title}</option>
                                            ))}
                                            <option value="Inna">Inna</option>
                                        </select>
                                    </div>
                                    <div className="crm-form-group"><label>Źródło</label><input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="Google, Polecenie..." /></div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>Wartość (PLN)</label><input type="number" value={form.value} onChange={e => setForm({ ...form, value: parseInt(e.target.value) || 0 })} /></div>
                                    <div className="crm-form-group"><label>Notatki</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Dodatkowe informacje..." /></div>
                                </div>
                            </div>
                            <div className="crm-modal-actions" style={{ marginTop: '32px' }}>
                                <button className="crm-btn-ghost" onClick={() => setShowModal(false)}>Anuluj</button>
                                <button className="crm-btn-primary" onClick={handleSave}>{editingClient ? 'Zapisz' : 'Dodaj'}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
