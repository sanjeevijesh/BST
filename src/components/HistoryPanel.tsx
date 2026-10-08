import React from 'react';
import { History, Undo2, Redo2, CircleAlert } from 'lucide-react';

export interface HistoryItem {
  id: string;
  type: 'insert' | 'search' | 'delete' | 'clear' | 'generate';
  value?: number;
  description: string;
  timestamp: string;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  undoStack: any[];
  redoStack: any[];
  onUndo: () => void;
  onRedo: () => void;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  undoStack,
  redoStack,
  onUndo,
  onRedo,
  onClearHistory,
}) => {
  const getBadgeColors = (type: HistoryItem['type']) => {
    const colors = {
      insert: { bg: 'rgba(6, 182, 212, 0.1)', text: 'var(--color-state-inserted)' },
      search: { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--color-state-comparing)' },
      delete: { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--color-state-deleted)' },
      clear: { bg: 'rgba(148, 163, 184, 0.1)', text: 'var(--text-secondary)' },
      generate: { bg: 'rgba(99, 102, 241, 0.1)', text: 'var(--color-state-normal)' },
    };
    return colors[type] || colors.clear;
  };

  return (
    <div
      className="premium-card glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '10px',
          margin: 0,
        }}
      >
        <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <History size={16} style={{ color: 'var(--accent-color)' }} />
          Operation History
        </h3>
        <button
          onClick={onClearHistory}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '11px',
            cursor: 'pointer',
            fontWeight: 500,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-state-deleted)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          Clear
        </button>
      </div>

      {/* Undo / Redo controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <button
          className="btn-secondary"
          onClick={onUndo}
          disabled={undoStack.length === 0}
          style={{
            justifyContent: 'center',
            fontSize: '12.5px',
            padding: '6px 10px',
            opacity: undoStack.length > 0 ? 1 : 0.5,
          }}
          title="Undo last modification"
        >
          <Undo2 size={14} /> Undo ({undoStack.length})
        </button>
        <button
          className="btn-secondary"
          onClick={onRedo}
          disabled={redoStack.length === 0}
          style={{
            justifyContent: 'center',
            fontSize: '12.5px',
            padding: '6px 10px',
            opacity: redoStack.length > 0 ? 1 : 0.5,
          }}
          title="Redo last undone action"
        >
          <Redo2 size={14} /> Redo ({redoStack.length})
        </button>
      </div>

      {/* Operations List */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          overflowY: 'auto',
          minHeight: '200px',
        }}
      >
        {history.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '12px',
              textAlign: 'center',
              padding: '24px 10px',
            }}
          >
            <CircleAlert size={20} />
            No operations performed yet. Build a tree to see your logs.
          </div>
        ) : (
          history.map((item) => {
            const badge = getBadgeColors(item.type);
            return (
              <div
                key={item.id}
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      backgroundColor: badge.bg,
                      color: badge.text,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.type}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {item.timestamp}
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {item.description}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
