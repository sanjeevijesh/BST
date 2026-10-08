import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, HelpCircle } from 'lucide-react';

interface ControlsProps {
  inputValue: string;
  setInputValue: (val: string) => void;
  onInsert: () => void;
  onSearch: () => void;
  onDelete: () => void;
  
  // Tree generation options
  generatorCount: number;
  setGeneratorCount: (cnt: number) => void;
  generatorType: 'random' | 'balanced' | 'left-skewed' | 'right-skewed';
  setGeneratorType: (type: 'random' | 'balanced' | 'left-skewed' | 'right-skewed') => void;
  onGenerate: () => void;
  onClear: () => void;

  // Playback engine
  isStepMode: boolean;
  setIsStepMode: (val: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  currentStepIndex: number;
  totalSteps: number;
  onStepNext: () => void;
  onStepPrev: () => void;
  onStepReplay: () => void;
  playbackSpeed: number; // millisecond interval
  setPlaybackSpeed: (val: number) => void;
  playbackActive: boolean; // whether an operation trace is loaded
}

export const Controls: React.FC<ControlsProps> = ({
  inputValue,
  setInputValue,
  onInsert,
  onSearch,
  onDelete,
  generatorCount,
  setGeneratorCount,
  generatorType,
  setGeneratorType,
  onGenerate,
  onClear,
  isStepMode,
  setIsStepMode,
  isPlaying,
  setIsPlaying,
  currentStepIndex,
  totalSteps,
  onStepNext,
  onStepPrev,
  onStepReplay,
  playbackSpeed,
  setPlaybackSpeed,
  playbackActive,
}) => {


  return (
    <div
      className="premium-card glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '16px 20px',
      }}
    >
      {/* Upper Layer: Operations Forms & Generator */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'flex-end',
        }}
      >
        {/* Value Operations Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '240px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Execute BST Operations
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              type="number"
              placeholder="Val"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="text-input"
              style={{ width: '70px', padding: '8px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onInsert();
              }}
            />
            <button className="btn-primary" onClick={onInsert} style={{ padding: '8px 12px', fontSize: '13px' }}>
              Insert
            </button>
            <button className="btn-secondary" onClick={onSearch} style={{ padding: '8px 12px', fontSize: '13px' }}>
              Search
            </button>
            <button
              className="btn-secondary"
              onClick={onDelete}
              style={{
                padding: '8px 12px',
                fontSize: '13px',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: 'var(--color-state-deleted)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Tree Generator Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '320px', flex: 1 }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Tree Structure Generator
          </label>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <select
              value={generatorType}
              onChange={(e: any) => setGeneratorType(e.target.value)}
              className="text-input"
              style={{ padding: '8px', fontSize: '13px', minWidth: '110px' }}
            >
              <option value="random">Random</option>
            </select>

            <input
              type="number"
              min={3}
              max={25}
              value={generatorCount}
              onChange={(e) => setGeneratorCount(Math.min(25, Math.max(1, parseInt(e.target.value) || 0)))}
              className="text-input"
              style={{ width: '60px', padding: '8px', textAlign: 'center' }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>nodes</span>

            <button className="btn-primary" onClick={onGenerate} style={{ padding: '8px 12px', fontSize: '13px', marginLeft: 'auto' }}>
              Generate
            </button>
            <button className="btn-secondary" onClick={onClear} style={{ padding: '8px 12px', fontSize: '13px' }}>
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }} />

      {/* Lower Layer: Step playback controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {/* Step Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label
            style={{
              position: 'relative',
              display: 'inline-block',
              width: '40px',
              height: '20px',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={isStepMode}
              onChange={(e) => setIsStepMode(e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: isStepMode ? 'var(--accent-color)' : 'var(--border-color)',
                borderRadius: '20px',
                transition: '0.3s',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  content: '""',
                  height: '14px',
                  width: '14px',
                  left: isStepMode ? '22px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.3s',
                }}
              />
            </span>
          </label>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Interactive Step Mode
            <span title="Stops the algorithm at each stage, letting you navigate manually step-by-step" style={{ color: 'var(--text-muted)', cursor: 'help' }}>
              <HelpCircle size={13} />
            </span>
          </span>
        </div>

        {/* Playback Button Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="btn-secondary"
            onClick={onStepPrev}
            disabled={!playbackActive || currentStepIndex === 0}
            style={{ padding: '6px 10px', opacity: playbackActive ? 1 : 0.5 }}
            title="Previous Step"
          >
            <SkipBack size={13} />
          </button>
          
          <button
            className="btn-primary"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!playbackActive || currentStepIndex === totalSteps - 1}
            style={{
              padding: '6px 14px',
              opacity: (playbackActive && currentStepIndex < totalSteps - 1) ? 1 : 0.5,
              minWidth: '76px',
              justifyContent: 'center',
            }}
          >
            {isPlaying ? (
              <>
                <Pause size={13} /> Pause
              </>
            ) : (
              <>
                <Play size={13} /> Play
              </>
            )}
          </button>

          <button
            className="btn-secondary"
            onClick={onStepNext}
            disabled={!playbackActive || currentStepIndex === totalSteps - 1}
            style={{ padding: '6px 10px', opacity: playbackActive ? 1 : 0.5 }}
            title="Next Step"
          >
            <SkipForward size={13} />
          </button>

          <button
            className="btn-secondary"
            onClick={onStepReplay}
            disabled={!playbackActive}
            style={{ padding: '6px 10px', opacity: playbackActive ? 1 : 0.5 }}
            title="Restart Operation Animation"
          >
            <RotateCcw size={13} />
          </button>
        </div>

        {/* Playback Stats & Speed control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {playbackActive && (
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              Step: {currentStepIndex + 1} / {totalSteps}
            </span>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Slow</span>
            <input
              type="range"
              min={300}
              max={2200}
              step={100}
              value={2500 - playbackSpeed} // invert slider for intuitive slow-fast
              onChange={(e) => setPlaybackSpeed(2500 - parseInt(e.target.value))}
              style={{
                width: '100px',
                accentColor: 'var(--accent-color)',
                cursor: 'pointer',
              }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Fast</span>
          </div>
        </div>
      </div>
    </div>
  );
};
