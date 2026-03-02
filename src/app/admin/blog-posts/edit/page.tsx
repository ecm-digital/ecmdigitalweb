'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getAllBlogPosts, updateBlogPost, BlogPost } from '@/lib/firestoreService';
import Link from 'next/link';

export default function EditBlogPostPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getAllBlogPosts();
      setPosts(data);
    } catch (e) {
      console.error(e);
      setStatus('Błąd ładowania postów');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    setContent(post.content || '');
    setStatus(null);
  };

  const handleSave = async () => {
    if (!selectedPost) return;
    setSaving(true);
    try {
      await updateBlogPost(selectedPost.id, { content });
      setStatus('✅ Zawartość zapisana');
      setTimeout(() => setStatus(null), 3000);
    } catch (e) {
      setStatus('❌ Błąd zapisu');
    } finally {
      setSaving(false);
    }
  };

  const card: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 20 };
  const input: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', fontFamily: 'monospace' };
  const label: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'block' };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ marginBottom: 40 }}>
          <Link href="/admin/blog-posts" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: 14, marginBottom: 16, display: 'inline-block' }}>← Wróć do zarządzania postami</Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>📝 Edytuj treść artykułu</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Edytuj markdown содержание artykułów blogowych</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
          {/* Posts List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ ...label, marginBottom: 12 }}>Dostępne artykuły</div>
            {loading ? (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Ładowanie...</p>
            ) : posts.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Brak artykułów</p>
            ) : (
              posts.map(post => (
                <button
                  key={post.id}
                  onClick={() => handleSelectPost(post)}
                  style={{
                    ...card,
                    padding: 14,
                    cursor: 'pointer',
                    background: selectedPost?.id === post.id ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
                    borderColor: selectedPost?.id === post.id ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'white', fontSize: 14, marginBottom: 4 }}>{post.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>/{post.slug}</div>
                </button>
              ))
            )}
          </div>

          {/* Editor */}
          <div>
            {selectedPost ? (
              <div style={{ ...card, padding: 28 }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>
                  {selectedPost.title}
                </h2>

                <label style={label}>Treść (Markdown)</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  style={{
                    ...input,
                    minHeight: '500px',
                    padding: '14px',
                    marginBottom: 24,
                    resize: 'vertical',
                    fontFamily: 'monospace',
                  }}
                  placeholder="# Nagłówek&#10;&#10;Wpisz markdown..."
                />

                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
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
                  {status && (
                    <p style={{ color: status.includes('✅') ? '#10b981' : '#ef4444', fontSize: 14, margin: 0 }}>
                      {status}
                    </p>
                  )}
                </div>

                <div style={{ marginTop: 32, padding: '16px 20px', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 12, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                  <strong>💡 Tip:</strong> Używaj markdown: **bold**, *italic*, # nagłówki, - listy, [link](url)
                </div>
              </div>
            ) : (
              <div style={{ ...card, padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                Wybierz artykuł z listy aby edytować treść
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
