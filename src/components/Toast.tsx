import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

export const ToastList: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastCard: React.FC<{ toast: ToastItem; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500); // Auto close after 4.5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle size={18} className="toast-icon success" style={{ color: 'var(--color-state-found)' }} />,
    error: <XCircle size={18} className="toast-icon error" style={{ color: 'var(--color-state-deleted)' }} />,
    warning: <AlertTriangle size={18} className="toast-icon warning" style={{ color: 'var(--color-state-comparing)' }} />,
    info: <Info size={18} className="toast-icon info" style={{ color: 'var(--color-state-normal)' }} />,
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: 'var(--radius-sm)',
        minWidth: '280px',
        maxWidth: '380px',
        boxShadow: 'var(--shadow-md)',
        borderLeft: `4px solid var(--color-state-${
          toast.type === 'success'
            ? 'found'
            : toast.type === 'error'
            ? 'deleted'
            : toast.type === 'warning'
            ? 'comparing'
            : 'normal'
        })`,
        animation: 'slideInRight 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
    >
      {icons[toast.type]}
      <span style={{ fontSize: '13.5px', fontWeight: 500, flex: 1, color: 'var(--text-primary)' }}>
        {toast.message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px',
        }}
      >
        <X size={14} />
      </button>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%) translateY(0); opacity: 0; }
          to { transform: translateX(0) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
