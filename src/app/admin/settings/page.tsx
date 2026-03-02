'use client';

import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getAgencySettings, updateAgencySettings, AgencySettings, AgencyService, AgencyProduct, addNotification } from '@/lib/firestoreService';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNotifications } from '@/context/NotificationContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminSettingsPage() {
    const { T } = useLanguage();
    const { showToast } = useNotifications();
    const [activeTab, setActiveTab] = useState<'branding' | 'contact' | 'services' | 'integrations'>('branding');
    const [settings, setSettings] = useState<AgencySettings>({
        agencyName: '',
        tagline: '',
        logoUrl: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        socialLinks: { facebook: '', instagram: '', linkedin: '', twitter: '' },
        services: [],
        products: [],
        googleAds: { clientId: '', clientSecret: '', developerToken: '', refreshToken: '', customerId: '' },
        updatedAt: null as any,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const load = async () => {
            const data = await getAgencySettings();
            if (data) {
                setSettings({
                    ...data,
                    socialLinks: data.socialLinks || { facebook: '', instagram: '', linkedin: '', twitter: '' },
                    services: data.services || [],
                    products: data.products || [],
                    googleAds: data.googleAds || { clientId: '', clientSecret: '', developerToken: '', refreshToken: '', customerId: '' },
                });
            }
            setLoading(false);
        };
        load();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateAgencySettings(settings);
            showToast(T('admin.settings.toast.saved'), 'success');

            // Add persistent notification
            await addNotification({
                title: T('admin.settings.notif.updated'),
                message: T('admin.settings.notif.message', { name: settings.agencyName }),
                type: 'success',
                link: '/admin/settings'
            });
        } catch (err) {
            console.error(err);
            showToast(T('admin.settings.toast.saveError'), 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof AgencySettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSocialChange = (platform: keyof AgencySettings['socialLinks'], value: string) => {
        setSettings(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [platform]: value }
        }));
    };

    const handleGoogleAdsChange = (field: keyof NonNullable<AgencySettings['googleAds']>, value: string) => {
        setSettings(prev => ({
            ...prev,
            googleAds: { ...(prev.googleAds || { clientId: '', clientSecret: '', developerToken: '', refreshToken: '', customerId: '' }), [field]: value }
        }));
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `agency/logo_${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            handleChange('logoUrl', downloadURL);
            showToast(T('admin.settings.toast.logoUploaded'), 'success');
        } catch (err) {
            console.error(err);
            showToast(T('admin.settings.toast.logoError'), 'error');
        } finally {
            setUploading(false);
        }
    };

    // Services management
    const addService = () => {
        handleChange('services', [...(settings.services || []), { title: '', description: '', icon: '⚡' }]);
    };

    const removeService = (index: number) => {
        const newServices = [...(settings.services || [])];
        newServices.splice(index, 1);
        handleChange('services', newServices);
    };

    const updateService = (index: number, field: keyof AgencyService, value: string) => {
        const newServices = [...(settings.services || [])];
        newServices[index] = { ...newServices[index], [field]: value };
        handleChange('services', newServices);
    };

    // Products management
    const addProduct = () => {
        handleChange('products', [...(settings.products || []), { name: '', description: '', price: '', link: '' }]);
    };

    const removeProduct = (index: number) => {
        const newProducts = [...(settings.products || [])];
        newProducts.splice(index, 1);
        handleChange('products', newProducts);
    };

    const updateProduct = (index: number, field: keyof AgencyProduct, value: string) => {
        const newProducts = [...(settings.products || [])];
        newProducts[index] = { ...newProducts[index], [field]: value };
        handleChange('products', newProducts);
    };

    if (loading) return (
        <AdminLayout>
            <div className="crm-page"><div className="crm-loading">{T('common.loading')}</div></div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="crm-page space-y-8 animate-fade-in">
                <div className="crm-header flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="crm-title font-space-grotesk text-3xl">⚙️ {T('admin.settings.title')}</h1>
                        <p className="crm-subtitle text-white/40 mt-1">{T('admin.settings.subtitle')}</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 w-fit">
                    {[
                        { id: 'branding', icon: '🎨', label: T('admin.settings.tabs.branding') },
                        { id: 'contact', icon: '✉️', label: T('admin.settings.tabs.contact') },
                        { id: 'services', icon: '🛠️', label: T('admin.settings.tabs.services') },
                        { id: 'integrations', icon: '🔌', label: T('admin.settings.tabs.integrations') }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSave} className="space-y-8 pb-32">
                    {activeTab === 'branding' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] overflow-hidden relative group">
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand-accent to-purple-500 opacity-50"></div>
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-white/30 block mb-6">{T('admin.settings.branding.logo')}</label>
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="w-40 h-40 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-brand-accent/30 transition-colors">
                                            {settings.logoUrl ? (
                                                <img src={settings.logoUrl} alt="Logo" className="max-w-[80%] max-h-[80%] object-contain drop-shadow-2xl" />
                                            ) : (
                                                <div className="text-4xl opacity-20">🖼️</div>
                                            )}
                                        </div>
                                        <div className="w-full">
                                            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all"
                                            >
                                                {uploading ? `⌛ ${T('admin.settings.branding.uploading')}` : `📁 ${T('admin.settings.branding.upload')}`}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px]">
                                <h3 className="text-xl font-bold font-space-grotesk mb-8 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-sm shadow-inner">🎨</span>
                                    {T('admin.settings.branding.title')}
                                </h3>
                                <div className="space-y-6">
                                    <div className="crm-form-group">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2 block">{T('admin.settings.branding.name')}</label>
                                        <input
                                            value={settings.agencyName}
                                            onChange={e => handleChange('agencyName', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-brand-accent/50 focus:bg-white/10 outline-none transition-all font-medium"
                                            placeholder="ECM Digital"
                                        />
                                    </div>
                                    <div className="crm-form-group">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2 block">{T('admin.settings.branding.tagline')}</label>
                                        <input
                                            value={settings.tagline}
                                            onChange={e => handleChange('tagline', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-brand-accent/50 focus:bg-white/10 outline-none transition-all font-medium"
                                            placeholder="Future of Digital Growth"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px]">
                                <h3 className="text-xl font-bold font-space-grotesk mb-8 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm shadow-inner">✉️</span>
                                    {T('admin.settings.contact.title')}
                                </h3>
                                <div className="space-y-6">
                                    <div className="crm-form-group">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2 block">{T('admin.settings.contact.email')}</label>
                                        <input
                                            type="email"
                                            value={settings.contactEmail}
                                            onChange={e => handleChange('contactEmail', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="crm-form-group">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2 block">{T('admin.settings.contact.phone')}</label>
                                        <input
                                            value={settings.contactPhone}
                                            onChange={e => handleChange('contactPhone', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="crm-form-group">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2 block">{T('admin.settings.contact.location')}</label>
                                        <input
                                            value={settings.address}
                                            onChange={e => handleChange('address', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px]">
                                <h3 className="text-xl font-bold font-space-grotesk mb-8 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm shadow-inner">📱</span>
                                    {T('admin.settings.contact.social')}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.keys(settings.socialLinks).map((platform) => (
                                        <div key={platform} className="crm-form-group">
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2 block capitalize">{platform}</label>
                                            <input
                                                value={(settings.socialLinks as any)[platform]}
                                                onChange={e => handleSocialChange(platform as any, e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all font-medium"
                                                placeholder={`URL ${platform}...`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'services' && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px]">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold font-space-grotesk flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-sm shadow-inner">🛠️</span>
                                        {T('admin.settings.services.title')}
                                    </h3>
                                    <button type="button" onClick={addService} className="text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:underline transition-all hover:tracking-wider">{T('admin.settings.services.new')}</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {settings.services?.map((service, idx) => (
                                        <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-3xl relative group hover:bg-white/[0.07] transition-all">
                                            <button
                                                type="button"
                                                onClick={() => removeService(idx)}
                                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-500 hover:text-white"
                                            >
                                                ✕
                                            </button>
                                            <div className="flex gap-4">
                                                <input
                                                    value={service.icon}
                                                    onChange={e => updateService(idx, 'icon', e.target.value)}
                                                    className="w-14 h-14 bg-black/20 border border-white/10 rounded-2xl text-center text-2xl outline-none focus:border-brand-accent transition-all"
                                                />
                                                <div className="flex-1 space-y-4">
                                                    <input
                                                        value={service.title}
                                                        onChange={e => updateService(idx, 'title', e.target.value)}
                                                        className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-brand-accent font-bold tracking-tight text-lg"
                                                        placeholder={T('admin.settings.services.name')}
                                                    />
                                                    <textarea
                                                        value={service.description}
                                                        onChange={e => updateService(idx, 'description', e.target.value)}
                                                        className="w-full bg-transparent text-sm text-white/50 outline-none focus:text-white transition-colors"
                                                        placeholder={T('admin.settings.services.desc')}
                                                        rows={2}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!settings.services || settings.services.length === 0) && (
                                        <div className="md:col-span-2 text-center py-12 bg-white/5 rounded-3xl border border-dashed border-white/10 text-white/20 italic">
                                            {T('admin.settings.services.empty')}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px]">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold font-space-grotesk flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-sm shadow-inner">📦</span>
                                        {T('admin.settings.products.title')}
                                    </h3>
                                    <button type="button" onClick={addProduct} className="text-[10px] font-bold uppercase tracking-widest text-pink-500 hover:underline transition-all hover:tracking-wider">{T('admin.settings.products.new')}</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {settings.products?.map((product, idx) => (
                                        <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-3xl relative group hover:bg-white/[0.07] transition-all">
                                            <button
                                                type="button"
                                                onClick={() => removeProduct(idx)}
                                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-500 hover:text-white"
                                            >
                                                ✕
                                            </button>
                                            <div className="space-y-4">
                                                <div className="flex justify-between gap-4">
                                                    <input
                                                        value={product.name}
                                                        onChange={e => updateProduct(idx, 'name', e.target.value)}
                                                        className="flex-1 bg-transparent border-b border-white/10 py-2 outline-none focus:border-pink-500 font-bold tracking-tight text-lg"
                                                        placeholder={T('admin.settings.products.name')}
                                                    />
                                                    <input
                                                        value={product.price}
                                                        onChange={e => updateProduct(idx, 'price', e.target.value)}
                                                        className="w-24 bg-pink-500/10 border border-pink-500/20 rounded-xl px-3 py-1 text-pink-500 text-sm font-bold text-center outline-none focus:border-pink-500 transition-all font-space-grotesk"
                                                        placeholder={T('admin.settings.products.price')}
                                                    />
                                                </div>
                                                <input
                                                    value={product.description}
                                                    onChange={e => updateProduct(idx, 'description', e.target.value)}
                                                    className="w-full bg-transparent text-sm text-white/50 outline-none focus:text-white transition-colors"
                                                    placeholder={T('admin.settings.products.desc')}
                                                />
                                                <div className="relative group/link">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-white/20 group-hover/link:text-pink-500 transition-colors">🔗</div>
                                                    <input
                                                        value={product.link}
                                                        onChange={e => updateProduct(idx, 'link', e.target.value)}
                                                        className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-[11px] text-white/40 outline-none focus:border-pink-500/50 focus:text-white transition-all font-mono"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!settings.products || settings.products.length === 0) && (
                                        <div className="md:col-span-2 text-center py-12 bg-white/5 rounded-3xl border border-dashed border-white/10 text-white/20 italic">
                                            {T('admin.settings.products.empty')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div className="max-w-3xl animate-fade-in">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32 group-hover:bg-blue-500/20 transition-all duration-1000"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl shadow-inner border border-white/10 group-hover:border-blue-500/30 transition-all">📈</div>
                                        <div>
                                            <h3 className="text-2xl font-bold font-space-grotesk tracking-tight">{T('admin.settings.integrations.googleAds')}</h3>
                                            <p className="text-sm text-white/40 mt-1">{T('admin.settings.integrations.googleAdsDesc')}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="md:col-span-2">
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-3 block">Customer ID</label>
                                            <input
                                                value={settings.googleAds?.customerId || ''}
                                                onChange={e => handleGoogleAdsChange('customerId', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all font-medium font-mono tracking-widest"
                                                placeholder="000-000-0000"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-3 block">Client ID</label>
                                            <input
                                                value={settings.googleAds?.clientId || ''}
                                                onChange={e => handleGoogleAdsChange('clientId', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-sm font-mono overflow-ellipsis"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-3 block">Client Secret</label>
                                            <input
                                                type="password"
                                                value={settings.googleAds?.clientSecret || ''}
                                                onChange={e => handleGoogleAdsChange('clientSecret', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-sm font-mono"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-3 block">Refresh Token</label>
                                            <input
                                                type="password"
                                                value={settings.googleAds?.refreshToken || ''}
                                                onChange={e => handleGoogleAdsChange('refreshToken', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-sm font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent backdrop-blur-[2px] z-50 flex justify-center lg:justify-end xl:pr-24">
                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-4 rounded-[32px] flex items-center gap-8 shadow-2xl animate-slide-up">
                            <div className="px-4 hidden md:flex items-center gap-3 border-r border-white/10 mr-2">
                                <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{T('admin.settings.footer.unsaved')}</p>
                            </div>
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-brand-accent hover:bg-brand-accent/80 text-white px-12 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-brand-accent/30 disabled:opacity-50 min-w-[280px] uppercase text-xs tracking-[0.2em] relative overflow-hidden group/btn"
                            >
                                <span className="relative z-10">{saving ? T('common.saving') : T('admin.settings.footer.save')}</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer"></div>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
