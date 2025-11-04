/**
 * GraphVisualizer Component - Complete with Code Viewer and Manual Editor
 * Displays graph algorithms with synchronized code execution
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlgorithmRunner } from '../utils/animations';
import { getAlgorithm, getAlgorithmInfo } from '../algorithms';
import { useAppStore } from '../store/appState';
import { GraphNode, GraphEdge, AlgorithmStep } from '../types';
import { ControlsPanel } from './ControlsPanel';
import { CodeViewer } from './CodeViewer';
import { GraphEditorModal } from './GraphEditorModal';
import { getAlgorithmCode } from '../utils/algorithmCode';

export const GraphVisualizer: React.FC = () => {
  const {
    graphState,
    setGraphNodes,
    setGraphEdges,
    updateGraphState,
    selectedAlgorithm,
  } = useAppStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [canStepForward, setCanStepForward] = useState(false);
  const [canStepBackward, setCanStepBackward] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [startNode, setStartNode] = useState<string>('0');
  const [endNode, setEndNode] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 600, height: 500 });
  const [showCodePanel, setShowCodePanel] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

  const runnerRef = useRef<AlgorithmRunner | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const algorithmInfo = selectedAlgorithm
    ? getAlgorithmInfo('graph', selectedAlgorithm)
    : null;

  const algorithmCode = selectedAlgorithm
    ? getAlgorithmCode(selectedAlgorithm)
    : null;

  // Initialize with default graph
  useEffect(() => {
    if (graphState.nodes.length === 0) {
      generateDefaultGraph();
    }
  }, []);

  // Update viewBox on container resize
  useEffect(() => {
    const updateViewBox = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setViewBox({ x: 0, y: 0, width, height });
      }
    };

    updateViewBox();
    window.addEventListener('resize', updateViewBox);
    return () => window.removeEventListener('resize', updateViewBox);
  }, []);

  const generateDefaultGraph = () => {
    const centerX = 300;
    const centerY = 250;
    const radius = 150;
    const nodes: GraphNode[] = [];
    const nodeCount = 6;
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i * 2 * Math.PI) / nodeCount - Math.PI / 2;
      nodes.push({
        id: String(i),
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        label: String(i),
      });
    }

    const edges: GraphEdge[] = [
      { from: '0', to: '1', weight: 4 },
      { from: '1', to: '2', weight: 5 },
      { from: '2', to: '3', weight: 3 },
      { from: '3', to: '4', weight: 2 },
      { from: '4', to: '5', weight: 6 },
      { from: '5', to: '0', weight: 7 },
      { from: '0', to: '3', weight: 8 },
      { from: '1', to: '4', weight: 9 },
    ];

    setGraphNodes(nodes);
    setGraphEdges(edges);
    setStartNode('0');
    setEndNode('5');
  };

  const generateRandomGraph = () => {
    const nodeCount = 6 + Math.floor(Math.random() * 4);
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    const centerX = 300;
    const centerY = 250;
    const radius = 150;

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i * 2 * Math.PI) / nodeCount - Math.PI / 2;
      const jitter = (Math.random() - 0.5) * 30;
      nodes.push({
        id: String(i),
        x: centerX + (radius + jitter) * Math.cos(angle),
        y: centerY + (radius + jitter) * Math.sin(angle),
        label: String(i),
      });
    }

    const maxEdges = Math.min(nodeCount * 2, nodeCount + 5);
    const connected = new Set<string>(['0']);

    for (let i = 1; i < nodeCount; i++) {
      const fromNode = Array.from(connected)[Math.floor(Math.random() * connected.size)];
      const weight = Math.floor(Math.random() * 10) + 1;
      // Create undirected edges (both directions)
      edges.push({
        from: fromNode,
        to: String(i),
        weight: weight,
      });
      edges.push({
        from: String(i),
        to: fromNode,
        weight: weight,
      });
      connected.add(String(i));
    }

    const extraEdges = Math.min(5, maxEdges - edges.length);
    let attempts = 0;
    while (edges.length < (nodeCount - 1) * 2 + extraEdges && attempts < 50) {
      attempts++;
      const from = String(Math.floor(Math.random() * nodeCount));
      const to = String(Math.floor(Math.random() * nodeCount));
      
      if (from === to) continue;
      if (edges.some(e => 
        (e.from === from && e.to === to) || (e.from === to && e.to === from)
      )) continue;

      const weight = Math.floor(Math.random() * 10) + 1;
      // Create undirected edges (both directions)
      edges.push({
        from,
        to,
        weight: weight,
      });
      edges.push({
        from: to,
        to: from,
        weight: weight,
      });
    }

    setGraphNodes(nodes);
    setGraphEdges(edges);
    setStartNode('0');
    setEndNode(String(nodeCount - 1));
  };

  const determineStepType = (step: AlgorithmStep): string => {
    const msg = step.message?.toLowerCase() || '';
    
    // A* specific patterns
    if (selectedAlgorithm === 'astar') {
      if (msg.includes('starting a*')) return 'starting';
      if (msg.includes('path found')) return 'path_found';
      if (msg.includes('exploring') && msg.includes('(g=')) return 'exploring';
      if (msg.includes('checking') && msg.includes('→')) return 'checking';
      if (msg.includes('updated') && msg.includes('g=')) return 'updated';
      if (msg.includes('no path')) return 'no_path';
    }
    
    // Dijkstra specific patterns
    if (selectedAlgorithm === 'dijkstra') {
      if (msg.includes('starting')) return 'init';
      if (msg.includes('extract')) return 'extract_min';
      if (msg.includes('visiting node')) return 'visit';
      if (msg.includes('checking edge')) return 'relax';
      if (msg.includes('updated distance')) return 'relax';
      if (msg.includes('path found')) return 'complete';
    }
    
    // BFS/DFS patterns
    if (msg.includes('dequeue') || msg.includes('pop')) return 'dequeue';
    if (msg.includes('visiting:') || msg.includes('visit')) return 'visit';
    if (msg.includes('neighbor')) return 'check_neighbor';
    if (msg.includes('enqueue') || msg.includes('push')) return 'enqueue';
    
    // MST patterns
    if (msg.includes('extract')) return 'extract_min';
    if (msg.includes('mst') || msg.includes('add')) return 'add_to_mst';
    if (msg.includes('edge')) return 'add_edges';
    
    // General patterns
    if (msg.includes('relax') || msg.includes('distance')) return 'relax';
    if (msg.includes('complete')) return 'complete';
    if (msg.includes('init') || msg.includes('starting')) return 'init';
    
    return 'init';
  };

  const handlePlay = () => {
    if (!selectedAlgorithm) return;

    const algorithm = getAlgorithm('graph', selectedAlgorithm);
    if (!algorithm) return;

    const needsEndNode = ['dijkstra', 'astar'].includes(selectedAlgorithm);
    const targetNode = needsEndNode && endNode ? endNode : undefined;

    const generator = algorithm(graphState.nodes, graphState.edges, startNode, targetNode);

    const runner = new AlgorithmRunner(
      generator,
      (step: AlgorithmStep) => {
        updateGraphState({
          nodes: step.nodes || graphState.nodes,
          edges: step.edges || graphState.edges,
          visitedNodes: step.visitedNodes || [],
          currentNode: step.activeNode || null,
          currentEdge: step.activeEdge || null,
          path: step.path || [],
          message: step.message || '',
          comparisons: step.comparisons || 0,
          operations: step.comparisons || 0,
        });

        // Update highlighted code lines
        const stepType = determineStepType(step);
        if (algorithmCode) {
          const lines = algorithmCode.stepToLineMap[stepType] || [];
          setHighlightedLines(lines);
        }
      },
      () => {
        setIsPlaying(false);
        setHighlightedLines([]);
      }
    );

    runnerRef.current = runner;
    runner.setSpeed(speed);
    runner.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    runnerRef.current?.pause();
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    runnerRef.current?.stepForward();
  };

  const handleStepBackward = () => {
    runnerRef.current?.stepBackward();
  };

  const handleReset = () => {
    runnerRef.current?.reset();
    setIsPlaying(false);
    setHighlightedLines([]);
    updateGraphState({
      nodes: graphState.originalNodes,
      edges: graphState.originalEdges,
      visitedNodes: [],
      currentNode: null,
      currentEdge: null,
      path: [],
      message: 'Ready to start',
      comparisons: 0,
      operations: 0,
    });
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    runnerRef.current?.setSpeed(newSpeed);
  };

  useEffect(() => {
    const runner = runnerRef.current;
    if (runner) {
      setCanStepForward(runner.currentStep < runner.totalSteps - 1);
      setCanStepBackward(runner.currentStep > 0);
    } else {
      setCanStepForward(false);
      setCanStepBackward(false);
    }
  });

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDraggedNode(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || !draggedNode || !svgRef.current) return;

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    const updatedNodes = graphState.nodes.map(node =>
      node.id === draggedNode
        ? { ...node, x: svgP.x, y: svgP.y }
        : node
    );

    setGraphNodes(updatedNodes);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  const getNodeColor = (nodeId: string): string => {
    if (graphState.currentNode === nodeId) return '#ef4444';
    if (graphState.path.includes(nodeId)) return '#22c55e';
    if (graphState.visitedNodes.includes(nodeId)) return '#3b82f6';
    return '#6b7280';
  };

  const getEdgeColor = (edge: GraphEdge): string => {
    if (graphState.currentEdge && 
        ((graphState.currentEdge[0] === edge.from && graphState.currentEdge[1] === edge.to) ||
         (graphState.currentEdge[0] === edge.to && graphState.currentEdge[1] === edge.from))) {
      return '#ef4444';
    }
    
    const isInPath = graphState.path.length > 1 && graphState.path.some((nodeId, idx) => {
      if (idx === graphState.path.length - 1) return false;
      const nextNode = graphState.path[idx + 1];
      return (nodeId === edge.from && nextNode === edge.to) ||
             (nodeId === edge.to && nextNode === edge.from);
    });
    
    if (isInPath) return '#22c55e';
    return '#4b5563';
  };

  const getEdgeWidth = (edge: GraphEdge): number => {
    if (graphState.currentEdge && 
        ((graphState.currentEdge[0] === edge.from && graphState.currentEdge[1] === edge.to) ||
         (graphState.currentEdge[0] === edge.to && graphState.currentEdge[1] === edge.from))) {
      return 3;
    }
    
    const isInPath = graphState.path.length > 1 && graphState.path.some((nodeId, idx) => {
      if (idx === graphState.path.length - 1) return false;
      const nextNode = graphState.path[idx + 1];
      return (nodeId === edge.from && nextNode === edge.to) ||
             (nodeId === edge.to && nextNode === edge.from);
    });
    
    return isInPath ? 3 : 2;
  };

  const handleSaveGraph = (nodes: GraphNode[], edges: GraphEdge[]) => {
    setGraphNodes(nodes);
    setGraphEdges(edges);
    if (nodes.length > 0) {
      setStartNode(nodes[0].id);
      setEndNode(nodes[nodes.length - 1]?.id || nodes[0].id);
    }
  };

  return (
    <div className="h-full flex bg-[#020617] overflow-hidden">
      {/* Main visualization area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${showCodePanel ? 'mr-0' : 'mr-0'}`}>
        {/* Header */}
        {algorithmInfo && (
          <div className="flex-shrink-0 bg-[#0f172a] px-5 py-4 border-b border-[#1e293b]">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-white">{algorithmInfo.name}</h2>
                <p className="text-slate-400 text-sm mt-1">{algorithmInfo.description}</p>
                <div className="flex gap-4 text-sm mt-2">
                  <span className="text-slate-500">
                    Time: <span className="text-blue-400 font-mono">{algorithmInfo.timeComplexity.average}</span>
                  </span>
                  <span className="text-slate-500">
                    Space: <span className="text-purple-400 font-mono">{algorithmInfo.spaceComplexity}</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-slate-500 text-xs">Operations</div>
                  <div className="text-2xl font-bold text-white">{graphState.operations || 0}</div>
                </div>
                <button
                  onClick={() => setShowCodePanel(!showCodePanel)}
                  className={`p-2 rounded-lg transition-colors ${
                    showCodePanel ? 'bg-[#3b82f6] text-white' : 'bg-[#1e293b] text-slate-400 hover:text-white'
                  }`}
                  title={showCodePanel ? 'Hide code' : 'Show code'}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Controls bar */}
        <div className="flex-shrink-0 bg-[#0f172a] px-4 py-3 border-b border-[#1e293b] flex gap-3 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium">Start:</label>
            <select
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              className="bg-[#1e293b] text-white px-3 py-1.5 rounded-lg text-sm border border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            >
              {graphState.nodes.map(node => (
                <option key={node.id} value={node.id}>{node.label}</option>
              ))}
            </select>
          </div>

          {selectedAlgorithm && ['dijkstra', 'astar'].includes(selectedAlgorithm) && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 font-medium">End:</label>
              <select
                value={endNode}
                onChange={(e) => setEndNode(e.target.value)}
                className="bg-[#1e293b] text-white px-3 py-1.5 rounded-lg text-sm border border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              >
                {graphState.nodes.map(node => (
                  <option key={node.id} value={node.id}>{node.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex-1"></div>

          <button
            onClick={() => setIsEditorOpen(true)}
            className="px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] text-white text-sm rounded-lg transition-colors border border-[#334155]"
          >
            ✏️ Edit Graph
          </button>

          <button
            onClick={generateRandomGraph}
            className="px-3 py-1.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm rounded-lg transition-colors"
          >
            🎲 Random
          </button>
        </div>

        {/* Graph visualization */}
        <div ref={containerRef} className="flex-1 relative bg-[#0f172a] min-h-0">
          <svg
            ref={svgRef}
            className="w-full h-full"
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Edges */}
            <g>
              {graphState.edges.map((edge, idx) => {
                const fromNode = graphState.nodes.find(n => n.id === edge.from);
                const toNode = graphState.nodes.find(n => n.id === edge.to);
                
                if (!fromNode || !toNode) return null;

                const color = getEdgeColor(edge);
                const width = getEdgeWidth(edge);
                const midX = (fromNode.x + toNode.x) / 2;
                const midY = (fromNode.y + toNode.y) / 2;

                return (
                  <g key={`edge-${idx}`}>
                    <motion.line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={color}
                      strokeWidth={width}
                      initial={{ pathLength: 0 }}
                      animate={{ 
                        pathLength: 1,
                        stroke: color,
                        strokeWidth: width,
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    {edge.weight !== undefined && 
                     selectedAlgorithm && 
                     ['dijkstra', 'astar', 'prim', 'kruskal'].includes(selectedAlgorithm) && (
                      <g>
                        <circle
                          cx={midX}
                          cy={midY}
                          r="15"
                          fill="#1f2937"
                          stroke={color}
                          strokeWidth="2"
                        />
                        <text
                          x={midX}
                          y={midY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-bold fill-white pointer-events-none"
                        >
                          {edge.weight}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Nodes */}
            <g>
              {graphState.nodes.map((node) => {
                const color = getNodeColor(node.id);
                const isStart = node.id === startNode;
                const isEnd = node.id === endNode;

                return (
                  <g
                    key={node.id}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    onMouseDown={(e) => handleMouseDown(node.id, e)}
                  >
                    {(isStart || isEnd) && (
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r="30"
                        fill="none"
                        stroke={isStart ? '#10b981' : '#f59e0b'}
                        strokeWidth="3"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r="25"
                      fill={color}
                      stroke="#1f2937"
                      strokeWidth="3"
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: 1,
                        fill: color,
                      }}
                      transition={{ 
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                      }}
                    />

                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-sm font-bold fill-white pointer-events-none"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Status message */}
          {graphState.message && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#1e293b]/95 backdrop-blur-sm px-4 py-2 rounded-lg border border-[#334155]">
              <p className="text-white text-sm">{graphState.message}</p>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-[#1e293b]/95 backdrop-blur-sm p-3 rounded-lg border border-[#334155]">
            <div className="text-white text-xs font-semibold mb-2">Legend</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-slate-400">Unvisited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-slate-400">Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-slate-400">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-slate-400">Path</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-shrink-0">
          <ControlsPanel
            isPlaying={isPlaying}
            canStepForward={canStepForward}
            canStepBackward={canStepBackward}
            speed={speed}
            onPlay={handlePlay}
            onPause={handlePause}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            onReset={handleReset}
            onGenerateNew={generateRandomGraph}
            onSpeedChange={handleSpeedChange}
          />
        </div>
      </div>

      {/* Code Panel */}
      {showCodePanel && algorithmCode && (
        <div className="w-[450px] flex-shrink-0">
          <CodeViewer
            code={algorithmCode.code}
            highlightedLines={highlightedLines}
            language={algorithmCode.language}
            title={algorithmInfo?.name || 'Algorithm'}
          />
        </div>
      )}

      {/* Graph Editor Modal */}
      <GraphEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveGraph}
        initialNodes={graphState.nodes}
        initialEdges={graphState.edges}
      />
    </div>
  );
};
