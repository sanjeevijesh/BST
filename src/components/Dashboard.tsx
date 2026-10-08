import React from 'react';
import { BookOpen, PlayCircle, Trophy, BarChart3, ArrowRight, CheckSquare } from 'lucide-react';
import type { TabId } from './Sidebar';

interface DashboardProps {
  setActiveTab: (tab: TabId) => void;
  onQuickStart: (action: 'random' | 'insert' | 'search' | 'delete' | 'inorder') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, onQuickStart }) => {
  const features = [
    {
      title: 'Learn Fundamentals',
      desc: 'Master tree properties, structural boundaries, heights, and balancing parameters through 9 lessons.',
      icon: <BookOpen size={20} style={{ color: 'var(--color-state-normal)' }} />,
      tab: 'learn' as TabId,
    },
    {
      title: 'Step-by-Step Visualizer',
      desc: 'Watch insertion, deletion, and search paths navigate left and right dynamically on a live canvas.',
      icon: <PlayCircle size={20} style={{ color: 'var(--color-state-traversed)' }} />,
      tab: 'visualizer' as TabId,
    },
    {
      title: 'Interactive Quizzes',
      desc: 'Challenge yourself with conceptual MCQs and structural "Build This Tree" sequence recreations.',
      icon: <Trophy size={20} style={{ color: 'var(--color-state-comparing)' }} />,
      tab: 'challenges' as TabId,
    },
    {
      title: 'Performance Analysis',
      desc: 'Analyze balance integrity percentage ratios and sync-compare balanced vs skewed heights.',
      icon: <BarChart3 size={20} style={{ color: 'var(--color-state-found)' }} />,
      tab: 'comparison' as TabId,
    },
  ];

  const quickStartSteps = [
    { text: 'Generate a Random Tree', action: 'random' as const },
    { text: 'Insert a new Node', action: 'insert' as const },
    { text: 'Search for a Value', action: 'search' as const },
    { text: 'Delete a Leaf/Internal Node', action: 'delete' as const },
    { text: 'Run an Inorder Traversal', action: 'inorder' as const },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        padding: '24px',
        overflowY: 'auto',
        height: '100%',
      }}
    >
      {/* Hero Section */}
      <div
        className="premium-card glass-panel dashboard-hero"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '24px',
          padding: '36px 40px',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
          borderColor: 'rgba(99, 102, 241, 0.15)',
        }}
      >
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.8px', lineHeight: 1.2 }}>
            Master Binary Search Trees <br />
            <span style={{ color: 'var(--accent-color)' }}>Visually & Step-by-Step</span>
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: 1.6, maxWidth: '480px' }}>
            A modern computer science laboratory designed to help students visualize, experiment, and fully understand BST algorithms. Route through nodes, swap successors, and balance structures.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button className="btn-primary" onClick={() => setActiveTab('visualizer')}>
              Start Visualizing <ArrowRight size={15} />
            </button>
            <button className="btn-secondary" onClick={() => setActiveTab('learn')}>
              Learn BST
            </button>
          </div>
        </div>

        {/* Animated mini-BST graphic */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg width="220" height="150" style={{ overflow: 'visible' }}>
            <g style={{ animation: 'bob 4s ease-in-out infinite' }}>
              {/* Edges */}
              <line x1="110" y1="20" x2="60" y2="70" stroke="var(--border-color)" strokeWidth="2.5" />
              <line x1="110" y1="20" x2="160" y2="70" stroke="var(--border-color)" strokeWidth="2.5" />
              <line x1="60" y1="70" x2="30" y2="120" stroke="var(--border-color)" strokeWidth="2.5" />
              <line x1="60" y1="70" x2="90" y2="120" stroke="var(--border-color)" strokeWidth="2.5" />

              {/* Root */}
              <circle cx="110" cy="20" r="16" fill="var(--bg-card)" stroke="var(--color-state-normal)" strokeWidth="2.5" />
              <text x="110" y="24" textAnchor="middle" fill="var(--text-primary)" style={{ fontSize: '10px', fontWeight: 600 }}>50</text>
              <circle cx="110" cy="20" r="16" fill="var(--color-state-normal)" opacity="0.1" style={{ animation: 'pingGlow 2.5s infinite' }} />

              {/* Left child */}
              <circle cx="60" cy="70" r="16" fill="var(--bg-card)" stroke="var(--color-state-comparing)" strokeWidth="2.5" />
              <text x="60" y="74" textAnchor="middle" fill="var(--text-primary)" style={{ fontSize: '10px', fontWeight: 600 }}>30</text>

              {/* Right child */}
              <circle cx="160" cy="70" r="16" fill="var(--bg-card)" stroke="var(--color-state-found)" strokeWidth="2.5" />
              <text x="160" y="74" textAnchor="middle" fill="var(--text-primary)" style={{ fontSize: '10px', fontWeight: 600 }}>70</text>

              {/* Left children */}
              <circle cx="30" cy="120" r="16" fill="var(--bg-card)" stroke="var(--color-state-inserted)" strokeWidth="2.5" />
              <text x="30" y="124" textAnchor="middle" fill="var(--text-primary)" style={{ fontSize: '10px', fontWeight: 600 }}>20</text>

              <circle cx="90" cy="120" r="16" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="2.5" />
              <text x="90" y="124" textAnchor="middle" fill="var(--text-primary)" style={{ fontSize: '10px', fontWeight: 600 }}>40</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Grid of learning portals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {features.map((f, idx) => (
          <div
            key={idx}
            className="premium-card"
            style={{ display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer' }}
            onClick={() => setActiveTab(f.tab)}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-app)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-color)',
              }}
            >
              {f.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.45 }}>
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Start checklist */}
      <div
        className="premium-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckSquare size={16} style={{ color: 'var(--color-state-found)' }} />
          Quick Start Checklist
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {quickStartSteps.map((step, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {idx + 1}
                </span>
                <span style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{step.text}</span>
              </div>
              <button
                className="btn-secondary"
                onClick={() => onQuickStart(step.action)}
                style={{ fontSize: '11.5px', padding: '4px 10px' }}
              >
                Try Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded Animations Styles */}
      <style>{`
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pingGlow {
          0% { transform: scale(1); opacity: 0.35; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @media (max-width: 768px) {
          .dashboard-hero {
            grid-template-columns: 1fr !important;
            padding: 24px !important;
            text-align: center !important;
          }
          .dashboard-hero div:first-child {
            max-width: 100% !important;
          }
          .dashboard-hero div:first-child p {
            margin: 12px auto 0 !important;
          }
          .dashboard-hero div:first-child div {
            justify-content: center !important;
          }
          .dashboard-hero div:last-child {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
