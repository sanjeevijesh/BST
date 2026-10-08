import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import type { TabId } from './components/Sidebar';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { BSTVisualizer } from './components/BSTVisualizer';
import { ExplanationPanel } from './components/ExplanationPanel';
import { CodePanel } from './components/CodePanel';
import { StatisticsPanel } from './components/StatisticsPanel';
import { HistoryPanel } from './components/HistoryPanel';
import type { HistoryItem } from './components/HistoryPanel';
import { LessonPanel } from './components/LessonPanel';
import { ChallengePanel } from './components/ChallengePanel';
import { ComparisonPanel } from './components/ComparisonPanel';
import { Dashboard } from './components/Dashboard';
import { KeyboardShortcutsModal } from './components/Modal';
import { ToastList } from './components/Toast';
import type { ToastItem } from './components/Toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  calculateStatistics,
  simulateInsert,
  simulateSearch,
  simulateDelete,
  simulateTraversal,
  buildBalancedBST,
  layoutTree,
  cloneTree,
  generateId,
} from './algorithms/bst';
import type { BSTNode, TreeStateSnapshot } from './algorithms/bst';

export default function App() {
  // Theme & Navigation
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('bst-lab-theme', 'dark');
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  // Core BST tree structures
  const [root, setRoot] = useState<BSTNode | null>(null);
  const [activeNode, setActiveNode] = useState<BSTNode | null>(null);

  // Undo / Redo Stacks (save deep copies of roots)
  const [undoStack, setUndoStack] = useState<BSTNode[]>([]);
  const [redoStack, setRedoStack] = useState<BSTNode[]>([]);

  // Algorithm Playback States
  const [playbackActive, setPlaybackActive] = useState(false);
  const [activeOp, setActiveOp] = useState<'insert' | 'search' | 'delete' | 'traverse' | null>(null);
  const [targetVal, setTargetVal] = useState<number | null>(null);
  const [steps, setSteps] = useState<TreeStateSnapshot[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStepMode, setIsStepMode] = useLocalStorage<boolean>('bst-lab-step-mode', true);
  const [playbackSpeed, setPlaybackSpeed] = useLocalStorage<number>('bst-lab-speed', 1000);

  // Operational states
  const [inputValue, setInputValue] = useState('');
  const [genCount, setGenCount] = useState(7);
  const [genType, setGenType] = useState<'random' | 'balanced' | 'left-skewed' | 'right-skewed'>('random');

  // Persistence: Lessons, Challenges, achievements
  const [completedLessons, setCompletedLessons] = useLocalStorage<string[]>('bst-lab-lessons', []);
  const [mcqCompleted, setMcqCompleted] = useLocalStorage<string[]>('bst-lab-mcq-completed', []);
  const [buildTreeCompleted, setBuildTreeCompleted] = useLocalStorage<string[]>('bst-lab-build-completed', []);
  const [mcqScore, setMcqScore] = useLocalStorage<number>('bst-lab-mcq-score', 0);
  const [mcqStreak, setMcqStreak] = useLocalStorage<number>('bst-lab-mcq-streak', 0);
  const [achievements, setAchievements] = useLocalStorage<string[]>('bst-lab-achievements', []);

  const [historyLogs, setHistoryLogs] = useLocalStorage<HistoryItem[]>('bst-lab-history-logs', []);

  // UI elements: Modals & Toasts
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Apply theme attributes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toast notifier helper
  const showToast = (message: string, type: ToastItem['type']) => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Unlock achievements helper
  const unlockAchievement = (name: string) => {
    if (!achievements.includes(name)) {
      setAchievements((prev) => [...prev, name]);
      showToast(`🏆 Achievement Unlocked: ${name}!`, 'success');
    }
  };

  // Commit history logging helper
  const addLog = (type: HistoryItem['type'], description: string, value?: number) => {
    const log: HistoryItem = {
      id: generateId(),
      type,
      description,
      value,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setHistoryLogs((prev) => [log, ...prev]);
  };

  // -------------------------------------------------------------
  // Algorithm Playback Auto-Tick Loop
  // -------------------------------------------------------------
  useEffect(() => {
    let interval: any;

    if (playbackActive && isPlaying) {
      interval = setInterval(() => {
        handlePlaybackNext();
      }, playbackSpeed);
    }

    return () => clearInterval(interval);
  }, [playbackActive, isPlaying, currentStepIdx, steps, playbackSpeed]);

  const handlePlaybackNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      // Completed playback sequence
      setIsPlaying(false);
      if (activeOp !== 'traverse') {
        finishPlayback();
      } else {
        // Traversal finished: keep output and highlighting visible, do not auto-clear
        const finalStep = steps[steps.length - 1];
        if (finalStep) {
          const modeStr = finalStep.explanation.split(' ')[0] || '';
          addLog('generate', `${modeStr} Traversal executed`);
        }
      }
    }
  };

  const handleClearTraversal = () => {
    setIsPlaying(false);
    setPlaybackActive(false);
    setSteps([]);
    setCurrentStepIdx(0);
    setActiveOp(null);
    setActiveNode(null);
  };

  const handlePlaybackPrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handlePlaybackReplay = () => {
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  // Finalizes structural edits at the end of playback animations
  const finishPlayback = () => {
    const finalStep = steps[steps.length - 1];
    
    // Commit structural changes permanently if modifying operation
    if (activeOp === 'insert' || activeOp === 'delete') {
      setRoot(finalStep.treeStructure);
      
      const valStr = targetVal !== null ? ` ${targetVal}` : '';
      addLog(activeOp, `Finished: ${activeOp.toUpperCase()}${valStr}`, targetVal || undefined);
    } else if (activeOp === 'traverse') {
      const modeStr = steps[steps.length - 1].explanation.split(' ')[0] || '';
      addLog('generate', `${modeStr} Traversal executed`);
    }

    setPlaybackActive(false);
    setActiveNode(null);
  };

  // Skip playback to end immediately
  const skipPlaybackToEnd = () => {
    if (!playbackActive) return;
    setCurrentStepIdx(steps.length - 1);
    setIsPlaying(false);
    finishPlayback();
  };

  // -------------------------------------------------------------
  // Operational Triggers
  // -------------------------------------------------------------
  const handleInsert = (forcedVal?: number) => {
    const val = forcedVal !== undefined ? forcedVal : parseInt(inputValue);
    if (isNaN(val)) {
      showToast('Please enter a valid numeric value.', 'warning');
      return;
    }

    // Stop active plays
    skipPlaybackToEnd();

    // Check duplicate
    const valuesList = getValuesList(root);
    if (valuesList.includes(val)) {
      showToast(`Duplicate value: ${val} already exists in the BST.`, 'warning');
      return;
    }

    setInputValue('');
    setActiveNode(null);

    // Save history point
    pushToUndoStack(root);

    // Generate trace steps
    const trace = simulateInsert(root, val);
    setSteps(trace);
    setCurrentStepIdx(0);
    setActiveOp('insert');
    setTargetVal(val);
    setPlaybackActive(true);
    setIsPlaying(!isStepMode);
    
    // Navigate back to visualizer workspace
    if (activeTab !== 'visualizer' && activeTab !== 'challenges') {
      setActiveTab('visualizer');
    }
  };

  const handleSearch = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) {
      showToast('Please enter a valid search query.', 'warning');
      return;
    }

    skipPlaybackToEnd();
    setInputValue('');
    setActiveNode(null);

    const trace = simulateSearch(root, val);
    setSteps(trace);
    setCurrentStepIdx(0);
    setActiveOp('search');
    setTargetVal(val);
    setPlaybackActive(true);
    setIsPlaying(!isStepMode);

    addLog('search', `Started searching for value ${val}`, val);

    if (activeTab !== 'visualizer') {
      setActiveTab('visualizer');
    }
  };

  const handleDelete = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) {
      showToast('Specify value to delete.', 'warning');
      return;
    }

    const valuesList = getValuesList(root);
    if (!valuesList.includes(val)) {
      showToast(`Value ${val} not found in the tree.`, 'error');
      return;
    }

    skipPlaybackToEnd();
    setInputValue('');
    setActiveNode(null);

    pushToUndoStack(root);

    const trace = simulateDelete(root, val);
    setSteps(trace);
    setCurrentStepIdx(0);
    setActiveOp('delete');
    setTargetVal(val);
    setPlaybackActive(true);
    setIsPlaying(!isStepMode);

    if (activeTab !== 'visualizer') {
      setActiveTab('visualizer');
    }
  };

  const handleTraversal = (mode: 'inorder' | 'preorder' | 'postorder' | 'levelorder') => {
    if (!root) {
      showToast('BST is empty. Cannot traverse.', 'warning');
      return;
    }

    skipPlaybackToEnd();
    setActiveNode(null);

    const trace = simulateTraversal(root, mode);
    setSteps(trace);
    setCurrentStepIdx(0);
    setActiveOp('traverse');
    setTargetVal(null);
    setPlaybackActive(true);
    setIsPlaying(!isStepMode);

    if (activeTab !== 'visualizer') {
      setActiveTab('visualizer');
    }
  };

  // Clear workspace
  const handleClearTree = () => {
    skipPlaybackToEnd();
    pushToUndoStack(root);
    setRoot(null);
    setActiveNode(null);
    showToast('BST Workspace cleared successfully.', 'info');
    addLog('clear', 'Cleared tree workspace');
  };

  // Generate customized tree structures
  const handleGenerateTree = () => {
    skipPlaybackToEnd();
    pushToUndoStack(root);

    let generated: BSTNode | null = null;
    const count = genCount;

    if (genType === 'balanced') {
      // Create balanced BST from unique numbers
      const vals: number[] = [];
      while (vals.length < count) {
        const r = Math.floor(Math.random() * 90) + 10;
        if (!vals.includes(r)) vals.push(r);
      }
      generated = buildBalancedBST(vals);
    } else if (genType === 'left-skewed') {
      // Descending sequence: e.g. 70, 60, 50, 40...
      const start = 70;
      let curr: BSTNode | null = null;
      for (let i = 0; i < count; i++) {
        const val = start - i * 10;
        const trace = simulateInsert(curr, val);
        curr = trace[trace.length - 1].treeStructure;
      }
      generated = curr;
    } else if (genType === 'right-skewed') {
      // Ascending sequence: e.g. 10, 20, 30, 40...
      const start = 10;
      let curr: BSTNode | null = null;
      for (let i = 0; i < count; i++) {
        const val = start + i * 10;
        const trace = simulateInsert(curr, val);
        curr = trace[trace.length - 1].treeStructure;
      }
      generated = curr;
    } else {
      // Random insertion sequence
      let curr: BSTNode | null = null;
      const vals: number[] = [];
      while (vals.length < count) {
        const r = Math.floor(Math.random() * 90) + 10;
        if (!vals.includes(r)) {
          vals.push(r);
          const trace = simulateInsert(curr, r);
          curr = trace[trace.length - 1].treeStructure;
        }
      }
      generated = curr;
    }

    layoutTree(generated);
    setRoot(generated);
    setActiveNode(null);
    showToast(`Generated a ${genType} tree of ${count} nodes.`, 'success');
    addLog('generate', `Generated ${genType} tree (${count} nodes)`);
  };

  // Lesson loader
  const handleLoadLessonTree = (values: number[]) => {
    skipPlaybackToEnd();
    pushToUndoStack(root);

    // Build the tree sequentially from values
    let tempRoot: BSTNode | null = null;
    values.forEach((v) => {
      const trace = simulateInsert(tempRoot, v);
      tempRoot = trace[trace.length - 1].treeStructure;
    });
    layoutTree(tempRoot);
    setRoot(tempRoot);
    setActiveNode(null);
    setActiveTab('visualizer');
  };

  // -------------------------------------------------------------
  // Undo / Redo Stacks Actions
  // -------------------------------------------------------------
  const pushToUndoStack = (node: BSTNode | null) => {
    setUndoStack((prev) => [...prev, cloneTree(node) as BSTNode]);
    setRedoStack([]); // Clear redo
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    
    skipPlaybackToEnd();
    const prev = undoStack[undoStack.length - 1];
    
    setRedoStack((prevRedo) => [...prevRedo, cloneTree(root) as BSTNode]);
    setUndoStack((prevUndo) => prevUndo.slice(0, -1));
    
    setRoot(cloneTree(prev));
    setActiveNode(null);
    showToast('Undo completed.', 'info');
    addLog('clear', 'Undo performed');
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    skipPlaybackToEnd();
    const next = redoStack[redoStack.length - 1];

    setUndoStack((prevUndo) => [...prevUndo, cloneTree(root) as BSTNode]);
    setRedoStack((prevRedo) => prevRedo.slice(0, -1));

    setRoot(cloneTree(next));
    setActiveNode(null);
    showToast('Redo completed.', 'info');
    addLog('clear', 'Redo performed');
  };

  // -------------------------------------------------------------
  // Global Keyboard Shortcuts Hook
  // -------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is typing in forms, bypass shortcuts
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') {
        if (e.key === 'Escape') {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'i':
          e.preventDefault();
          const inp = document.querySelector('input[type="number"]') as HTMLInputElement;
          inp?.focus();
          break;
        case 's':
          e.preventDefault();
          handleSearch();
          break;
        case 'd':
          e.preventDefault();
          handleDelete();
          break;
        case 'r':
          e.preventDefault();
          handleClearTree();
          break;
        case ' ':
          e.preventDefault();
          if (playbackActive) setIsPlaying((prev) => !prev);
          break;
        case 'arrowleft':
          e.preventDefault();
          if (playbackActive) handlePlaybackPrev();
          break;
        case 'arrowright':
          e.preventDefault();
          if (playbackActive) handlePlaybackNext();
          break;
        case 'escape':
          setShortcutsOpen(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [root, playbackActive, inputValue, activeTab]);

  // Dashboard Checklist shortcut handler
  const handleQuickStartAction = (action: 'random' | 'insert' | 'search' | 'delete' | 'inorder') => {
    setActiveTab('visualizer');
    
    setTimeout(() => {
      if (action === 'random') {
        handleGenerateTree();
      } else if (action === 'insert') {
        // Load basic nodes, focus insert
        if (!root) {
          setRoot(buildBalancedBST([50, 30, 70]));
        }
        showToast('Focusing input box. Enter a value and click Insert.', 'info');
        const inp = document.querySelector('input[type="number"]') as HTMLInputElement;
        inp?.focus();
      } else if (action === 'search') {
        if (!root) setRoot(buildBalancedBST([50, 30, 70, 20, 40, 60, 80]));
        showToast('Searching for value 30. Check the path highlighted!', 'info');
        setInputValue('30');
        setTimeout(() => {
          const btn = document.querySelector('.btn-secondary') as HTMLButtonElement;
          btn?.click();
        }, 300);
      } else if (action === 'delete') {
        if (!root) setRoot(buildBalancedBST([50, 30, 70, 20, 40]));
        showToast('Focusing value to delete. Enter 20 and click Delete.', 'info');
        setInputValue('20');
        const inp = document.querySelector('input[type="number"]') as HTMLInputElement;
        inp?.focus();
      } else if (action === 'inorder') {
        if (!root) setRoot(buildBalancedBST([50, 30, 70, 20, 40, 60, 80]));
        handleTraversal('inorder');
      }
    }, 150);
  };

  // -------------------------------------------------------------
  // Data extraction mapping
  // -------------------------------------------------------------
  const displayRoot = playbackActive && steps[currentStepIdx] ? steps[currentStepIdx].treeStructure : root;
  const nodesState = playbackActive && steps[currentStepIdx] ? steps[currentStepIdx].nodesState : {};
  const explanationText = playbackActive && steps[currentStepIdx] ? steps[currentStepIdx].explanation : '';
  const visitedValues = playbackActive && steps[currentStepIdx] ? steps[currentStepIdx].visitedValues : [];
  const activeLines = playbackActive && steps[currentStepIdx] ? steps[currentStepIdx].activeLines : { javascript: -1, python: -1, java: -1, cpp: -1 };
  const stepComparisons = playbackActive && steps[currentStepIdx] ? steps[currentStepIdx].comparisons : 0;

  const currentStats = calculateStatistics(displayRoot);

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      {/* Background Repeating Watermark Overlay */}
      <div className="watermark-bg">
        {Array.from({ length: 16 }).map((_, idx) => (
          <div key={idx} className="watermark-item">
            R. Vazhan Arul Santhiya <br />
            <span style={{ fontSize: '0.85em', fontWeight: 550, opacity: 0.8 }}>AP/CSE</span>
          </div>
        ))}
      </div>

      {/* 1. Header Toolbar */}
      <Header
        theme={theme}
        setTheme={setTheme}
        openShortcuts={() => setShortcutsOpen(true)}
        lessonProgressCount={completedLessons.length}
        mcqProgressCount={mcqCompleted.length}
        achievements={achievements}
        resetTree={handleClearTree}
      />

      {/* 2. Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 3. Main Content Panel Router */}
      <main style={{ gridColumn: '2', height: '100%', overflow: 'hidden', position: 'relative' }} className="main-content-panel">
        
        {activeTab === 'dashboard' && (
          <Dashboard setActiveTab={setActiveTab} onQuickStart={handleQuickStartAction} />
        )}

        {activeTab === 'visualizer' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '20px',
              height: '100%',
              overflowY: 'auto',
            }}
            className="visualizer-scroll-container"
          >
            {/* Top: Controls */}
            <Controls
              inputValue={inputValue}
              setInputValue={setInputValue}
              onInsert={() => handleInsert()}
              onSearch={handleSearch}
              onDelete={handleDelete}
              generatorCount={genCount}
              setGeneratorCount={setGenCount}
              generatorType={genType}
              setGeneratorType={setGenType}
              onGenerate={handleGenerateTree}
              onClear={handleClearTree}
              isStepMode={isStepMode}
              setIsStepMode={setIsStepMode}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              currentStepIndex={currentStepIdx}
              totalSteps={steps.length}
              onStepNext={handlePlaybackNext}
              onStepPrev={handlePlaybackPrev}
              onStepReplay={handlePlaybackReplay}
              playbackSpeed={playbackSpeed}
              setPlaybackSpeed={setPlaybackSpeed}
              playbackActive={playbackActive}
            />

            {/* Middle: Main Canvas visualizer */}
            <div className="visualizer-canvas-container" style={{ height: '520px', minHeight: '520px', flexShrink: 0 }}>
              <BSTVisualizer
                root={displayRoot}
                nodesState={nodesState}
                activeNode={activeNode}
                setActiveNode={setActiveNode}
                height="100%"
              />
            </div>

            {/* Bottom Stack: Inspector, Stats, Code panels split side-by-side */}
            <div
              style={{
                display: 'grid',
                gap: '16px',
              }}
              className="visualizer-bottom-stack"
            >
              {/* Left Column: Node Info, Traversals, Inspector comments */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
                {activeNode && (
                  <div className="premium-card glass-panel" style={{ borderLeft: '4px solid var(--accent-color)', minWidth: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Node Inspector
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '10px', fontSize: '12.5px' }}>
                      <div>Value: <strong>{activeNode.value}</strong></div>
                      <div>Type: <strong>{activeNode === root ? 'Root' : (!activeNode.left && !activeNode.right ? 'Leaf' : 'Internal')}</strong></div>
                      <div>Height: {activeNode.height}</div>
                      <div>Depth: {activeNode.depth}</div>
                      <div style={{ gridColumn: 'span 2' }}>Left Child: {activeNode.left ? activeNode.left.value : 'None'}</div>
                      <div style={{ gridColumn: 'span 2' }}>Right Child: {activeNode.right ? activeNode.right.value : 'None'}</div>
                    </div>
                  </div>
                )}

                <div className="premium-card glass-panel" style={{ padding: '16px', minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Run Tree Traversals
                    </span>
                    {(playbackActive || visitedValues.length > 0) && (
                      <button
                        className="btn-secondary"
                        onClick={handleClearTraversal}
                        style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          cursor: 'pointer',
                        }}
                        title="Clear Traversal Output"
                      >
                        Clear Output
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                    <button className="btn-secondary" onClick={() => handleTraversal('inorder')} style={{ fontSize: '12px', padding: '8px 4px', whiteSpace: 'nowrap' }}>Inorder</button>
                    <button className="btn-secondary" onClick={() => handleTraversal('preorder')} style={{ fontSize: '12px', padding: '8px 4px', whiteSpace: 'nowrap' }}>Preorder</button>
                    <button className="btn-secondary" onClick={() => handleTraversal('postorder')} style={{ fontSize: '12px', padding: '8px 4px', whiteSpace: 'nowrap' }}>Postorder</button>
                    <button className="btn-secondary" onClick={() => handleTraversal('levelorder')} style={{ fontSize: '12px', padding: '8px 4px', whiteSpace: 'nowrap' }}>Level Order</button>
                    <button className="btn-secondary" onClick={handleClearTraversal} style={{ fontSize: '12px', padding: '8px 4px', whiteSpace: 'nowrap', color: 'var(--text-muted)' }} title="Clear Traversal Output">Clear</button>
                  </div>
                </div>

                <ExplanationPanel
                  explanation={explanationText}
                  visitedValues={visitedValues}
                  comparisons={stepComparisons}
                  activeOp={activeOp}
                  targetVal={targetVal}
                  playbackActive={playbackActive}
                  onClear={handleClearTraversal}
                />
              </div>

              {/* Right Column: Code Sync, Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
                <CodePanel
                  activeOp={activeOp}
                  activeLines={activeLines}
                  playbackActive={playbackActive}
                />
                <StatisticsPanel stats={currentStats} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comparison' && (
          <ComparisonPanel />
        )}

        {activeTab === 'learn' && (
          <div style={{ padding: '20px', height: '100%', overflow: 'hidden' }}>
            <LessonPanel
              completedLessons={completedLessons}
              setCompletedLessons={setCompletedLessons}
              loadLessonTree={handleLoadLessonTree}
              showToast={showToast}
              unlockAchievement={unlockAchievement}
            />
          </div>
        )}

        {activeTab === 'challenges' && (
          <div style={{ padding: '20px', height: '100%', overflow: 'hidden' }}>
            <ChallengePanel
              currentTree={root}
              onAutoInsert={(val) => handleInsert(val)}
              onResetActiveTree={handleClearTree}
              showToast={showToast}
              unlockAchievement={unlockAchievement}
              mcqScore={mcqScore}
              setMcqScore={setMcqScore}
              mcqStreak={mcqStreak}
              setMcqStreak={setMcqStreak}
              mcqCompleted={mcqCompleted}
              setMcqCompleted={setMcqCompleted}
              buildTreeCompleted={buildTreeCompleted}
              setBuildTreeCompleted={setBuildTreeCompleted}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div style={{ padding: '20px', height: '100%', overflow: 'hidden', maxWidth: '640px', margin: '0 auto' }}>
            <HistoryPanel
              history={historyLogs}
              undoStack={undoStack}
              redoStack={redoStack}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onClearHistory={() => {
                setHistoryLogs([]);
                showToast('Cleared logs.', 'info');
              }}
            />
          </div>
        )}

      </main>

      {/* Shortcuts Guide Help Modal */}
      <KeyboardShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      {/* Floating notification toasts list */}
      <ToastList toasts={toasts} removeToast={removeToast} />

      <style>{`
        /* Default bottom stack (Desktop: two columns) */
        .visualizer-bottom-stack {
          grid-template-columns: 1.1fr 0.9fr;
        }

        /* Collapsed stack (Tablet/Mobile: single column) */
        @media (max-width: 992px) {
          .visualizer-bottom-stack {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 1024px) {
          .main-content-panel {
            grid-column: 1 !important;
            padding-bottom: 60px !important; /* spacing for bottom menu drawer */
            height: calc(100vh - 124px) !important;
          }
        }
      `}</style>
    </div>
  );
}

// Extraction helper for values check
function getValuesList(node: BSTNode | null): number[] {
  if (!node) return [];
  return [node.value, ...getValuesList(node.left), ...getValuesList(node.right)];
}
