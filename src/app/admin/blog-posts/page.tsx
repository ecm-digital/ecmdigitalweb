'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  getFeaturedBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost, BlogPost
} from '@/lib/firestoreService';

const EMPTY_FORM = { slug: '', title: '', icon: '📝', color: '#3b82f6', featured: true, order: 0 };

const COLORS = [
  { label: 'Niebieski', value: '#3b82f6' },
  { label: 'Fioletowy', value: '#8b5cf6' },
  { label: 'Żółty', value: '#f59e0b' },
  { label: 'Zielony', value: '#10b981' },
  { label: 'Różowy', value: '#ec4899' },
];

export default function AdminBlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all featured posts (limit 10 for admin view)
      const data = await getFeaturedBlogPosts(10);
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (!form.slug || !form.title) return setStatus('Wypełnij slug i tytuł.');
    setSaving(true);
    try {
      if (editingId) {
        await updateBlogPost(editingId, form);
        setStatus('Zaktualizowano.');
      } else {
        await addBlogPost(form);
        setStatus('Dodano post.');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchData();
    } catch (e) {
      setStatus('Błąd zapisu.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: BlogPost) => {
    setEditingId(p.id);
    setForm({ slug: p.slug, title: p.title, icon: p.icon, color: p.color, featured: p.featured !== false, order: p.order || 0 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Na pewno usunąć ten post?')) return;
    await deleteBlogPost(id);
    fetchData();
  };

  const card: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28 };
  const input: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none' };
  const label: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'block' };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>📝 Polecane posty blogowe</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>
          Zarządzaj postami wyświetlanymi na stronie głównej (maks. 3 wyróżnione).
        </p>

        {/* Form */}
        <div style={{ ...card, marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 24 }}>{editingId ? 'Edytuj post' : 'Dodaj post'}</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={label}>Tytuł *</label>
              <input style={input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Tytuł artykułu" />
            </div>
            <div>
              <label style={label}>Slug (URL) *</label>
              <input style={input} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="moj-artykul-2025" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={label}>Ikona (emoji)</label>
              <input style={input} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="🤖" />
            </div>
            <div>
              <label style={label}>Kolor akcentu</label>
              <select style={{ ...input, cursor: 'pointer' }} value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}>
                {COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Kolejność</label>
              <input style={input} type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} style={{ width: 18, height: 18, cursor: 'pointer' }} />
            <label htmlFor="featured" style={{ ...label, marginBottom: 0, cursor: 'pointer' }}>Wyróżniony (widoczny na homepage)</label>
          </div>

          {/* Preview */}
          <div style={{ padding: '16px 20px', borderRadius: 12, background: `${form.color}10`, border: `1px solid ${form.color}30`, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.5rem' }}>{form.icon}</span>
            <div>
              <div style={{ fontWeight: 700, color: 'white', fontSize: 15 }}>{form.title || 'Tytuł artykułu'}</div>
              <div style={{ fontSize: 12, color: form.color }}>/blog/{form.slug || 'slug'}</div>
            </div>
          </div>

          {status && <p style={{ color: status.includes('Błąd') ? '#ef4444' : '#10b981', marginBottom: 16, fontSize: 14 }}>{status}</p>}

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleSave} disabled={saving} style={{ background: 'white', color: 'black', border: 'none', borderRadius: 10, padding: '10px 28px', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Zapisuję...' : editingId ? 'Zapisz zmiany' : 'Dodaj post'}
            </button>
            {editingId && (
              <button onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setStatus(null); }} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer' }}>
                Anuluj
              </button>
            )}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Ładowanie...</p>
        ) : posts.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Brak postów. Dodaj pierwszy powyżej.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {posts.map(p => (
              <div key={p.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${p.color}20`, border: `1px solid ${p.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                    {p.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'white', marginBottom: 4 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>/blog/{p.slug} · #{p.order}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => handleEdit(p)} style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>Edytuj</button>
                  <button onClick={() => handleDelete(p.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>Usuń</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
