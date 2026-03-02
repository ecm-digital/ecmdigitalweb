'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
    Meeting,
    getMeetings, addMeeting, updateMeeting, deleteMeeting,
} from '@/lib/firestoreService';

const typeIcons: Record<string, string> = { call: '📞', video: '📹', meeting: '🤝' };
const typeLabels: Record<string, string> = { call: 'Telefon', video: 'Wideo', meeting: 'Spotkanie' };

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday = 0
}

const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
const dayNames = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];

export default function CalendarPage() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    const [form, setForm] = useState({
        title: '', clientName: '', date: '', time: '10:00',
        duration: 30, type: 'video' as Meeting['type'], notes: '',
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const loadMeetings = async () => {
        setLoading(true);
        const data = await getMeetings();
        setMeetings(data);
        setLoading(false);
    };

    useEffect(() => { loadMeetings(); }, []);

    const openNew = (date?: string) => {
        setEditingMeeting(null);
        setForm({ title: '', clientName: '', date: date || '', time: '10:00', duration: 30, type: 'video', notes: '' });
        setShowModal(true);
    };

    const openEdit = (m: Meeting) => {
        setEditingMeeting(m);
        setForm({ title: m.title, clientName: m.clientName, date: m.date, time: m.time, duration: m.duration, type: m.type, notes: m.notes });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (editingMeeting) {
            await updateMeeting(editingMeeting.id, form);
        } else {
            await addMeeting(form);
        }
        setShowModal(false);
        loadMeetings();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Usunąć spotkanie?')) { await deleteMeeting(id); loadMeetings(); }
    };

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date().toISOString().split('T')[0];

    const getMeetingsForDate = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return meetings.filter(m => m.date === dateStr);
    };

    // Upcoming meetings (next 7 days)
    const upcoming = meetings.filter(m => {
        const mDate = new Date(m.date);
        const now = new Date();
        const diff = (mDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return diff >= -1 && diff <= 7;
    }).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

    return (
        <AdminLayout>
            <div className="crm-page">
                <div className="crm-header">
                    <div>
                        <h1 className="crm-title">📅 Kalendarz</h1>
                        <p className="crm-subtitle">{meetings.length} spotkań zaplanowanych</p>
                    </div>
                    <button className="crm-btn-primary" onClick={() => openNew()}>+ Nowe Spotkanie</button>
                </div>

                <div className="calendar-layout">
                    {/* Calendar */}
                    <div className="calendar-main">
                        <div className="calendar-nav">
                            <button className="calendar-nav-btn" onClick={prevMonth}>←</button>
                            <h2 className="calendar-month-title">{monthNames[month]} {year}</h2>
                            <button className="calendar-nav-btn" onClick={nextMonth}>→</button>
                        </div>
                        <div className="calendar-grid">
                            {dayNames.map(d => <div key={d} className="calendar-day-name">{d}</div>)}
                            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="calendar-cell empty"></div>)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const dayMeetings = getMeetingsForDate(day);
                                const isToday = dateStr === today;
                                return (
                                    <div key={day} className={`calendar-cell ${isToday ? 'today' : ''} ${dayMeetings.length > 0 ? 'has-meetings' : ''}`}
                                        onClick={() => openNew(dateStr)}>
                                        <span className="calendar-day-num">{day}</span>
                                        {dayMeetings.map((m, j) => (
                                            <div key={j} className="calendar-meeting-dot" onClick={e => { e.stopPropagation(); openEdit(m); }}>
                                                {typeIcons[m.type]} <span className="calendar-meeting-title-sm">{m.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sidebar - Upcoming */}
                    <div className="calendar-sidebar">
                        <h3>Najbliższe spotkania</h3>
                        {loading ? (
                            <div className="crm-loading">{[1, 2, 3].map(i => <div key={i} className="crm-skeleton-row" style={{ height: '60px' }}></div>)}</div>
                        ) : upcoming.length === 0 ? (
                            <p className="crm-cell-secondary" style={{ textAlign: 'center', padding: '20px' }}>Brak nadchodzących spotkań</p>
                        ) : (
                            <div className="calendar-upcoming-list">
                                {upcoming.map(m => (
                                    <div key={m.id} className="calendar-upcoming-item" onClick={() => openEdit(m)}>
                                        <div className="calendar-upcoming-icon">{typeIcons[m.type]}</div>
                                        <div className="calendar-upcoming-info">
                                            <h4>{m.title}</h4>
                                            <p>{m.date} · {m.time} · {m.duration}min</p>
                                            {m.clientName && <p className="calendar-upcoming-client">👤 {m.clientName}</p>}
                                        </div>
                                        <button className="crm-btn-icon crm-btn-danger" onClick={e => { e.stopPropagation(); handleDelete(m.id); }}>🗑️</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {showModal && (
                    <div className="crm-modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="crm-modal" onClick={e => e.stopPropagation()}>
                            <h2>{editingMeeting ? 'Edytuj Spotkanie' : 'Nowe Spotkanie'}</h2>
                            <div className="crm-modal-form">
                                <div className="crm-form-group"><label>Tytuł</label>
                                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Konsultacja z klientem" />
                                </div>
                                <div className="crm-form-group"><label>Klient</label>
                                    <input value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} placeholder="Jan Kowalski" />
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>Data</label>
                                        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                                    </div>
                                    <div className="crm-form-group"><label>Godzina</label>
                                        <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                                    </div>
                                </div>
                                <div className="crm-form-row">
                                    <div className="crm-form-group"><label>Czas (min)</label>
                                        <select value={form.duration} onChange={e => setForm({ ...form, duration: parseInt(e.target.value) })}>
                                            <option value={15}>15 min</option><option value={30}>30 min</option>
                                            <option value={45}>45 min</option><option value={60}>60 min</option>
                                            <option value={90}>90 min</option><option value={120}>120 min</option>
                                        </select>
                                    </div>
                                    <div className="crm-form-group"><label>Typ</label>
                                        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Meeting['type'] })}>
                                            <option value="call">📞 Telefon</option>
                                            <option value="video">📹 Wideo</option>
                                            <option value="meeting">🤝 Spotkanie</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="crm-form-group"><label>Notatki</label>
                                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Dodatkowe informacje..." rows={3} />
                                </div>
                            </div>
                            <div className="crm-modal-actions">
                                <button className="crm-btn-ghost" onClick={() => setShowModal(false)}>Anuluj</button>
                                <button className="crm-btn-primary" onClick={handleSave}>{editingMeeting ? 'Zapisz' : 'Utwórz'}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
