import React, { useState, useEffect } from 'react';
import { BookOpen, Check, X, ArrowRight, PlayCircle, HelpCircle } from 'lucide-react';
import { lessonsData } from '../algorithms/lessonsData';

interface LessonPanelProps {
  completedLessons: string[];
  setCompletedLessons: (lessons: string[]) => void;
  loadLessonTree: (values: number[]) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  unlockAchievement: (name: string) => void;
}

export const LessonPanel: React.FC<LessonPanelProps> = ({
  completedLessons,
  setCompletedLessons,
  loadLessonTree,
  showToast,
  unlockAchievement,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const lesson = lessonsData[activeIdx];

  // Reset quiz states when active lesson changes
  useEffect(() => {
    setSelectedAns(null);
    setShowExplanation(false);
  }, [activeIdx]);

  const handleOptionSelect = (idx: number) => {
    if (showExplanation) return; // locked after answer
    setSelectedAns(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedAns === null) {
      showToast('Please select an option before submitting.', 'warning');
      return;
    }

    const correct = selectedAns === lesson.quiz.correctIndex;
    setIsCorrect(correct);
    setShowExplanation(true);

    if (correct) {
      showToast('Correct! Lesson module completed.', 'success');
      
      // Add to completed lessons
      if (!completedLessons.includes(lesson.id)) {
        const nextCompleted = [...completedLessons, lesson.id];
        setCompletedLessons(nextCompleted);
        
        if (nextCompleted.length === 1) unlockAchievement('First Tree');
        if (nextCompleted.length === 5) unlockAchievement('Traversal Expert');
        if (nextCompleted.length === lessonsData.length) unlockAchievement('BST Master');
      }
    } else {
      showToast('Incorrect answer. Review the material and try again.', 'error');
    }
  };

  const handleNextLesson = () => {
    if (activeIdx < lessonsData.length - 1) {
      setActiveIdx((prev) => prev + 1);
    }
  };

  // Simple Markdown Parser to render HTML blocks cleanly
  const renderMarkdown = (md: string) => {
    // Basic regex parser for tables, lists, codes, bolds
    let html = md;
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Code ticks
    html = html.replace(/`(.*?)`/g, '<code style="font-family: var(--font-mono); background-color: var(--bg-app); padding: 2px 6px; border-radius: 4px; font-size: 12px; color: var(--accent-color);">$1</code>');
    
    // Simple line break splitting
    return html.split('\n').map((line, idx) => {
      // Check for headings
      if (line.startsWith('### ')) {
        return <h4 key={idx} style={{ marginTop: '16px', marginBottom: '8px', fontSize: '14.5px', color: 'var(--text-primary)' }}>{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} style={{ marginTop: '20px', marginBottom: '10px', fontSize: '16px', color: 'var(--text-primary)' }}>{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={idx} style={{ marginLeft: '16px', marginBottom: '6px', fontSize: '13.5px', color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: line.replace('- ', '') }} />;
      }
      if (line.trim().startsWith('|')) {
        // Table row - display in custom styled layout
        return (
          <div key={idx} style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', padding: '6px 12px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--bg-app)' }} dangerouslySetInnerHTML={{ __html: line }} />
        );
      }
      if (line.trim() === '') return <div key={idx} style={{ height: '8px' }} />;
      
      return (
        <p key={idx} style={{ fontSize: '13.5px', lineHeight: 1.5, color: 'var(--text-secondary)', marginBottom: '10px' }} dangerouslySetInnerHTML={{ __html: line }} />
      );
    });
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '20px',
        height: '100%',
        overflow: 'hidden',
      }}
      className="lesson-panel-layout"
    >
      {/* Sidebar: Lessons Index */}
      <div
        className="premium-card glass-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', margin: 0 }}>
          <BookOpen size={16} style={{ color: 'var(--accent-color)' }} />
          Learning Curriculum
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {lessonsData.map((item, idx) => {
            const isCompleted = completedLessons.includes(item.id);
            const isActive = activeIdx === idx;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIdx(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isActive ? 'var(--accent-glow)' : 'transparent',
                  color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span>{item.id} — {item.title}</span>
                {isCompleted && (
                  <Check size={14} style={{ color: 'var(--color-state-found)' }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
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
        {/* Module Title */}
        <div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-color)', textTransform: 'uppercase' }}>
            Module {lesson.id} of {lessonsData.length}
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginTop: '4px' }}>{lesson.title}</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' }}>{lesson.subtitle}</p>
        </div>

        {/* Lesson Contents */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }} className="prose">
          {renderMarkdown(lesson.content)}
        </div>

        {/* Interactive Workspace Recommendation Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginTop: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <PlayCircle size={20} style={{ color: 'var(--color-state-comparing)' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>Interactive Lab Try-out</div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                {lesson.interactivePrompt}
              </p>
            </div>
          </div>
          <button
            className="btn-secondary"
            onClick={() => {
              loadLessonTree(lesson.initialTreeValues);
              showToast(`Loaded lesson initial values [${lesson.initialTreeValues.join(', ')}]`, 'info');
            }}
            style={{ fontSize: '12.5px', padding: '6px 12px', whiteSpace: 'nowrap' }}
          >
            Load Tree
          </button>
        </div>

        {/* Mini Quiz Card */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '20px',
            marginTop: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <HelpCircle size={16} style={{ color: 'var(--accent-color)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Module Knowledge Check</h3>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '18px',
            }}
          >
            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '14px', lineHeight: 1.4 }}>
              {lesson.quiz.question}
            </p>

            {/* MCQ Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lesson.quiz.options.map((opt, idx) => {
                const isSelected = selectedAns === idx;
                
                let optBorder = 'var(--border-color)';
                let optBg = 'transparent';
                
                if (isSelected) {
                  optBorder = 'var(--accent-color)';
                  optBg = 'var(--accent-glow)';
                }
                
                if (showExplanation) {
                  if (idx === lesson.quiz.correctIndex) {
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
                    onClick={() => handleOptionSelect(idx)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${optBorder}`,
                      backgroundColor: optBg,
                      color: 'var(--text-secondary)',
                      textAlign: 'left',
                      fontSize: '13px',
                      cursor: showExplanation ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span>{opt}</span>
                    {showExplanation && idx === lesson.quiz.correctIndex && (
                      <Check size={14} style={{ color: 'var(--color-state-found)' }} />
                    )}
                    {showExplanation && isSelected && idx !== lesson.quiz.correctIndex && (
                      <X size={14} style={{ color: 'var(--color-state-deleted)' }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quiz Submit button */}
            {!showExplanation ? (
              <button
                className="btn-primary"
                onClick={handleSubmitAnswer}
                style={{ marginTop: '16px', fontSize: '13px', padding: '8px 16px' }}
              >
                Submit Answer
              </button>
            ) : (
              <div style={{ marginTop: '16px' }}>
                {/* Explanation text */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-color)',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.45,
                    marginBottom: '16px',
                  }}
                >
                  <strong style={{ color: isCorrect ? 'var(--color-state-found)' : 'var(--color-state-deleted)', display: 'block', marginBottom: '4px' }}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </strong>
                  {lesson.quiz.explanation}
                </div>

                {/* Next module link */}
                {activeIdx < lessonsData.length - 1 && (
                  <button
                    className="btn-primary"
                    onClick={handleNextLesson}
                    style={{ fontSize: '13px', padding: '8px 16px' }}
                  >
                    Next Lesson <ArrowRight size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .lesson-panel-layout {
            grid-template-columns: 1fr !important;
            grid-template-rows: 200px 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
