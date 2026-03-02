'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getAllBlogPosts, updateBlogPost, BlogPost } from '@/lib/firestoreService';

const EMPTY_FORM = { content: '' };

export default function EditBlogPostPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllBlogPosts();
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await updateBlogPost(editingId, form);
      setStatus('Zaktualizowano.');
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
    setForm({ content: p.content || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const card: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28 };
  const input: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', fontFamily: 'monospace' };
  const label: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'block' };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>📝 Edytuj treść artykułów</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>
          Edytuj markdown zawartość artykułów blogowych
        </p>

        {/* Editor Form */}
        {editingId && (
          <div style={{ ...card, marginBottom: 40 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 24 }}>
              {posts.find(p => p.id === editingId)?.title}
            </h2>

            <label style={label}>Treść (Markdown)</label>
            <textarea
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              style={{
                ...input,
                minHeight: '450px',
                padding: '14px',
                marginBottom: 24,
                resize: 'vertical',
              }}
              placeholder="# Nagłówek&#10;&#10;Wpisz markdown..."
            />

            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  background: 'white',
                  color: 'black',
                  border: 'none',
                  borderRadius: 10,
                  padding: '10px 28px',
                  fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? 'Zapisuję...' : 'Zapisz zmiany'}
              </button>
              <button
                onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setStatus(null); }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                Anuluj
              </button>
            </div>

            {status && <p style={{ color: status.includes('Błąd') ? '#ef4444' : '#10b981', marginBottom: 16, fontSize: 14 }}>{status}</p>}

            <div style={{ padding: '16px 20px', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 12, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              <strong>💡 Markdown syntax:</strong> **bold** | *italic* | # h1 | ## h2 | - listy | [link](url)
            </div>
          </div>
        )}

        {/* Articles List */}
        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Ładowanie...</p>
        ) : posts.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Brak artykułów.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {posts.map(p => (
              <div key={p.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${p.color || '#3b82f6'}20`, border: `1px solid ${p.color || '#3b82f6'}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                    {p.icon || '📝'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'white', marginBottom: 4 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>/blog/{p.slug}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(p)}
                  style={{
                    background: 'rgba(59,130,246,0.15)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59,130,246,0.3)',
                    borderRadius: 8,
                    padding: '6px 14px',
                    fontSize: 13,
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Edytuj treść
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
