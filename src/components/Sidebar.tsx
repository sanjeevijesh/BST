import React from 'react';
import {
  BookOpen,
  PlayCircle,
  HelpCircle,
  History,
  Layers,
  Activity,
} from 'lucide-react';

export type TabId =
  | 'dashboard'
  | 'visualizer'
  | 'comparison'
  | 'learn'
  | 'challenges'
  | 'history';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <Layers size={18} /> },
    { id: 'visualizer', name: 'BST Visualizer', icon: <PlayCircle size={18} /> },
    { id: 'comparison', name: 'Compare BSTs', icon: <Activity size={18} /> },
    { id: 'learn', name: 'Learn Modules', icon: <BookOpen size={18} /> },
    { id: 'challenges', name: 'Challenges', icon: <HelpCircle size={18} /> },
    { id: 'history', name: 'History Drawer', icon: <History size={18} /> },
  ] as const;

  return (
    <aside
      className="glass-panel sidebar-wrapper"
      style={{
        gridColumn: '1',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--border-color)',
        padding: '16px 12px',
        background: 'var(--bg-sidebar)',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: isActive ? 'var(--accent-glow)' : 'transparent',
                color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13.5px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-card-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              <span className="sidebar-text">{item.name}</span>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '12px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <p>Data Structures Lab</p>
        <p style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '10px', marginTop: '2px' }}>R. Vazhan Arul Santhiya</p>
        <p style={{ fontSize: '9.5px' }}>AP/CSE</p>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .sidebar-wrapper {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100vw !important;
            height: 60px !important;
            flex-direction: row !important;
            grid-column: unset !important;
            border-right: none !important;
            border-top: 1px solid var(--border-color) !important;
            padding: 4px 8px !important;
            z-index: 100 !important;
            justify-content: space-around !important;
            overflow: hidden !important;
          }
          .sidebar-wrapper div:first-child {
            flex-direction: row !important;
            width: 100% !important;
            justify-content: space-between !important;
          }
          .sidebar-wrapper button {
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 2px !important;
            padding: 4px 2px !important;
            font-size: 10px !important;
            flex: 1 !important;
          }
          .sidebar-text {
            font-size: 9px !important;
          }
          .sidebar-wrapper div:last-child {
            display: none !important;
          }
        }
      `}</style>
    </aside>
  );
};
