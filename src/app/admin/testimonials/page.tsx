'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial, Testimonial
} from '@/lib/firestoreService';

const EMPTY_FORM = { name: '', role: '', text: '', order: 0, active: true };

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (!form.name || !form.text) return setStatus('Wypełnij imię i treść opinii.');
    setSaving(true);
    try {
      if (editingId) {
        await updateTestimonial(editingId, form);
        setStatus('Zaktualizowano.');
      } else {
        await addTestimonial(form);
        setStatus('Dodano opinię.');
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

  const handleEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setForm({ name: t.name, role: t.role, text: t.text, order: t.order || 0, active: t.active !== false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Na pewno usunąć tę opinię?')) return;
    await deleteTestimonial(id);
    fetchData();
  };

  const card: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28 };
  const input: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none' };
  const label: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'block' };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>⭐ Opinie klientów</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>Zarządzaj opiniami wyświetlanymi na stronie głównej.</p>

        {/* Form */}
        <div style={{ ...card, marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 24 }}>{editingId ? 'Edytuj opinię' : 'Dodaj nową opinię'}</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={label}>Imię i nazwisko *</label>
              <input style={input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jan Kowalski" />
            </div>
            <div>
              <label style={label}>Stanowisko / Firma</label>
              <input style={input} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="CEO, Firma XYZ" />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={label}>Treść opinii *</label>
            <textarea style={{ ...input, minHeight: 100, resize: 'vertical' }} value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} placeholder="Treść opinii..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={label}>Kolejność wyświetlania</label>
              <input style={input} type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 24 }}>
              <input type="checkbox" id="active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} style={{ width: 18, height: 18, cursor: 'pointer' }} />
              <label htmlFor="active" style={{ ...label, marginBottom: 0, cursor: 'pointer' }}>Aktywna (widoczna)</label>
            </div>
          </div>

          {status && <p style={{ color: status.includes('Błąd') ? '#ef4444' : '#10b981', marginBottom: 16, fontSize: 14 }}>{status}</p>}

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleSave} disabled={saving} style={{ background: 'white', color: 'black', border: 'none', borderRadius: 10, padding: '10px 28px', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Zapisuję...' : editingId ? 'Zapisz zmiany' : 'Dodaj opinię'}
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
        ) : testimonials.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Brak opinii. Dodaj pierwszą powyżej.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {testimonials.map(t => (
              <div key={t.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: 14, flexShrink: 0 }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'white' }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t.role}</div>
                    </div>
                    {!t.active && <span style={{ fontSize: 11, background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '2px 8px' }}>Nieaktywna</span>}
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontStyle: 'italic' }}>"{t.text}"</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => handleEdit(t)} style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>Edytuj</button>
                  <button onClick={() => handleDelete(t.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>Usuń</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
