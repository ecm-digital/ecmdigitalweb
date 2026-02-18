'use client';

'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
    Campaign, CampaignStatus,
    getCampaigns, addCampaign, updateCampaign, deleteCampaign, getClients, Client,
} from '@/lib/firestoreService';
import { useNotifications } from '@/context/NotificationContext';
import ContentGenerator from '@/components/ContentGenerator';
import { AIService } from '@/services/aiService';

const statusColors: Record<CampaignStatus, string> = {
    Planowana: '#f59e0b',
    Aktywna: '#10b981',
    Wstrzymana: '#6b7280',
    Zakończona: '#3b82f6',
};

const platforms = ['Google Ads', 'Facebook Ads', 'Instagram Ads', 'TikTok Ads', 'LinkedIn Ads', 'YouTube Ads'];

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
    const [selectedCampaignName, setSelectedCampaignName] = useState('');
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const { showToast } = useNotifications();

    const [form, setForm] = useState({
        name: '', platform: 'Google Ads', status: 'Planowana' as CampaignStatus,
        budget: 0, spent: 0, clicks: 0, conversions: 0, cpa: 0,
        clientId: '', clientName: '', startDate: '', endDate: '',
    });

    const loadData = async () => {
        setLoading(true);
        const [c, cl] = await Promise.all([getCampaigns(), getClients()]);
        setCampaigns(c);
        setClients(cl);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const openNew = () => {
        setEditingCampaign(null);
        setForm({ name: '', platform: 'Google Ads', status: 'Planowana', budget: 0, spent: 0, clicks: 0, conversions: 0, cpa: 0, clientId: '', clientName: '', startDate: '', endDate: '' });
        setShowModal(true);
    };

    const openEdit = (c: Campaign) => {
        setEditingCampaign(c);
        setForm({ name: c.name, platform: c.platform, status: c.status, budget: c.budget, spent: c.spent, clicks: c.clicks, conversions: c.conversions, cpa: c.cpa, clientId: c.clientId, clientName: c.clientName, startDate: c.startDate, endDate: c.endDate });
        setShowModal(true);
    };

    const handleSave = async () => {
        const data = { ...form, cpa: form.conversions > 0 ? Math.round(form.spent / form.conversions) : 0 };
        if (editingCampaign) {
            await updateCampaign(editingCampaign.id, data);
        } else {
            await addCampaign(data);
        }
        setShowModal(false);
        loadData();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Usunąć kampanię?')) { await deleteCampaign(id); loadData(); }
    };

    const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
    const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
    const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

    return (
        <AdminLayout>
            <div className="crm-page">
                <div className="crm-header">
                    <div>
                        <h1 className="crm-title">📢 Kampanie</h1>
                        <p className="crm-subtitle">Budżet: {totalBudget.toLocaleString('pl-PL')} PLN · Wydano: {totalSpent.toLocaleString('pl-PL')} PLN · Konwersje: {totalConversions}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="crm-btn-secondary" style={{ border: '1px solid #3b82f6', color: '#3b82f6' }} onClick={() => alert('Synchronizacja z Google Ads (ID: 882-088-5833) wkrótce będzie dostępna! 🔌')}>🔌 Synchronizuj</button>
                        <button className="crm-btn-primary" onClick={openNew}>+ Nowa Kampania</button>
                    </div>
                </div>

                {/* Campaign Cards */}
                {loading ? (
                    <div className="crm-loading">{[1, 2, 3].map(i => <div key={i} className="crm-skeleton-row"></div>)}</div>
                ) : campaigns.length === 0 ? (
                    <div className="crm-empty"><span className="crm-empty-icon">📢</span><p>Brak kampanii. Dodaj pierwszą!</p></div>
                ) : (
                    <div className="crm-campaigns-grid">
                        {campaigns.map(c => {
                            const budgetPct = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0;
                            return (
                                <div key={c.id} className="crm-campaign-card">
                                    <div className="crm-campaign-header">
                                        <div>
                                            <h3>{c.name}</h3>
                                            <span className="crm-campaign-platform">{c.platform}</span>
                                        </div>
                                        <span className="crm-status-badge" style={{ background: statusColors[c.status] + '20', color: statusColors[c.status], borderColor: statusColors[c.status] + '40' }}>
                                            {c.status}
                                        </span>
                                    </div>
                                    {c.clientName && <p className="crm-campaign-client">👤 {c.clientName}</p>}
                                    <div className="crm-campaign-metrics">
                                        <div className="crm-metric"><span className="crm-metric-value">{c.clicks.toLocaleString()}</span><span className="crm-metric-label">Kliknięcia</span></div>
                                        <div className="crm-metric"><span className="crm-metric-value">{c.conversions}</span><span className="crm-metric-label">Konwersje</span></div>
                                        <div className="crm-metric"><span className="crm-metric-value">{c.cpa} PLN</span><span className="crm-metric-label">CPA</span></div>
                                    </div>
                                    <div className="crm-budget-bar">
                                        <div className="crm-budget-info">
                                            <span>{c.spent.toLocaleString('pl-PL')} / {c.budget.toLocaleString('pl-PL')} PLN</span>
                                            <span>{budgetPct}%</span>
                                        </div>
                                        <div className="crm-budget-track">
                                            <div className="crm-budget-fill" style={{ width: `${Math.min(budgetPct, 100)}%`, background: budgetPct > 90 ? '#ef4444' : '#10b981' }}></div>
                                        </div>
                                    </div>
                                    <div className="crm-offer-footer">
                                        <div className="flex gap-2">
                                            <span className="crm-cell-secondary">{c.startDate} → {c.endDate}</span>
                                            <button
                                                onClick={() => {
                                                    setSelectedCampaignName(c.name);
                                                    setIsGeneratorOpen(true);
                                                }}
                                                className="text-[10px] font-black text-brand-accent hover:text-white transition-colors uppercase tracking-widest"
                                            >
                                                ✨ AI Treści
                                            </button>
                                        </div>
                                        <div className="crm-actions">
                                            <button className="crm-btn-icon" onClick={() => openEdit(c)}>✏️</button>
                                            <button className="crm-btn-icon crm-btn-danger" onClick={() => handleDelete(c.id)}>🗑️</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <ContentGenerator
                    isOpen={isGeneratorOpen}
                    onClose={() => setIsGeneratorOpen(false)}
                    campaignName={selectedCampaignName}
                />

                {/* Modal */}
                {showModal && (
                    <div className="crm-modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="crm-modal crm-modal-lg" onClick={e => e.stopPropagation()}>
                            <h2>{editingCampaign ? 'Edytuj Kampanię' : 'Nowa Kampania'}</h2>
                            <div className="crm-modal-form">
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>Nazwa kampanii</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Kampania strony WWW Q1" /></div>
                                    <div className="crm-form-group"><label>Platforma</label>
                                        <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
                                            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>Klient</label>
                                        <select value={form.clientId} onChange={e => { const cl = clients.find(c => c.id === e.target.value); setForm({ ...form, clientId: e.target.value, clientName: cl?.name || '' }); }}>
                                            <option value="">Brak przypisania</option>
                                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="crm-form-group"><label>Status</label>
                                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as CampaignStatus })}>
                                            <option value="Planowana">Planowana</option>
                                            <option value="Aktywna">Aktywna</option>
                                            <option value="Wstrzymana">Wstrzymana</option>
                                            <option value="Zakończona">Zakończona</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>Data start</label><input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
                                    <div className="crm-form-group"><label>Data koniec</label><input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>Budżet (PLN)</label><input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: parseInt(e.target.value) || 0 })} /></div>
                                    <div className="crm-form-group"><label>Wydano (PLN)</label><input type="number" value={form.spent} onChange={e => setForm({ ...form, spent: parseInt(e.target.value) || 0 })} /></div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>Kliknięcia</label><input type="number" value={form.clicks} onChange={e => setForm({ ...form, clicks: parseInt(e.target.value) || 0 })} /></div>
                                    <div className="crm-form-group"><label>Konwersje</label><input type="number" value={form.conversions} onChange={e => setForm({ ...form, conversions: parseInt(e.target.value) || 0 })} /></div>
                                </div>
                            </div>
                            <div className="crm-modal-actions">
                                <button className="crm-btn-ghost" onClick={() => setShowModal(false)}>Anuluj</button>
                                <button className="crm-btn-primary" onClick={handleSave}>{editingCampaign ? 'Zapisz' : 'Utwórz'}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
