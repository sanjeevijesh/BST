import React from 'react';
import {
  Sun,
  Moon,
  Keyboard,
  Award,
  RotateCcw,
} from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  openShortcuts: () => void;
  lessonProgressCount: number;
  mcqProgressCount: number;
  achievements: string[];
  resetTree: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  setTheme,
  openShortcuts,
  lessonProgressCount,
  mcqProgressCount,
  achievements,
  resetTree,
}) => {
  const lessonsTotal = 9;
  const mcqsTotal = 6;
  const overallPercentage = Math.round(((lessonProgressCount / lessonsTotal) * 50) + ((mcqProgressCount / mcqsTotal) * 50));

  return (
    <header
      className="glass-panel"
      style={{
        gridColumn: '1 / -1',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 50,
      }}
    >
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
          src="/logo.jpg"
          alt="RVA Logo"
          style={{
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        />
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px', margin: 0 }}>
            BST<span style={{ color: 'var(--accent-color)', fontWeight: 500 }}>Lab</span>
          </h1>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block', marginTop: '-3px' }}>
            Algorithm Workspace v2.0
          </span>
        </div>
      </div>

      {/* Center Controls: Reset Tree */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="btn-secondary"
          onClick={resetTree}
          title="Reset Tree"
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <RotateCcw size={14} />
          <span>Reset Tree</span>
        </button>
      </div>

      {/* Right Controls: Progress, Achievements, Theme, Shortcuts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Progress Tracker Card */}
        <div
          className="hide-mobile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Progress:</span>{' '}
            <span style={{ fontWeight: 600, color: 'var(--accent-color)' }}>{overallPercentage}%</span>
            <div
              style={{
                width: '60px',
                height: '4px',
                backgroundColor: 'var(--border-color)',
                borderRadius: 'var(--radius-full)',
                marginTop: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${overallPercentage}%`,
                  height: '100%',
                  backgroundColor: 'var(--accent-color)',
                }}
              />
            </div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Award size={14} style={{ color: 'var(--color-state-comparing)' }} />
            <span style={{ fontWeight: 600 }}>{achievements.length}</span>
          </div>
        </div>

        {/* Keyboard Shortcuts Helper */}
        <button
          onClick={openShortcuts}
          className="btn-secondary"
          style={{ padding: '8px', borderRadius: 'var(--radius-full)' }}
          title="Shortcuts Guide"
        >
          <Keyboard size={16} />
        </button>

        {/* Theme Switcher Toggle */}
        <div
          className="theme-toggle-container"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          <div
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: theme === 'dark' ? 'var(--bg-card)' : 'transparent',
              color: theme === 'dark' ? 'var(--accent-color)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              transition: 'background var(--transition-fast), color var(--transition-fast)',
            }}
          >
            <Moon size={14} />
          </div>
          <div
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: theme === 'light' ? 'var(--bg-sidebar)' : 'transparent',
              color: theme === 'light' ? 'var(--accent-color)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              transition: 'background var(--transition-fast), color var(--transition-fast)',
            }}
          >
            <Sun size={14} />
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 576px) {
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
