'use client';

import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { Notification } from '@/lib/firestoreService';

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (n: Notification) => {
        if (!n.read) markAsRead(n.id);
        if (n.link) window.location.href = n.link;
        setIsOpen(false);
    };

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative',
                    transition: 'all 0.2s'
                }}
            >
                🔔
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute', top: '2px', right: '2px', minWidth: '18px', height: '18px',
                        background: '#ef4444', borderRadius: '10px', border: '2px solid #050505',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: 'white', padding: '0 4px'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute', top: '50px', right: 0, width: '360px', maxHeight: '500px',
                    background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 1000,
                    overflow: 'hidden', display: 'flex', flexDirection: 'column'
                }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Powiadomienia</h4>
                        {unreadCount > 0 && <span style={{ fontSize: '0.75rem', color: '#8b5cf6' }}>{unreadCount} nowych</span>}
                    </div>

                    <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📭</div>
                                <p style={{ fontSize: '0.9rem' }}>Brak nowych powiadomień</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    onClick={() => handleNotificationClick(n)}
                                    style={{
                                        padding: '16px 20px', cursor: 'pointer', transition: 'all 0.2s',
                                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                                        background: n.read ? 'transparent' : 'rgba(139,92,246,0.05)',
                                        position: 'relative',
                                        display: 'flex', gap: '12px'
                                    }}
                                >
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '12px',
                                        background: getIconBg(n.type), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                    }}>
                                        {getIcon(n.type)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: n.read ? 'rgba(255,255,255,0.7)' : 'white' }}>{n.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', lineHeight: '1.4' }}>{n.message}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: '8px' }}>
                                            {formatTime(n.createdAt)}
                                        </div>
                                    </div>
                                    {!n.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', position: 'absolute', top: '24px', right: '12px' }} />}
                                </div>
                            ))
                        )}
                    </div>

                    <div style={{ padding: '12px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <button style={{ background: 'none', border: 'none', color: '#8b5cf6', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                            Oznacz wszystkie jako przeczytane
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function getIcon(type: string) {
    switch (type) {
        case 'lead': return '👤';
        case 'offer': return '💼';
        case 'payment': return '💰';
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        default: return '✉️';
    }
}

function getIconBg(type: string) {
    switch (type) {
        case 'lead': return 'rgba(59, 130, 246, 0.15)';
        case 'offer': return 'rgba(16, 185, 129, 0.15)';
        case 'payment': return 'rgba(245, 158, 11, 0.15)';
        default: return 'rgba(139, 92, 246, 0.15)';
    }
}

function formatTime(timestamp: any) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Przed chwilą';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min temu`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} godz temu`;
    return date.toLocaleDateString();
}
