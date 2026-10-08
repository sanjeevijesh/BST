import React, { useState, useEffect } from 'react';
import { Trophy, Check, X, RefreshCw } from 'lucide-react';
import { mcqChallenges, buildTreeChallenges, areTreesIdentical } from '../algorithms/challengesData';

import { simulateInsert, layoutTree } from '../algorithms/bst';
import type { BSTNode } from '../algorithms/bst';

interface ChallengePanelProps {
  currentTree: BSTNode | null;
  onAutoInsert: (val: number) => void;
  onResetActiveTree: () => void;
  showToast: (msg: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  unlockAchievement: (name: string) => void;
  mcqScore: number;
  setMcqScore: (score: number) => void;
  mcqStreak: number;
  setMcqStreak: (streak: number) => void;
  mcqCompleted: string[];
  setMcqCompleted: (completed: string[]) => void;
  buildTreeCompleted: string[];
  setBuildTreeCompleted: (completed: string[]) => void;
}

export const ChallengePanel: React.FC<ChallengePanelProps> = ({
  currentTree,
  onAutoInsert,
  onResetActiveTree,
  showToast,
  unlockAchievement,
  mcqScore,
  setMcqScore,
  mcqStreak,
  setMcqStreak,
  mcqCompleted,
  setMcqCompleted,
  buildTreeCompleted,
  setBuildTreeCompleted,
}) => {
  const [subTab, setSubTab] = useState<'mcq' | 'build'>('mcq');

  // MCQ States
  const [mcqIdx, setMcqIdx] = useState(0);
  const [mcqAnswer, setMcqAnswer] = useState<number | null>(null);
  const [showMcqExplanation, setShowMcqExplanation] = useState(false);

  // Build Tree States
  const [buildIdx, setBuildIdx] = useState(0);
  const [challengeTargetTree, setChallengeTargetTree] = useState<BSTNode | null>(null);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const activeMCQ = mcqChallenges[mcqIdx];
  const activeBuild = buildTreeChallenges[buildIdx];

  // Pre-generate the target tree structure when target sequence changes
  useEffect(() => {
    if (subTab === 'build') {
      const tree = buildTargetTree(activeBuild.targetSequence);
      setChallengeTargetTree(tree);
      setChallengeCompleted(false);
    }
  }, [buildIdx, subTab]);

  // Continuously compare active workspace tree with target structure
  useEffect(() => {
    if (subTab === 'build' && challengeTargetTree && currentTree) {
      const match = areTreesIdentical(currentTree, challengeTargetTree);
      if (match && !challengeCompleted) {
        setChallengeCompleted(true);
        showToast(`Challenge completed: ${activeBuild.name}!`, 'success');
        
        if (!buildTreeCompleted.includes(activeBuild.id)) {
          const nextCompleted = [...buildTreeCompleted, activeBuild.id];
          setBuildTreeCompleted(nextCompleted);

          if (nextCompleted.length === 1) unlockAchievement('Tree Builder');
          if (nextCompleted.length === buildTreeChallenges.length) unlockAchievement('Search Master');
        }
      }
    }
  }, [currentTree, challengeTargetTree, subTab]);

  // Builds target tree structure recursively
  const buildTargetTree = (seq: number[]): BSTNode | null => {
    let tempRoot: BSTNode | null = null;
    seq.forEach((val) => {
      // Simulate insertions to generate structure
      const trace = simulateInsert(tempRoot, val);
      if (trace.length > 0) {
        tempRoot = trace[trace.length - 1].treeStructure;
      }
    });
    layoutTree(tempRoot);
    return tempRoot;
  };

  // MCQ Selection handler
  const handleMcqSelect = (idx: number) => {
    if (showMcqExplanation) return;
    setMcqAnswer(idx);
  };

  // MCQ submit handler
  const handleMcqSubmit = () => {
    if (mcqAnswer === null) {
      showToast('Select an answer first.', 'warning');
      return;
    }
    
    const isCorrect = mcqAnswer === activeMCQ.correctIndex;
    setShowMcqExplanation(true);

    if (isCorrect) {
      setMcqScore(mcqScore + 1);
      setMcqStreak(mcqStreak + 1);
      showToast('Correct answer! Keep it up.', 'success');

      if (!mcqCompleted.includes(activeMCQ.id)) {
        setMcqCompleted([...mcqCompleted, activeMCQ.id]);
      }
      
      if (mcqStreak + 1 >= 5) unlockAchievement('Brain Streak');
    } else {
      setMcqStreak(0);
      showToast('Incorrect answer. Read the explanation.', 'error');
    }
  };

  // Skip / Next MCQ
  const handleNextMcq = () => {
    setMcqAnswer(null);
    setShowMcqExplanation(false);
    setMcqIdx((prev) => (prev + 1) % mcqChallenges.length);
  };

  // Reset challenge tree
  const handleResetChallenge = () => {
    onResetActiveTree();
    setChallengeCompleted(false);
    showToast('Workspace tree cleared. Start building again!', 'info');
  };

  // Render static target tree nodes in challenge drawer
  const renderStaticTreeNodes = (node: BSTNode | null): React.ReactNode => {
    if (!node) return null;
    const r = 12; // smaller static node radius
    
    // Scale factor to fit inside 260x160 canvas
    const x = node.x * 0.5 + 130;
    const y = node.y * 0.45 + 25;

    return (
      <g key={`static-node-${node.value}`}>
        {node.left && (
          <line
            x1={x}
            y1={y + r}
            x2={node.left.x * 0.5 + 130}
            y2={node.left.y * 0.45 + 25 - r}
            stroke="var(--border-color)"
            strokeWidth="1.5"
          />
        )}
        {node.right && (
          <line
            x1={x}
            y1={y + r}
            x2={node.right.x * 0.5 + 130}
            y2={node.right.y * 0.45 + 25 - r}
            stroke="var(--border-color)"
            strokeWidth="1.5"
          />
        )}
        <circle cx={x} cy={y} r={r} fill="var(--bg-app)" stroke="var(--color-state-normal)" strokeWidth="1.5" />
        <text cx={x} cy={y} x={x} y={y + 4} textAnchor="middle" fill="var(--text-primary)" style={{ fontSize: '9px', fontWeight: 600 }}>
          {node.value}
        </text>
        {renderStaticTreeNodes(node.left)}
        {renderStaticTreeNodes(node.right)}
      </g>
    );
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '20px',
        height: '100%',
        overflow: 'hidden',
      }}
      className="challenge-panel-layout"
    >
      {/* Sidebar: Subtabs & Score card */}
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
        <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', margin: 0 }}>
          <Trophy size={16} style={{ color: 'var(--color-state-comparing)' }} />
          Practice Quizzes
        </h3>

