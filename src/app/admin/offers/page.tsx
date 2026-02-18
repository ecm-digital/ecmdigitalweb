'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
    Offer, OfferStatus, OfferItem, Client,
    getOffers, addOffer, updateOffer, deleteOffer, getClients, addNotification
} from '@/lib/firestoreService';
import { useNotifications } from '@/context/NotificationContext';
import { useAgency } from '@/context/AgencyContext';

const statusColors: Record<OfferStatus, string> = {
    Robocza: '#6b7280',
    Wysłana: '#3b82f6',
    Zaakceptowana: '#10b981',
    Odrzucona: '#ef4444',
};

export default function OffersPage() {
    const { settings } = useAgency();
    const { showToast } = useNotifications();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
    const [filterStatus, setFilterStatus] = useState<OfferStatus | 'all'>('all');

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
            showToast('Błąd ładowania danych.', 'error');
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
        showToast(`Dodano usługę: ${service.title}`, 'info');
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
        showToast(`Dodano produkt: ${product.name}`, 'info');
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
            showToast('Wybierz klienta i wpisz tytuł oferty.', 'warning');
            return;
        }

        const data = { ...form, totalPrice };
        try {
            if (editingOffer) {
                await updateOffer(editingOffer.id, data);
                showToast('Oferta zaktualizowana! ✅', 'success');
            } else {
                await addOffer(data);
                showToast('Nowa oferta utworzona! 💼', 'success');

                await addNotification({
                    title: 'Nowa oferta w CRM',
                    message: `Utworzono ofertę "${form.title}" dla ${form.clientName}`,
                    type: 'offer',
                    link: `/admin/offers`
                });
            }
            setShowModal(false);
            loadData();
        } catch (err) {
            console.error(err);
            showToast('Błąd podczas zapisywania oferty.', 'error');
        }
    };

    const handleStatusChange = async (id: string, status: OfferStatus) => {
        try {
            await updateOffer(id, { status });
            showToast(`Status oferty zmieniony na: ${status}`, 'success');
            loadData();
        } catch (err) {
            showToast('Błąd zmiany statusu.', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Czy na pewno usunąć tę ofertę?')) {
            try {
                await deleteOffer(id);
                showToast('Oferta usunięta.', 'info');
                loadData();
            } catch (err) {
                showToast('Błąd podczas usuwania.', 'error');
            }
        }
    };

    const selectClient = (clientId: string) => {
        const client = clients.find(c => c.id === clientId);
        setForm({ ...form, clientId, clientName: client?.name || '' });
    };

    const filtered = offers.filter(o => filterStatus === 'all' || o.status === filterStatus);
    const totalAccepted = offers.filter(o => o.status === 'Zaakceptowana').reduce((s, o) => s + o.totalPrice, 0);

    return (
        <AdminLayout>
            <div className="crm-page">
                <div className="crm-header">
                    <div>
                        <h1 className="crm-title">💼 Oferty i Wyceny</h1>
                        <p className="crm-subtitle">{offers.length} ofert · zaakceptowane: {totalAccepted.toLocaleString('pl-PL')} PLN</p>
                    </div>
                    <button className="crm-btn-primary" onClick={openNew}>+ Nowa Oferta</button>
                </div>

                <div className="crm-mini-stats">
                    {(['Robocza', 'Wysłana', 'Zaakceptowana', 'Odrzucona'] as OfferStatus[]).map(s => (
                        <div key={s} className="crm-mini-stat" onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
                            style={{ borderColor: filterStatus === s ? statusColors[s] : 'rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                            <span className="crm-mini-stat-dot" style={{ background: statusColors[s] }}></span>
                            <span className="crm-mini-stat-label">{s}</span>
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
                        <p>Brak ofert. Stwórz pierwszą!</p>
                    </div>
                ) : (
                    <div className="crm-offers-grid">
                        {filtered.map(o => (
                            <div key={o.id} className="crm-offer-card">
                                <div className="crm-offer-header">
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ marginBottom: '4px' }}>{o.title || 'Oferta bez tytułu'}</h3>
                                        <p className="crm-offer-client">👤 {o.clientName || 'Brak klienta'}</p>
                                    </div>
                                    <span className="crm-status-badge" style={{
                                        background: statusColors[o.status] + '20', color: statusColors[o.status],
                                        borderColor: statusColors[o.status] + '40'
                                    }}>{o.status}</span>
                                </div>
                                <div className="crm-offer-items">
                                    {o.items.slice(0, 3).map((item, i) => (
                                        <div key={i} className="crm-offer-item-row">
                                            <span>{item.service}</span>
                                            <span>{item.price.toLocaleString('pl-PL')} PLN</span>
                                        </div>
                                    ))}
                                    {o.items.length > 3 && <div className="crm-offer-more">+{o.items.length - 3} więcej pozycji...</div>}
                                </div>
                                <div className="crm-offer-total">
                                    <span>Razem:</span>
                                    <span className="crm-offer-price">{o.totalPrice.toLocaleString('pl-PL')} PLN</span>
                                </div>
                                <div className="crm-offer-footer">
                                    <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value as OfferStatus)} className="crm-status-select">
                                        <option value="Robocza">Robocza</option>
                                        <option value="Wysłana">Wysłana</option>
                                        <option value="Zaakceptowana">Zaakceptowana</option>
                                        <option value="Odrzucona">Odrzucona</option>
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
                            <h2 style={{ marginBottom: '24px' }}>{editingOffer ? 'Edytuj Ofertę' : 'Nowa Oferta'}</h2>
                            <div className="crm-modal-form">
                                <div className="crm-form-row">
                                    <div className="crm-form-group">
                                        <label>Tytuł oferty</label>
                                        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Strona WWW dla firmy X" />
                                    </div>
                                    <div className="crm-form-group">
                                        <label>Klient</label>
                                        <select value={form.clientId} onChange={e => selectClient(e.target.value)}>
                                            <option value="">Wybierz klienta...</option>
                                            {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.company})</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group">
                                        <label>Ważna do</label>
                                        <input type="date" value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} />
                                    </div>
                                    <div className="crm-form-group">
                                        <label>Status</label>
                                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as OfferStatus })}>
                                            <option value="Robocza">Robocza</option>
                                            <option value="Wysłana">Wysłana</option>
                                            <option value="Zaakceptowana">Zaakceptowana</option>
                                            <option value="Odrzucona">Odrzucona</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="crm-form-group" style={{ marginBottom: '32px' }}>
                                    <label style={{ color: '#8b5cf6', fontWeight: 600 }}>Dodaj z oferty agencji</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '12px' }}>
                                        <div>
                                            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '8px' }}>USŁUGI</p>
                                            <div className="crm-service-chips">
                                                {settings?.services?.map((t, i) => (
                                                    <button key={i} className="crm-service-chip" onClick={() => addServiceItem(t)}>
                                                        {t.icon} {t.title}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '8px' }}>PRODUKTY / ABONAMENTY</p>
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
                                        <label>Pozycje oferty</label>
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
                                                <span>Suma oferty:</span>
                                                <strong style={{ fontSize: '1.2rem', color: '#8b5cf6' }}>{totalPrice.toLocaleString('pl-PL')} PLN</strong>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="crm-form-group">
                                    <label>Dodatkowe notatki</label>
                                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Dodatkowe szczegóły..." rows={3} />
                                </div>
                            </div>
                            <div className="crm-modal-actions" style={{ marginTop: '32px' }}>
                                <button className="crm-btn-ghost" onClick={() => setShowModal(false)}>Anuluj</button>
                                <button className="crm-btn-primary" onClick={handleSave}>
                                    {editingOffer ? 'Zapisz zmiany' : 'Utwórz ofertę'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
