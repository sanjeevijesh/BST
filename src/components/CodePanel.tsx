import React, { useState } from 'react';
import { Code2 } from 'lucide-react';
import { CODE_LINES } from '../algorithms/bst';

interface CodePanelProps {
  activeOp: 'insert' | 'search' | 'delete' | 'traverse' | null;
  activeLines: { [lang: string]: number }; // Line index to highlight for each language
  playbackActive: boolean;
}

type Language = 'javascript' | 'python' | 'java' | 'cpp';

export const CodePanel: React.FC<CodePanelProps> = ({
  activeOp,
  activeLines,
  playbackActive,
}) => {
  const [lang, setLang] = useState<Language>('javascript');

  const languages: { id: Language; label: string }[] = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'python', label: 'Python' },
    { id: 'java', label: 'Java' },
    { id: 'cpp', label: 'C++' },
  ];

  // Default display operation if none is active
  const op = activeOp || 'search';
  const lines = CODE_LINES[lang]?.[op] || [];
  const highlightedLine = activeLines[lang] !== undefined ? activeLines[lang] : -1;

  return (
    <div
      className="premium-card glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: '100%',
        minHeight: '260px',
        minWidth: 0,
      }}
    >
      {/* Code Header Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '8px',
        }}
      >
        <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Code2 size={15} style={{ color: 'var(--accent-color)' }} />
          Code Synchronization
        </span>

        {/* Language Tabs */}
        <div style={{ display: 'flex', gap: '3px', backgroundColor: 'var(--bg-input)', padding: '2px', borderRadius: '4px' }}>
          {languages.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              style={{
                border: 'none',
                background: lang === l.id ? 'var(--bg-card)' : 'transparent',
                color: lang === l.id ? 'var(--accent-color)' : 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: '3px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Code Block Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minWidth: 0,
          width: '100%',
        }}
      >
        {/* Active Op Label overlay */}
        <span
          style={{
            position: 'absolute',
            top: '8px',
            right: '12px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
            padding: '2px 6px',
            borderRadius: '4px',
            textTransform: 'uppercase',
          }}
        >
          {op}
        </span>

        <pre className="code-pre" style={{ flex: 1, margin: 0, overflowX: 'auto', width: '100%', maxWidth: '100%' }}>
          <code style={{ display: 'block', minWidth: 0 }}>
            {lines.map((line, idx) => {
              const isActive = playbackActive && idx === highlightedLine;
              return (
                <span
                  key={idx}
                  className={`code-line ${isActive ? 'active' : ''}`}
                  style={{
                    borderLeft: isActive ? '3px solid var(--accent-color)' : 'none',
                    paddingLeft: isActive ? '5px' : '8px',
                  }}
                >
                  {line}
                </span>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
};
