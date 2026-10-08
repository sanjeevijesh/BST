import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Move } from 'lucide-react';
import type { BSTNode, NodeState } from '../algorithms/bst';

interface BSTVisualizerProps {
  root: BSTNode | null;
  nodesState: { [nodeValue: number]: NodeState };
  activeNode: BSTNode | null;
  setActiveNode: (node: BSTNode | null) => void;
  width?: string;
  height?: string;
}

export const BSTVisualizer: React.FC<BSTVisualizerProps> = ({
  root,
  nodesState,
  activeNode,
  setActiveNode,
  width = '100%',
  height = '480px',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Zoom and Pan States
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Hover Tooltip States
  const [hoverNode, setHoverNode] = useState<BSTNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const nodeRadius = 22;

  // Auto-fit tree on root change
  useEffect(() => {
    fitTree();
  }, [root]);

  const fitTree = () => {
    if (!root || !svgRef.current) {
      setPan({ x: 0, y: 0 });
      setZoom(1);
      return;
    }

    const svgWidth = svgRef.current.clientWidth || 600;
    // Set root to be centered horizontally, offset vertically
    setPan({ x: svgWidth / 2, y: 40 });
    setZoom(1);
  };

  // Zoom adjustments
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.4));
  const handleZoomReset = () => {
    setZoom(1);
    fitTree();
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    // Only pan if clicking on background or canvas, not nodes
    if ((e.target as SVGElement).tagName === 'svg' || (e.target as SVGElement).id === 'grid-bg' || (e.target as SVGElement).tagName === 'line') {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const scaleFactor = 0.05;
    const delta = e.deltaY < 0 ? 1 : -1;
    setZoom((prev) => Math.max(0.4, Math.min(2.5, prev + delta * scaleFactor)));
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Collect all edges from BST recursively
  const getEdges = (node: BSTNode | null): { from: BSTNode; to: BSTNode; isLeft: boolean }[] => {
    if (!node) return [];
    const edges: { from: BSTNode; to: BSTNode; isLeft: boolean }[] = [];
    if (node.left) {
      edges.push({ from: node, to: node.left, isLeft: true });
      edges.push(...getEdges(node.left));
    }
    if (node.right) {
      edges.push({ from: node, to: node.right, isLeft: false });
      edges.push(...getEdges(node.right));
    }
    return edges;
  };

  // Collect all nodes recursively
  const getNodes = (node: BSTNode | null): BSTNode[] => {
    if (!node) return [];
    return [node, ...getNodes(node.left), ...getNodes(node.right)];
  };

  const edgesList = getEdges(root);
  const nodesList = getNodes(root);

  // Helper to compute node color based on state
  const getNodeStyles = (nodeValue: number) => {
    const state = nodesState[nodeValue] || 'normal';
    
    // Map variables defined in index.css
    const stateColors = {
      normal: 'var(--color-state-normal)',
      comparing: 'var(--color-state-comparing)',
      traversed: 'var(--color-state-traversed)',
      found: 'var(--color-state-found)',
      deleted: 'var(--color-state-deleted)',
      inserted: 'var(--color-state-inserted)',
      successor: 'var(--color-state-successor)',
      candidate: 'var(--color-state-candidate)',
      highlighted: 'var(--accent-color)',
    };

    return {
      fill: stateColors[state],
      glow: `var(--color-state-${state === 'highlighted' ? 'normal' : state}-glow)`,
    };
  };

  // Determine node type label
  const getNodeType = (node: BSTNode): string => {
    if (node === root) return 'Root Node';
    if (!node.left && !node.right) return 'Leaf Node';
    return 'Internal Node';
  };

  return (
    <div
      ref={containerRef}
      className="premium-card glass-panel"
      style={{
        width,
        height: isFullscreen ? '100vh' : height,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      {/* Visualizer Header Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '10px',
          marginBottom: '10px',
        }}
      >
        <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Move size={14} style={{ color: 'var(--accent-color)' }} />
          BST Workspace Canvas
        </span>

        {/* Zoom & Pan buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn-secondary" onClick={handleZoomOut} style={{ padding: '4px 8px' }} title="Zoom Out">
            <ZoomOut size={14} />
          </button>
          <button className="btn-secondary" onClick={handleZoomReset} style={{ padding: '4px 10px', fontSize: '11px' }}>
            {Math.round(zoom * 100)}% (Fit)
          </button>
          <button className="btn-secondary" onClick={handleZoomIn} style={{ padding: '4px 8px' }} title="Zoom In">
            <ZoomIn size={14} />
          </button>
          <button className="btn-secondary" onClick={toggleFullscreen} style={{ padding: '4px 8px' }} title="Fullscreen">
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Main Drawing Area */}
      {nodesList.length === 0 ? (
        // Empty State Display
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '24px',
            color: 'var(--text-secondary)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <span style={{ fontSize: '28px' }}>🌱</span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Your BST is Empty
          </h3>
          <p style={{ maxWidth: '300px', fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Insert a node value or generate a random tree from the control bar to see algorithms in action.
          </p>
        </div>
      ) : (
        // SVG Tree Visualizer
        <svg
          ref={svgRef}
          style={{
            width: '100%',
            flex: 1,
            cursor: isPanning ? 'grabbing' : 'grab',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-sm)',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Arrowhead marker definition */}
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--text-muted)" />
            </marker>
          </defs>

          {/* Grid Background Pattern */}
          <rect id="grid-bg" width="100%" height="100%" fill="none" />

          {/* Render Connections (Edges) */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {edgesList.map((edge) => {
              const { from, to } = edge;
              
              // Edge math to stop at node boundaries
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (dist === 0) return null;

              const ux = dx / dist;
              const uy = dy / dist;

              // Start from boundary of parent
              const x1 = from.x + ux * nodeRadius;
              const y1 = from.y + uy * nodeRadius;

              // Stop at boundary of child
              const x2 = to.x - ux * (nodeRadius + 4);
              const y2 = to.y - uy * (nodeRadius + 4);

              // Edge state mapping: check state of 'to' child to highlight the path
              const childState = nodesState[to.value] || 'normal';
              const isHighlighting = childState === 'comparing' || childState === 'traversed' || childState === 'found';

              return (
                <line
                  key={`edge-${from.value}-${to.value}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className={`edge-path ${isHighlighting ? childState : ''}`}
                  markerEnd="url(#arrow)"
                />
              );
            })}

            {/* Render Nodes */}
            {nodesList.map((node) => {
              const { fill } = getNodeStyles(node.value);
              const isActive = activeNode?.value === node.value;
              const nodeState = nodesState[node.value] || 'normal';

              return (
                <g
                  key={`node-${node.value}`}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="node-group node-enter"
                  onClick={() => setActiveNode(isActive ? null : node)}
                  onMouseEnter={() => {
                    setHoverNode(node);
                    const rect = svgRef.current?.getBoundingClientRect();
                    if (rect) {
                      // Position tooltip above the node
                      setTooltipPos({
                        x: node.x * zoom + pan.x,
                        y: node.y * zoom + pan.y - 45,
                      });
                    }
                  }}
                  onMouseLeave={() => setHoverNode(null)}
                >
                  {/* Outer Glow Effect during active evaluation */}
                  {(nodeState !== 'normal' || isActive) && (
                    <circle
                      className="node-glow"
                      r={nodeRadius}
                      fill={fill}
                      opacity={0.15}
                      style={{ filter: 'blur(3px)' }}
                    />
                  )}

                  {/* Core Node Circle */}
                  <circle
                    className="node-circle"
                    r={nodeRadius}
                    fill="var(--bg-card)"
                    stroke={fill}
                    strokeWidth={isActive ? 4 : 2.5}
                    style={{
                      transition: 'all 0.25s',
                    }}
                  />

                  {/* Text Label */}
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="var(--text-primary)"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13.5px',
                      fontWeight: 600,
                    }}
                  >
                    {node.value}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      )}

      {/* Floating Tooltip Detail Pop-up */}
      {hoverNode && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            pointerEvents: 'none',
            zIndex: 100,
            whiteSpace: 'nowrap',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            Val: {hoverNode.value} ({getNodeType(hoverNode)})
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            Height: {hoverNode.height} | Depth: {hoverNode.depth}
          </div>
        </div>
      )}
    </div>
  );
};
