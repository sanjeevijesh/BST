import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'I', desc: 'Focus Insert input field' },
    { key: 'S', desc: 'Focus Search input field' },
    { key: 'D', desc: 'Focus Delete input field' },
    { key: 'R', desc: 'Reset/Clear current tree' },
    { key: 'Space', desc: 'Play / Pause algorithm playback step' },
    { key: '←', desc: 'Step backward (Previous)' },
    { key: '→', desc: 'Step forward (Next)' },
    { key: 'Esc', desc: 'Close open dialogs / modal' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-sidebar)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Keyboard size={18} style={{ color: 'var(--accent-color)' }} />
            <h3 style={{ fontSize: '16px', margin: 0 }}>Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginBottom: '16px', lineHeight: 1.5 }}>
            Accelerate your learning lab experiments with these direct keys:
          </p>
          <div style={{ display: 'flex', flex: 'column', flexDirection: 'column', gap: '10px' }}>
            {shortcuts.map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <span style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {s.desc}
                </span>
                <kbd
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    boxShadow: '0 2px 0 var(--border-color)',
                    color: 'var(--accent-color)',
                  }}
                >
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            background: 'var(--bg-sidebar)',
            borderTop: '1px solid var(--border-color)',
            textAlign: 'right',
          }}
        >
          <button className="btn-primary" onClick={onClose} style={{ fontSize: '12px', padding: '6px 12px' }}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
