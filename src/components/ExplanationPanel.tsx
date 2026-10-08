import React from 'react';
import { Compass } from 'lucide-react';

interface ExplanationPanelProps {
  explanation: string;
  visitedValues: number[];
  comparisons: number;
  activeOp: 'insert' | 'search' | 'delete' | 'traverse' | null;
  targetVal: number | null;
  playbackActive: boolean;
  onClear?: () => void;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  explanation,
  visitedValues,
  comparisons,
  activeOp,
  targetVal,
  playbackActive,
  onClear,
}) => {
  return (
    <div
      className="premium-card glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '100%',
        overflowY: 'auto',
        minWidth: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: 0,
          }}
        >
          <Compass size={16} style={{ color: 'var(--accent-color)' }} />
          Algorithm Inspector
        </h3>
        {onClear && (
          <button
            className="btn-secondary"
            onClick={onClear}
            style={{
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              opacity: (playbackActive || visitedValues.length > 0 || Boolean(explanation)) ? 1 : 0.5,
            }}
            title="Clear Inspector Output"
          >
            Clear
          </button>
        )}
      </div>

      {/* Narrative Explanation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Current Action Details
        </span>
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13.5px',
            lineHeight: 1.5,
            color: 'var(--text-primary)',
            minHeight: '80px',
          }}
        >
          {explanation ? (
            explanation
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>
              No active algorithm execution. Perform an operation on the tree to view step explanations.
            </span>
          )}
        </div>
      </div>

      {/* Path visited details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Visited Breadcrumbs
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '6px',
            padding: '10px 12px',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            minHeight: '42px',
          }}
        >
          {visitedValues.length === 0 ? (
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Path is empty</span>
          ) : (
            visitedValues.map((val, idx) => (
              <React.Fragment key={idx}>
                <span
                  style={{
                    backgroundColor: idx === visitedValues.length - 1 ? 'var(--accent-glow)' : 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: idx === visitedValues.length - 1 ? 'var(--accent-color)' : 'var(--text-secondary)',
                    fontWeight: idx === visitedValues.length - 1 ? 600 : 500,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  {val}
                </span>
                {idx < visitedValues.length - 1 && (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>→</span>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      {/* Summary Statistics of operation */}
      {(playbackActive || visitedValues.length > 0 || Boolean(explanation)) && activeOp && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: 'auto',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '14px',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Operation Metrics
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {targetVal !== null && (
              <div
                style={{
                  backgroundColor: 'var(--bg-app)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Target Value</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {targetVal}
                </div>
              </div>
            )}
            
            <div
              style={{
                backgroundColor: 'var(--bg-app)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Comparisons</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-color)', marginTop: '2px' }}>
                {comparisons}
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-app)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                gridColumn: targetVal === null ? '1 / -1' : 'span 1',
              }}
            >
              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Operation Type</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px', textTransform: 'capitalize' }}>
                {activeOp}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