        {/* Sub Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={() => setSubTab('mcq')}
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: subTab === 'mcq' ? 'var(--accent-glow)' : 'transparent',
              color: subTab === 'mcq' ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontWeight: subTab === 'mcq' ? 600 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            Concept Quizzes
          </button>
          <button
            onClick={() => setSubTab('build')}
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: subTab === 'build' ? 'var(--accent-glow)' : 'transparent',
              color: subTab === 'build' ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontWeight: subTab === 'build' ? 600 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            Build This Tree
          </button>
        </div>

        {/* Student Score Summary */}
        <div
          style={{
            marginTop: 'auto',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Completed Quizzes</span>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              {mcqCompleted.length} / {mcqChallenges.length}
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Build Mastered</span>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              {buildTreeCompleted.length} / {buildTreeChallenges.length}
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Quiz Streak 🔥</span>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-state-comparing)', marginTop: '4px' }}>
              {mcqStreak} correct
            </div>
          </div>
        </div>
      </div>

      {/* Main Challenge Content */}
      <div
        className="premium-card glass-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          height: '100%',
          overflowY: 'auto',
          padding: '24px',
        }}
      >
        {subTab === 'mcq' ? (
          /* MCQ Mode Layout */
          <>
            <div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: 'var(--bg-input)',
                  color: activeMCQ.difficulty === 'Easy' ? 'var(--color-state-found)' : activeMCQ.difficulty === 'Medium' ? 'var(--color-state-comparing)' : 'var(--color-state-deleted)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                }}
              >
                {activeMCQ.difficulty} Difficulty
              </span>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginTop: '8px', lineHeight: 1.4 }}>
                {activeMCQ.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeMCQ.options.map((opt, idx) => {
                const isSelected = mcqAnswer === idx;
                let optBorder = 'var(--border-color)';
                let optBg = 'transparent';

                if (isSelected) {
                  optBorder = 'var(--accent-color)';
                  optBg = 'var(--accent-glow)';
                }

                if (showMcqExplanation) {
                  if (idx === activeMCQ.correctIndex) {
                    optBorder = 'var(--color-state-found)';
                    optBg = 'rgba(16, 185, 129, 0.1)';
                  } else if (isSelected) {
                    optBorder = 'var(--color-state-deleted)';
                    optBg = 'rgba(239, 68, 68, 0.1)';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleMcqSelect(idx)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${optBorder}`,
                      backgroundColor: optBg,
                      color: 'var(--text-secondary)',
                      textAlign: 'left',
                      fontSize: '13.5px',
                      cursor: showMcqExplanation ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span>{opt}</span>
                    {showMcqExplanation && idx === activeMCQ.correctIndex && (
                      <Check size={14} style={{ color: 'var(--color-state-found)' }} />
                    )}
                    {showMcqExplanation && isSelected && idx !== activeMCQ.correctIndex && (
                      <X size={14} style={{ color: 'var(--color-state-deleted)' }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* MCQ Action Controls */}
            {!showMcqExplanation ? (
              <button
                className="btn-primary"
                onClick={handleMcqSubmit}
                style={{ alignSelf: 'flex-start', fontSize: '13px', padding: '8px 16px' }}
              >
                Submit Answer
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div
                  style={{
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.45,
                  }}
                >
                  <strong style={{ color: mcqAnswer === activeMCQ.correctIndex ? 'var(--color-state-found)' : 'var(--color-state-deleted)', display: 'block', marginBottom: '4px' }}>
                    {mcqAnswer === activeMCQ.correctIndex ? 'Correct!' : 'Incorrect'}
                  </strong>
                  {activeMCQ.explanation}
                </div>
                <button
                  className="btn-primary"
                  onClick={handleNextMcq}
                  style={{ alignSelf: 'flex-start', fontSize: '13px', padding: '8px 16px' }}
                >
                  Next Quiz Question
                </button>
              </div>
            )}
          </>
        ) : (
          /* Build Tree Challenge Mode Layout */
          <>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: 'var(--bg-input)',
                    color: activeBuild.difficulty === 'Easy' ? 'var(--color-state-found)' : activeBuild.difficulty === 'Medium' ? 'var(--color-state-comparing)' : 'var(--color-state-deleted)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                  }}
                >
                  {activeBuild.difficulty} Difficulty
                </span>
                <select
                  value={buildIdx}
                  onChange={(e) => setBuildIdx(parseInt(e.target.value))}
                  className="text-input"
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                >
                  {buildTreeChallenges.map((c, i) => (
                    <option key={c.id} value={i}>
                      {i + 1}. {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginTop: '10px' }}>{activeBuild.name}</h2>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                {activeBuild.instruction}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '280px 1fr',
                gap: '20px',
                marginTop: '10px',
              }}
              className="build-tree-split"
            >
              {/* Left Column: Static Target Model */}
              <div
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-app)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minHeight: '200px',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  TARGET TREE MODEL
                </span>
                <svg width="260" height="160" style={{ flex: 1, backgroundColor: 'transparent' }}>
                  {renderStaticTreeNodes(challengeTargetTree)}
                </svg>
              </div>

              {/* Right Column: Interactive workspace insertion links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    NUMBER POOL (CLICK TO INSERT IN WORKSPACE)
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                    {activeBuild.availableValues.map((val) => {
                      // Check if already in active tree
                      const nodesList = currentTree ? getNodesList(currentTree).map((n) => n.value) : [];
                      const exists = nodesList.includes(val);

                      return (
                        <button
                          key={val}
                          onClick={() => {
                            if (!exists && !challengeCompleted) onAutoInsert(val);
                          }}
                          disabled={exists || challengeCompleted}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: `1px solid ${exists ? 'var(--border-color)' : 'var(--color-state-normal)'}`,
                            backgroundColor: exists ? 'var(--bg-input)' : 'transparent',
                            color: exists ? 'var(--text-muted)' : 'var(--color-state-normal)',
                            fontWeight: 600,
                            fontSize: '13px',
                            cursor: exists || challengeCompleted ? 'default' : 'pointer',
                            opacity: exists ? 0.65 : 1,
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            if (!exists && !challengeCompleted) {
                              e.currentTarget.style.backgroundColor = 'var(--accent-glow)';
                              e.currentTarget.style.color = 'var(--accent-color)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!exists && !challengeCompleted) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = 'var(--color-state-normal)';
                            }
                          }}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-app)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.45,
                  }}
                >
                  💡 <strong>Tip:</strong> The order of insertions determines tree balance! Select values in an order that builds the exact branches of the target model.
                </div>

                {/* Status displays */}
                {challengeCompleted ? (
                  <div
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid var(--color-state-found)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px',
                      color: 'var(--color-state-found)',
                      fontWeight: 600,
                      textAlign: 'center',
                      fontSize: '13.5px',
                    }}
                  >
                    ✓ Target Tree Successfully Recreated!
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button className="btn-secondary" onClick={handleResetChallenge} style={{ fontSize: '12.5px', padding: '6px 12px' }}>
                      <RefreshCw size={13} /> Reset Active Tree
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .challenge-panel-layout {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto 1fr !important;
          }
          .build-tree-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

// Node extractor helper to check value lists
function getNodesList(node: BSTNode | null): BSTNode[] {
  if (!node) return [];
  return [node, ...getNodesList(node.left), ...getNodesList(node.right)];
}
