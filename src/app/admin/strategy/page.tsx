'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { addDoc, collection, getDocs, updateDoc, doc, deleteDoc, db } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';

interface Strategy {
  id: string;
  title: string;
  type: 'go-to-market' | 'positioning' | 'service' | 'market-analysis' | 'other';
  description: string;
  targetMarket: string;
  differentiators: string;
  timeline: string;
  status: 'planning' | 'in-progress' | 'active' | 'completed';
  priority: 'high' | 'medium' | 'low';
  content: string;
  createdAt?: any;
  updatedAt?: any;
}

const EMPTY_FORM = {
  title: '',
  type: 'service' as const,
  description: '',
  targetMarket: '',
  differentiators: '',
  timeline: '',
  status: 'planning' as const,
  priority: 'high' as const,
  content: '',
};

const STRATEGY_TYPES = [
  { value: 'go-to-market', label: '🚀 Go-to-Market' },
  { value: 'positioning', label: '🎯 Positioning' },
  { value: 'service', label: '💼 Service Strategy' },
  { value: 'market-analysis', label: '📊 Market Analysis' },
  { value: 'other', label: '📝 Other' },
];

const STATUS_OPTIONS = [
  { value: 'planning', label: '📋 Planowanie', color: '#8b5cf6' },
  { value: 'in-progress', label: '⚡ W Trakcie', color: '#f59e0b' },
  { value: 'active', label: '✅ Aktywna', color: '#10b981' },
  { value: 'completed', label: '✓ Ukończona', color: '#6b7280' },
];

export default function StrategyPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const fetchStrategies = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'strategies'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Strategy));
      setStrategies(data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    } catch (e) {
      console.error(e);
      setStatus('Błąd ładowania strategii');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  const handleSave = async () => {
    if (!form.title) return setStatus('Wpisz tytuł strategii');
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'strategies', editingId), { ...form, updatedAt: serverTimestamp() });
        setStatus('✅ Strategia zaktualizowana');
      } else {
        await addDoc(collection(db, 'strategies'), { ...form, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        setStatus('✅ Strategia dodana');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchStrategies();
      setTimeout(() => setStatus(null), 3000);
    } catch (e) {
      setStatus('❌ Błąd zapisu');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (s: Strategy) => {
    setEditingId(s.id);
    setForm({ title: s.title, type: s.type, description: s.description, targetMarket: s.targetMarket, differentiators: s.differentiators, timeline: s.timeline, status: s.status, priority: s.priority, content: s.content });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Usunąć tę strategię?')) return;
    await deleteDoc(doc(db, 'strategies', id));
    fetchStrategies();
  };

  const card: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28 };
  const input: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none' };
  const label: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'block' };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>🎯 Strategia Biznesowa</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>
          Zarządzaj strategiami go-to-market, positioning i plany wdrażania nowych serwisów.
        </p>

        {/* Form */}
        <div style={{ ...card, marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 24 }}>
            {editingId ? '✏️ Edytuj Strategię' : '➕ Nowa Strategia'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={label}>Tytuł *</label>
              <input style={input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="np. AI Audit GTM Q1 2025" />
            </div>
            <div>
              <label style={label}>Typ Strategii</label>
              <select style={{ ...input, cursor: 'pointer' }} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}>
                {STRATEGY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={label}>Opis Krótki</label>
            <input style={input} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Co ta strategia robi? Jaki problem rozwiązuje?" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={label}>Target Market</label>
              <input style={input} value={form.targetMarket} onChange={e => setForm(f => ({ ...f, targetMarket: e.target.value }))} placeholder="np. SME 10-50 osób, Tech sector" />
            </div>
            <div>
              <label style={label}>Okres Realizacji</label>
              <input style={input} value={form.timeline} onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))} placeholder="np. Q1-Q2 2025, 3 miesiące" />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={label}>Kluczowe Różnicowania (Unique Selling Points)</label>
            <textarea style={{ ...input, minHeight: '80px', resize: 'vertical' }} value={form.differentiators} onChange={e => setForm(f => ({ ...f, differentiators: e.target.value }))} placeholder="- Punkt 1&#10;- Punkt 2&#10;- Punkt 3" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={label}>Status</label>
              <select style={{ ...input, cursor: 'pointer' }} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
                {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Priorytet</label>
              <select style={{ ...input, cursor: 'pointer' }} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as any }))}>
                <option value="high">🔴 Wysoki</option>
                <option value="medium">🟡 Średni</option>
                <option value="low">🟢 Niski</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={label}>Szczegółowe Notatki & Plan Działań</label>
            <textarea style={{ ...input, minHeight: '250px', resize: 'vertical', fontFamily: 'monospace' }} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Wpisz markdown:&#10;# Etap 1&#10;- Punkt działania 1&#10;- Punkt działania 2&#10;&#10;## Metryki sukcesu&#10;- KPI 1&#10;- KPI 2" />
          </div>

          {status && <p style={{ color: status.includes('✅') ? '#10b981' : '#ef4444', marginBottom: 16, fontSize: 14 }}>{status}</p>}

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleSave} disabled={saving} style={{ background: 'white', color: 'black', border: 'none', borderRadius: 10, padding: '10px 28px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Zapisuję...' : editingId ? 'Zapisz zmiany' : 'Dodaj strategię'}
            </button>
            {editingId && (
              <button onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setStatus(null); }} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 700 }}>
                Anuluj
              </button>
            )}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Ładowanie...</p>
        ) : strategies.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Brak strategii. Dodaj pierwszą powyżej.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {strategies.map(s => {
              const statusOpt = STATUS_OPTIONS.find(x => x.value === s.status);
              return (
                <div key={s.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, color: 'white', fontSize: 16 }}>{s.title}</div>
                      <div style={{ background: `${statusOpt?.color}20`, border: `1px solid ${statusOpt?.color}40`, color: statusOpt?.color, padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                        {statusOpt?.label}
                      </div>
                      <div style={{ color: s.priority === 'high' ? '#ef4444' : s.priority === 'medium' ? '#f59e0b' : '#10b981', fontWeight: 700, fontSize: 12 }}>
                        {s.priority === 'high' ? '🔴' : s.priority === 'medium' ? '🟡' : '🟢'} {s.priority.toUpperCase()}
                      </div>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 8 }}>{s.description}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 4 }}>TARGET MARKET</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{s.targetMarket || 'N/A'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 4 }}>TIMELINE</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{s.timeline || 'N/A'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 4 }}>TYP</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{STRATEGY_TYPES.find(t => t.value === s.type)?.label || s.type}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexDirection: 'column' }}>
                    <button onClick={() => handleEdit(s)} style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                      Edytuj
                    </button>
                    <button onClick={() => handleDelete(s.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                      Usuń
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
