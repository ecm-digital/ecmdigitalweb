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
import { useLanguage } from '@/context/LanguageContext';

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
    const { T, lang } = useLanguage();

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

    useEffect(() => {
        loadData();
        const onRefresh = () => { loadData(); showToast(T('admin.campaigns.toast.refreshed'), 'success'); };
        window.addEventListener('campaign-added', onRefresh);
        return () => window.removeEventListener('campaign-added', onRefresh);
    }, []);

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
        if (confirm(T('admin.campaigns.deleteConfirm'))) { await deleteCampaign(id); loadData(); }
    };

    const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
    const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
    const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

    return (
        <AdminLayout>
            <div className="crm-page">
                <div className="crm-header">
                    <div>
                        <h1 className="crm-title">📢 {T('admin.campaigns.title')}</h1>
                        <p className="crm-subtitle">{T('admin.campaigns.subtitle', {
                            budget: totalBudget.toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US'),
                            spent: totalSpent.toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US'),
                            conversions: totalConversions
                        })}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="crm-btn-secondary" style={{ border: '1px solid #3b82f6', color: '#3b82f6' }} onClick={() => alert(T('admin.campaigns.syncAlert'))}>🔌 {T('admin.campaigns.sync')}</button>
                        <button className="crm-btn-primary" onClick={openNew}>+ {T('admin.campaigns.new')}</button>
                    </div>
                </div>

                {/* Campaign Cards */}
                {loading ? (
                    <div className="crm-loading">{[1, 2, 3].map(i => <div key={i} className="crm-skeleton-row"></div>)}</div>
                ) : campaigns.length === 0 ? (
                    <div className="crm-empty"><span className="crm-empty-icon">📢</span><p>{T('admin.campaigns.noCampaigns')}</p></div>
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
                                            {T(`admin.campaigns.status.${c.status.toLowerCase().replace('ą', 'a').replace('ó', 'o').replace('ś', 's').replace('ż', 'z').replace('ć', 'c').replace('ę', 'e').replace('ł', 'l').replace('ń', 'n') === 'wstrzymana' ? 'paused' : c.status.toLowerCase().replace('ą', 'a').replace('ó', 'o').replace('ś', 's').replace('ż', 'z').replace('ć', 'c').replace('ę', 'e').replace('ł', 'l').replace('ń', 'n') === 'planowana' ? 'planned' : c.status.toLowerCase().replace('ą', 'a').replace('ó', 'o').replace('ś', 's').replace('ż', 'z').replace('ć', 'c').replace('ę', 'e').replace('ł', 'l').replace('ń', 'n') === 'aktywna' ? 'active' : 'finished'}`)}
                                        </span>
                                    </div>
                                    {c.clientName && <p className="crm-campaign-client">👤 {c.clientName}</p>}
                                    <div className="crm-campaign-metrics">
                                        <div className="crm-metric"><span className="crm-metric-value">{c.clicks.toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US')}</span><span className="crm-metric-label">{T('admin.campaigns.metrics.clicks')}</span></div>
                                        <div className="crm-metric"><span className="crm-metric-value">{c.conversions}</span><span className="crm-metric-label">{T('admin.campaigns.metrics.conversions')}</span></div>
                                        <div className="crm-metric"><span className="crm-metric-value">{c.cpa} PLN</span><span className="crm-metric-label">{T('admin.campaigns.metrics.cpa')}</span></div>
                                    </div>
                                    <div className="crm-budget-bar">
                                        <div className="crm-budget-info">
                                            <span>{c.spent.toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US')} / {c.budget.toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US')} PLN</span>
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
                                                ✨ {T('admin.campaigns.aiContent')}
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
                            <h2>{editingCampaign ? T('admin.campaigns.modal.edit') : T('admin.campaigns.modal.new')}</h2>
                            <div className="crm-modal-form">
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>{T('admin.campaigns.modal.name')}</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={T('admin.campaigns.modal.namePlaceholder')} /></div>
                                    <div className="crm-form-group"><label>{T('admin.campaigns.modal.platform')}</label>
                                        <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
                                            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>{T('admin.campaigns.modal.client')}</label>
                                        <select value={form.clientId} onChange={e => { const cl = clients.find(c => c.id === e.target.value); setForm({ ...form, clientId: e.target.value, clientName: cl?.name || '' }); }}>
                                            <option value="">{T('admin.campaigns.modal.noClient')}</option>
                                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="crm-form-group"><label>{T('admin.campaigns.modal.status')}</label>
                                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as CampaignStatus })}>
                                            <option value="Planowana">{T('admin.campaigns.status.planned')}</option>
                                            <option value="Aktywna">{T('admin.campaigns.status.active')}</option>
                                            <option value="Wstrzymana">{T('admin.campaigns.status.paused')}</option>
                                            <option value="Zakończona">{T('admin.campaigns.status.finished')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>{T('admin.campaigns.modal.startDate')}</label><input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
                                    <div className="crm-form-group"><label>{T('admin.campaigns.modal.endDate')}</label><input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>{T('admin.campaigns.modal.budget')}</label><input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: parseInt(e.target.value) || 0 })} /></div>
                                    <div className="crm-form-group"><label>{T('admin.campaigns.modal.spent')}</label><input type="number" value={form.spent} onChange={e => setForm({ ...form, spent: parseInt(e.target.value) || 0 })} /></div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>{T('admin.campaigns.modal.clicks')}</label><input type="number" value={form.clicks} onChange={e => setForm({ ...form, clicks: parseInt(e.target.value) || 0 })} /></div>
                                    <div className="crm-form-group"><label>{T('admin.campaigns.modal.conversions')}</label><input type="number" value={form.conversions} onChange={e => setForm({ ...form, conversions: parseInt(e.target.value) || 0 })} /></div>
                                </div>
                            </div>
                            <div className="crm-modal-actions">
                                <button className="crm-btn-ghost" onClick={() => setShowModal(false)}>{T('admin.offers.modal.cancel')}</button>
                                <button className="crm-btn-primary" onClick={handleSave}>{editingCampaign ? T('admin.campaigns.save') : T('admin.campaigns.create')}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
