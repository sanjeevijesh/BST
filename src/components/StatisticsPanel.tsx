import React from 'react';
import { BarChart3 } from 'lucide-react';
import type { TreeStatistics } from '../algorithms/bst';

interface StatisticsPanelProps {
  stats: TreeStatistics;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ stats }) => {
  const {
    totalNodes,
    height,
    leafNodes,
    levels,
    minimum,
    maximum,
    averageDepth,
    balancePercentage,
    balanceStatus,
  } = stats;

  const meterColor =
    balanceStatus === 'Balanced'
      ? 'var(--color-state-found)'
      : balanceStatus === 'Slightly Unbalanced'
      ? 'var(--color-state-comparing)'
      : 'var(--color-state-deleted)';

  const statsItems = [
    { label: 'Total Nodes', value: totalNodes },
    { label: 'Tree Height', value: height },
    { label: 'Leaf Nodes', value: leafNodes },
    { label: 'Total Levels', value: levels },
    { label: 'Minimum', value: minimum !== null ? minimum : '—' },
    { label: 'Maximum', value: maximum !== null ? maximum : '—' },
    { label: 'Avg Node Depth', value: totalNodes > 0 ? averageDepth : '—' },
  ];

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
      <h3
        style={{
          fontSize: '15px',
          fontWeight: 600,
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: 0,
        }}
      >
        <BarChart3 size={16} style={{ color: 'var(--accent-color)' }} />
        Tree Statistics
      </h3>

      {/* Grid statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {statsItems.map((item, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
            }}
          >
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block' }}>
              {item.label}
            </span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', display: 'block' }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Balance Analyzer Meter */}
      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Tree Balance Analyzer
        </span>

        {/* Meter display */}
        <div
          style={{
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Shape Integrity
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: meterColor }}>
              {balancePercentage}% ({balanceStatus})
            </span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: '10px',
              backgroundColor: 'var(--border-color)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${balancePercentage}%`,
                height: '100%',
                backgroundColor: meterColor,
                borderRadius: 'var(--radius-full)',
                transition: 'width var(--transition-normal)',
              }}
            />
          </div>

          {/* Explanatory notes */}
          <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
            {balanceStatus === 'Balanced' &&
              'Optimal tree shape. Operations take O(log N) steps. Best performing search tree structure.'}
            {balanceStatus === 'Slightly Unbalanced' &&
              'Minor height divergence. Operations remain efficient, but could be optimized by rebalancing.'}
            {balanceStatus === 'Highly Unbalanced' &&
              'Skewed tree behavior approaching O(N) linear time complexity. High search times similar to a linked list.'}
          </p>
        </div>
      </div>
    </div>
  );
};
