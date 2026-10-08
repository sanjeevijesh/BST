import React, { useState, useEffect } from 'react';
import { RefreshCw, Activity, ArrowRight } from 'lucide-react';
import { simulateSearch, buildBalancedBST, layoutTree, simulateInsert } from '../algorithms/bst';
import type { BSTNode } from '../algorithms/bst';
import { BSTVisualizer } from './BSTVisualizer';

export const ComparisonPanel: React.FC = () => {
  const [searchValue, setSearchValue] = useState('70');
  
  // Custom states for split view trees
  const [balancedRoot, setBalancedRoot] = useState<BSTNode | null>(null);
  const [skewedRoot, setSkewedRoot] = useState<BSTNode | null>(null);

  // Playback Control States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [balancedSteps, setBalancedSteps] = useState<any[]>([]);
  const [skewedSteps, setSkewedSteps] = useState<any[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // 1s interval

  const values = [10, 20, 30, 40, 50, 60, 70];

  // Initialize trees
  useEffect(() => {
    resetTrees();
  }, []);

  const resetTrees = () => {
    // 1. Build balanced tree
    const balTree = buildBalancedBST(values);
    setBalancedRoot(balTree);

    // 2. Build skewed tree (insert sequentially)
    let skewTree: BSTNode | null = null;
    values.forEach((val) => {
      const trace = simulateInsert(skewTree, val);
      if (trace.length > 0) {
        skewTree = trace[trace.length - 1].treeStructure;
      }
    });
    layoutTree(skewTree);
    setSkewedRoot(skewTree);

    // Clear active steps
    setIsPlaying(false);
    setCurrentStep(0);
    setBalancedSteps([]);
    setSkewedSteps([]);
  };

  // Perform synchronized search
  const handleCompareSearch = () => {
    const val = parseInt(searchValue);
    if (isNaN(val)) return;

    // Simulate search on both trees
    const balSteps = simulateSearch(balancedRoot, val);
    const skewSteps = simulateSearch(skewedRoot, val);

    setBalancedSteps(balSteps);
    setSkewedSteps(skewSteps);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  // Synchronized playback timer tick
  useEffect(() => {
    let timer: any;
    const maxSteps = Math.max(balancedSteps.length, skewedSteps.length);

    if (isPlaying && maxSteps > 0) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < maxSteps - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    }

    return () => clearInterval(timer);
  }, [isPlaying, balancedSteps, skewedSteps, playbackSpeed]);

  const maxSteps = Math.max(balancedSteps.length, skewedSteps.length);
  const activeBalStep = balancedSteps[Math.min(currentStep, balancedSteps.length - 1)] || null;
  const activeSkewStep = skewedSteps[Math.min(currentStep, skewedSteps.length - 1)] || null;

  // Extract displaying coordinates
  const balDisplayRoot = activeBalStep ? activeBalStep.treeStructure : balancedRoot;
  const skewDisplayRoot = activeSkewStep ? activeSkewStep.treeStructure : skewedRoot;

  const balStates = activeBalStep ? activeBalStep.nodesState : {};
  const skewStates = activeSkewStep ? activeSkewStep.nodesState : {};

  const balComparisons = activeBalStep ? activeBalStep.comparisons : 0;
  const skewComparisons = activeSkewStep ? activeSkewStep.comparisons : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px',
        overflowY: 'auto',
        height: '100%',
      }}
    >
      {/* Title Header */}
      <div
        className="premium-card glass-panel"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} style={{ color: 'var(--accent-color)' }} />
            Balanced vs. Skewed BST Comparison
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Search for the same value on both trees in parallel to witness why tree height determines speed.
          </p>
        </div>

        {/* Input & Action */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="text-input"
            style={{ width: '80px', padding: '8px', textAlign: 'center' }}
          />
          <button className="btn-primary" onClick={handleCompareSearch} style={{ fontSize: '13px', padding: '8px 16px' }}>
            Compare Search
          </button>
          <button className="btn-secondary" onClick={resetTrees} style={{ padding: '8px' }} title="Reset Trees">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Main Split Visualizers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          flex: 1,
          minHeight: '340px',
        }}
        className="comparison-split"
      >
        {/* Left Side: Balanced BST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid var(--color-state-found)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              color: 'var(--color-state-found)',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>BALANCED TREE (Root 40, Height 2)</span>
            <span>Comparisons: {balComparisons}</span>
          </div>
          <BSTVisualizer
            root={balDisplayRoot}
            nodesState={balStates}
            activeNode={null}
            setActiveNode={() => {}}
            height="320px"
          />
        </div>

        {/* Right Side: Skewed BST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--color-state-deleted)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              color: 'var(--color-state-deleted)',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>SKEWED TREE (Root 10, Height 6)</span>
            <span>Comparisons: {skewComparisons}</span>
          </div>
          <BSTVisualizer
            root={skewDisplayRoot}
            nodesState={skewStates}
            activeNode={null}
            setActiveNode={() => {}}
            height="320px"
          />
        </div>
      </div>

      {/* Sync Playback Toolbar */}
      {maxSteps > 0 && (
        <div
          className="premium-card glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 20px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn-secondary"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              style={{ padding: '6px 10px' }}
            >
              Prev
            </button>
            <button
              className="btn-primary"
              onClick={() => setIsPlaying(!isPlaying)}
              style={{ padding: '6px 12px', fontSize: '13px' }}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              className="btn-secondary"
              onClick={() => setCurrentStep((prev) => Math.min(maxSteps - 1, prev + 1))}
              disabled={currentStep === maxSteps - 1}
              style={{ padding: '6px 10px' }}
            >
              Next
            </button>
          </div>

          <span style={{ fontSize: '12.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            Sync Step: {currentStep + 1} / {maxSteps}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Speed:</span>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))}
              className="text-input"
              style={{ padding: '4px 8px', fontSize: '12px' }}
            >
              <option value={1500}>Slow (1.5s)</option>
              <option value={1000}>Normal (1.0s)</option>
              <option value={500}>Fast (0.5s)</option>
            </select>
          </div>
        </div>
      )}

      {/* Educational Narrative Card */}
      <div
        className="premium-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderLeft: '4px solid var(--accent-color)',
        }}
      >
        <h4 style={{ fontSize: '14.5px', fontWeight: 600 }}>Complexity Analysis</h4>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
          Notice how the search target (e.g. 70) is found in only <strong>3 comparisons</strong> on the Balanced BST, because the height is restricted to <strong>log<sub>2</sub>(N)</strong>. On the Skewed BST, the search behaves like a linear scan, traversing through all <strong>7 nodes</strong> (taking 7 comparisons).
        </p>
        <p style={{ fontSize: '13px', color: 'var(--accent-color)', fontWeight: 500, margin: 0, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          Balanced BST: O(log N) operations <ArrowRight size={12} /> Skewed BST: O(N) operations degradation
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .comparison-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
