'use client';

import { useNotifications } from '@/context/NotificationContext';

export default function ToastController() {
    const { toasts, dismissToast } = useNotifications();

    if (toasts.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            pointerEvents: 'none'
        }}>
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    onClick={() => dismissToast(toast.id)}
                    style={{
                        padding: '16px 24px',
                        borderRadius: '12px',
                        background: getToastBg(toast.type),
                        color: '#fff',
                        border: `1px solid ${getToastBorder(toast.type)}`,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        animation: 'toastIn 0.3s ease-out forwards',
                        maxWidth: '400px',
                        minWidth: '300px'
                    }}
                >
                    <span style={{ fontSize: '1.2rem' }}>{getToastIcon(toast.type)}</span>
                    <span style={{ fontSize: '0.95rem', flex: 1 }}>{toast.message}</span>
                    <button style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '1.2rem',
                        cursor: 'pointer'
                    }}>&times;</button>
                </div>
            ))}
            <style jsx global>{`
                @keyframes toastIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

function getToastBg(type: string) {
    switch (type) {
        case 'success': return 'rgba(16, 185, 129, 0.9)';
        case 'error': return 'rgba(239, 68, 68, 0.9)';
        case 'warning': return 'rgba(245, 158, 11, 0.9)';
        default: return 'rgba(59, 130, 246, 0.9)';
    }
}

function getToastBorder(type: string) {
    switch (type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        default: return '#3b82f6';
    }
}

function getToastIcon(type: string) {
    switch (type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        default: return 'ℹ️';
    }
}
