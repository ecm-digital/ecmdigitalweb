'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
    Offer, OfferStatus, OfferItem, Client,
    getOffers, addOffer, updateOffer, deleteOffer, getClients, addNotification
} from '@/lib/firestoreService';
import { useNotifications } from '@/context/NotificationContext';
import { useAgency } from '@/context/AgencyContext';
import { useLanguage } from '@/context/LanguageContext';

const statusColors: Record<OfferStatus, string> = {
    Robocza: '#6b7280',
    Wysłana: '#3b82f6',
    Zaakceptowana: '#10b981',
    Odrzucona: '#ef4444',
};

export default function OffersPage() {
    const { T, lang } = useLanguage();
    const { settings } = useAgency();
    const { showToast } = useNotifications();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
    const [filterStatus, setFilterStatus] = useState<OfferStatus | 'all'>('all');

    // AI Proposal State
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const [form, setForm] = useState({
        clientId: '', clientName: '', title: '', status: 'Robocza' as OfferStatus,
        items: [] as OfferItem[], validUntil: '', notes: '',
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const [o, c] = await Promise.all([getOffers(), getClients()]);
            setOffers(o);
            setClients(c);
        } catch (err) {
            console.error(err);
            showToast(T('admin.offers.toast.dataError'), 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const openNew = () => {
        setEditingOffer(null);
        setForm({ clientId: '', clientName: '', title: '', status: 'Robocza', items: [], validUntil: '', notes: '' });
        setShowModal(true);
    };

    const openEdit = (o: Offer) => {
        setEditingOffer(o);
        setForm({
            clientId: o.clientId, clientName: o.clientName, title: o.title, status: o.status,
            items: o.items, validUntil: o.validUntil, notes: o.notes,
        });
        setShowModal(true);
    };

    const addServiceItem = (service: any) => {
        setForm({
            ...form,
            items: [...form.items, {
                service: service.title,
                description: service.description,
                price: 0
            }]
        });
        showToast(T('admin.offers.toast.addedService', { name: service.title }), 'info');
    };

    const addProductItem = (product: any) => {
        const price = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;
        setForm({
            ...form,
            items: [...form.items, {
                service: product.name,
                description: product.description,
                price
            }]
        });
        showToast(T('admin.offers.toast.addedProduct', { name: product.name }), 'info');
    };

    const removeItem = (index: number) => {
        setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
    };

    const updateItemPrice = (index: number, price: number) => {
        const newItems = [...form.items];
        newItems[index].price = price;
        setForm({ ...form, items: newItems });
    };

    const totalPrice = form.items.reduce((sum, item) => sum + item.price, 0);

    const handleSave = async () => {
        if (!form.clientId || !form.title) {
            showToast(T('admin.offers.toast.formWarning'), 'warning');
            return;
        }

        const data = { ...form, totalPrice };
        try {
            if (editingOffer) {
                await updateOffer(editingOffer.id, data);
                showToast(T('admin.offers.toast.updated'), 'success');
            } else {
                await addOffer(data);
                showToast(T('admin.offers.toast.created'), 'success');

                await addNotification({
                    title: T('admin.offers.notification.newTitle'),
                    message: T('admin.offers.notification.newMessage', { title: form.title, client: form.clientName }),
                    type: 'offer',
                    link: `/admin/offers`
                });
            }
            setShowModal(false);
            loadData();
        } catch (err) {
            console.error(err);
            showToast(T('admin.offers.toast.saveError'), 'error');
        }
    };

    const handleStatusChange = async (id: string, status: OfferStatus) => {
        try {
            await updateOffer(id, { status });
            showToast(T('admin.offers.toast.statusChanged', { status: T(`admin.offers.status.${status.toLowerCase()}`) }), 'success');
            loadData();
        } catch (err) {
            showToast(T('admin.offers.toast.statusError'), 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm(T('admin.offers.toast.deleteConfirm'))) {
            try {
                await deleteOffer(id);
                showToast(T('common.success'), 'info');
                loadData();
            } catch (err) {
                showToast(T('admin.offers.toast.deleteError'), 'error');
            }
        }
    };

    const selectClient = (clientId: string) => {
        const client = clients.find(c => c.id === clientId);
        setForm({ ...form, clientId, clientName: client?.name || '' });
    };

    const handleGenerateOffer = async () => {
        if (!form.clientId) {
            showToast(T('admin.offers.toast.aiSelectClient'), 'warning');
            return;
        }
        if (!aiPrompt.trim()) {
            showToast(T('admin.offers.toast.aiDescribe'), 'warning');
            return;
        }

        setIsGenerating(true);
        try {
            const res = await fetch('/api/ai/generate-offer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientRequest: aiPrompt,
                    companyName: form.clientName || 'Klient Agencji',
                    clientId: form.clientId,
                })
            });

            if (!res.ok) throw new Error('Błąd API Gemini');
            const data = await res.json();

            // Build notes with strategy tag for internal display
            let notesContent = data.notes || '';
            if (data.strategy) {
                notesContent += `\n\n[STRATEGIA] ${data.strategy}`;
            }

            setForm(prev => ({
                ...prev,
                title: data.title || prev.title,
                notes: notesContent,
                items: data.items.map((i: any) => ({
                    service: i.service || T('admin.offers.ai.defaultService'),
                    description: i.description || '',
                    price: Number(i.price) || 0
                }))
            }));

            showToast(T('admin.offers.toast.aiSuccess'), 'success');
            setAiPrompt('');
        } catch (error) {
            console.error('AI Error:', error);
            showToast(T('admin.offers.toast.aiError'), 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const filtered = offers.filter(o => filterStatus === 'all' || o.status === filterStatus);
    const totalAccepted = offers.filter(o => o.status === 'Zaakceptowana').reduce((s, o) => s + o.totalPrice, 0);

    return (
        <AdminLayout>
            <div className="crm-page">
                <div className="crm-header">
                    <div>
                        <h1 className="crm-title">💼 {T('admin.offers.title')}</h1>
                        <p className="crm-subtitle">{T('admin.offers.subtitle', { count: offers.length, price: totalAccepted.toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US') })}</p>
                    </div>
                    <button className="crm-btn-primary" onClick={openNew}>+ {T('admin.offers.new')}</button>
                </div>

                <div className="crm-mini-stats">
                    {(['Robocza', 'Wysłana', 'Zaakceptowana', 'Odrzucona'] as OfferStatus[]).map(s => (
                        <div key={s} className="crm-mini-stat" onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
                            style={{ borderColor: filterStatus === s ? statusColors[s] : 'rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                            <span className="crm-mini-stat-dot" style={{ background: statusColors[s] }}></span>
                            <span className="crm-mini-stat-label">{T(`admin.offers.status.${s.toLowerCase()}`)}</span>
                            <span className="crm-mini-stat-count">{offers.filter(o => o.status === s).length}</span>
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="crm-loading">
                        {[1, 2, 3].map(i => <div key={i} className="crm-skeleton-row" style={{ height: '100px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', marginBottom: '16px' }}></div>)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="crm-empty">
                        <span className="crm-empty-icon">💼</span>
                        <p>{T('admin.offers.noOffers')}</p>
                    </div>
                ) : (
                    <div className="crm-offers-grid">
                        {filtered.map(o => (
                            <div key={o.id} className="crm-offer-card">
                                <div className="crm-offer-header">
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ marginBottom: '4px' }}>{o.title || T('admin.offers.untitled')}</h3>
                                        <p className="crm-offer-client">👤 {o.clientName || T('admin.offers.noClient')}</p>
                                    </div>
                                    <span className="crm-status-badge" style={{
                                        background: statusColors[o.status] + '20', color: statusColors[o.status],
                                        borderColor: statusColors[o.status] + '40'
                                    }}>{T(`admin.offers.status.${o.status.toLowerCase()}`)}</span>
                                </div>
                                <div className="crm-offer-items">
                                    {o.items.slice(0, 3).map((item, i) => (
                                        <div key={i} className="crm-offer-item-row">
                                            <span>{item.service}</span>
                                            <span>{item.price.toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US')} PLN</span>
                                        </div>
                                    ))}
                                    {o.items.length > 3 && <div className="crm-offer-more">{T('admin.offers.more', { count: o.items.length - 3 })}</div>}
                                </div>
                                <div className="crm-offer-total">
                                    <span>{T('admin.offers.total')}:</span>
                                    <span className="crm-offer-price">{o.totalPrice.toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US')} PLN</span>
                                </div>
                                <div className="crm-offer-footer">
                                    <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value as OfferStatus)} className="crm-status-select">
                                        <option value="Robocza">{T('admin.offers.status.draft')}</option>
                                        <option value="Wysłana">{T('admin.offers.status.sent')}</option>
                                        <option value="Zaakceptowana">{T('admin.offers.status.accepted')}</option>
                                        <option value="Odrzucona">{T('admin.offers.status.rejected')}</option>
                                    </select>
                                    <div className="crm-actions">
                                        <button className="crm-btn-icon" onClick={() => openEdit(o)}>✏️</button>
                                        <button className="crm-btn-icon crm-btn-danger" onClick={() => handleDelete(o.id)}>🗑️</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showModal && (
                    <div className="crm-modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="crm-modal crm-modal-lg" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                            <h2 style={{ marginBottom: '24px' }}>{editingOffer ? T('admin.offers.modal.edit') : T('admin.offers.modal.new')}</h2>
                            <div className="crm-modal-form">
                                <div className="crm-form-row" style={{ alignItems: 'flex-start' }}>
                                    <div className="crm-form-group">
                                        <label>{T('admin.offers.modal.clientLabel')}</label>
                                        <select value={form.clientId} onChange={e => selectClient(e.target.value)}>
                                            <option value="">{T('admin.offers.modal.clientPlaceholder')}</option>
                                            {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.company})</option>)}
                                        </select>
                                    </div>
                                    <div className="crm-form-group">
                                        <label>{T('admin.offers.modal.titleLabel')}</label>
                                        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder={T('admin.offers.modal.titlePlaceholder')} />
                                    </div>
                                </div>

                                {/* 🤖 OFFER INTELLIGENCE OS */}
                                {form.clientId && !editingOffer && (
                                    <div style={{
                                        margin: '12px 0 24px 0', padding: '24px',
                                        background: 'linear-gradient(145deg, rgba(139,92,246,0.06), rgba(59,130,246,0.06))',
                                        border: '1px solid rgba(139,92,246,0.2)', borderRadius: '24px',
                                        position: 'relative', overflow: 'hidden'
                                    }}>
                                        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent)', filter: 'blur(40px)', pointerEvents: 'none' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, position: 'relative', zIndex: 1 }}>
                                            <h4 style={{ margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <span style={{
                                                    width: 36, height: 36, borderRadius: 12,
                                                    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 18, boxShadow: '0 4px 15px rgba(139,92,246,0.3)',
                                                }}>⚡</span>
                                                <span style={{ color: 'white' }}>{T('admin.offers.ai.title')}</span>
                                            </h4>
                                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{T('admin.offers.ai.layer')}</span>
                                        </div>
                                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 16, lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
                                            {T('admin.offers.ai.description')}
                                        </p>

                                        <div style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 1 }}>
                                            <textarea
                                                value={aiPrompt}
                                                onChange={e => setAiPrompt(e.target.value)}
                                                placeholder={T('admin.offers.ai.placeholder')}
                                                rows={2}
                                                style={{ flex: 1, padding: 16, borderRadius: 16, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 13, resize: 'none', lineHeight: 1.5 }}
                                                disabled={isGenerating}
                                            />
                                            <button
                                                onClick={handleGenerateOffer}
                                                disabled={isGenerating || !aiPrompt.trim()}
                                                style={{
                                                    padding: '0 24px', borderRadius: 16,
                                                    background: isGenerating ? 'rgba(139,92,246,0.3)' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                                                    color: 'white', fontWeight: 800, fontSize: 13,
                                                    border: 'none', cursor: isGenerating ? 'wait' : 'pointer',
                                                    whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    boxShadow: isGenerating ? 'none' : '0 4px 15px rgba(139,92,246,0.3)',
                                                }}
                                            >
                                                {isGenerating ? `⏳ ${T('admin.offers.ai.btnGenerating')}` : `🧠 ${T('admin.offers.ai.btnCompose')}`}
                                            </button>
                                        </div>

                                        {/* AI Strategy Note (internal) */}
                                        {form.notes && form.notes.includes('[STRATEGIA]') && (
                                            <div style={{
                                                marginTop: 16, padding: '14px 18px', borderRadius: 14,
                                                background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)',
                                                position: 'relative', zIndex: 1,
                                            }}>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                                    {T('admin.offers.ai.strategy')}
                                                </div>
                                                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>
                                                    {form.notes.split('[STRATEGIA]')[1]?.trim() || ''}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* 🤖 END OFFER INTELLIGENCE */}

                                <div className="crm-form-row">
                                    <div className="crm-form-group">
                                        <label>{T('admin.offers.modal.validUntil')}</label>
                                        <input type="date" value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} />
                                    </div>
                                    <div className="crm-form-group">
                                        <label>{T('admin.crm.table.status')}</label>
                                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as OfferStatus })}>
                                            <option value="Robocza">{T('admin.offers.status.draft')}</option>
                                            <option value="Wysłana">{T('admin.offers.status.sent')}</option>
                                            <option value="Zaakceptowana">{T('admin.offers.status.accepted')}</option>
                                            <option value="Odrzucona">{T('admin.offers.status.rejected')}</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="crm-form-group" style={{ marginBottom: '32px' }}>
                                    <label style={{ color: '#8b5cf6', fontWeight: 600 }}>{T('admin.offers.modal.fromAgency')}</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '12px' }}>
                                        <div>
                                            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '8px' }}>{T('admin.offers.modal.services')}</p>
                                            <div className="crm-service-chips">
                                                {settings?.services?.map((t, i) => (
                                                    <button key={i} className="crm-service-chip" onClick={() => addServiceItem(t)}>
                                                        {t.icon} {t.title}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '8px' }}>{T('admin.offers.modal.products')}</p>
                                            <div className="crm-service-chips">
                                                {settings?.products?.map((p, i) => (
                                                    <button key={i} className="crm-service-chip" style={{ borderColor: '#10b98140', color: '#10b981' }} onClick={() => addProductItem(p)}>
                                                        💎 {p.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {form.items.length > 0 && (
                                    <div className="crm-form-group">
                                        <label>{T('admin.offers.modal.itemsLabel')}</label>
                                        <div className="crm-offer-items-edit">
                                            {form.items.map((item, i) => (
                                                <div key={i} className="crm-offer-item-edit">
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 500 }}>{item.service}</div>
                                                        <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{item.description}</div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <input type="number" value={item.price} onChange={e => updateItemPrice(i, parseInt(e.target.value) || 0)} className="crm-price-input" />
                                                        <span className="crm-price-currency" style={{ fontSize: '0.8rem', opacity: 0.6 }}>PLN</span>
                                                        <button className="crm-btn-icon crm-btn-danger" onClick={() => removeItem(i)}>✕</button>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="crm-offer-total-edit" style={{ background: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
                                                <span>{T('admin.offers.total')}:</span>
                                                <strong style={{ fontSize: '1.2rem', color: '#8b5cf6' }}>{totalPrice.toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US')} PLN</strong>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="crm-form-group">
                                    <label>{T('admin.offers.modal.notesLabel')}</label>
                                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder={T('admin.offers.modal.notesPlaceholder')} rows={3} />
                                </div>
                            </div>
                            <div className="crm-modal-actions" style={{ marginTop: '32px' }}>
                                <button className="crm-btn-ghost" onClick={() => setShowModal(false)}>{T('admin.offers.modal.cancel')}</button>
                                <button className="crm-btn-primary" onClick={handleSave}>
                                    {editingOffer ? T('admin.offers.modal.saveChanges') : T('admin.offers.modal.create')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
