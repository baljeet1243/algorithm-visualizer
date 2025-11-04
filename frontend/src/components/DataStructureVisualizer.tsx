/**
 * DataStructureVisualizer Component
 * Displays data structures with C++ code execution
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appState';
import { CodeViewer } from './CodeViewer';
import { getDataStructureCode } from '../utils/dataStructureCode';

interface DSNode {
  id: string;
  value: number;
  x: number;
  y: number;
  left?: string;
  right?: string;
  next?: string;
}

export const DataStructureVisualizer: React.FC = () => {
  const { selectedAlgorithm } = useAppStore();
  const [nodes, setNodes] = useState<DSNode[]>([]);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [currentOperation, setCurrentOperation] = useState<string>('');
  const [showCodePanel, setShowCodePanel] = useState(true);
  const [inputValue, setInputValue] = useState<string>('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const dsCode = selectedAlgorithm ? getDataStructureCode(selectedAlgorithm) : null;

  // Initialize empty structure
  useEffect(() => {
    setNodes([]);
    setCurrentOperation('Ready');
  }, [selectedAlgorithm]);

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    setHighlightedLines([3, 4, 5]); // Insert function lines
    setCurrentOperation(`Inserting ${value}`);

    if (selectedAlgorithm === 'stack') {
      const newNode: DSNode = {
        id: Date.now().toString(),
        value,
        x: 300,
        y: 100 + nodes.length * 60,
      };
      setNodes([newNode, ...nodes]);
    } else if (selectedAlgorithm === 'queue') {
      const newNode: DSNode = {
        id: Date.now().toString(),
        value,
        x: 100 + nodes.length * 80,
        y: 250,
      };
      setNodes([...nodes, newNode]);
    } else if (selectedAlgorithm === 'linked-list') {
      const newNode: DSNode = {
        id: Date.now().toString(),
        value,
        x: 100 + nodes.length * 100,
        y: 250,
      };
      if (nodes.length > 0) {
        const updatedNodes = [...nodes];
        updatedNodes[updatedNodes.length - 1].next = newNode.id;
        setNodes([...updatedNodes, newNode]);
      } else {
        setNodes([newNode]);
      }
    } else if (selectedAlgorithm === 'bst') {
      if (nodes.length === 0) {
        setNodes([{ id: '0', value, x: 300, y: 100 }]);
      } else {
        insertBST(value);
      }
    }

    setInputValue('');
    setTimeout(() => setHighlightedLines([]), 1000);
  };

  const insertBST = (value: number) => {
    const newNodes = [...nodes];
    let currentId = '0';
    let depth = 1;

    while (true) {
      const current = newNodes.find(n => n.id === currentId);
      if (!current) break;

      if (value < current.value) {
        if (current.left) {
          currentId = current.left;
          depth++;
        } else {
          const newId = Date.now().toString();
          current.left = newId;
          newNodes.push({
            id: newId,
            value,
            x: current.x - (150 / depth),
            y: current.y + 80,
          });
          break;
        }
      } else {
        if (current.right) {
          currentId = current.right;
          depth++;
        } else {
          const newId = Date.now().toString();
          current.right = newId;
          newNodes.push({
            id: newId,
            value,
            x: current.x + (150 / depth),
            y: current.y + 80,
          });
          break;
        }
      }
    }

    setNodes(newNodes);
  };

  const countLeftNodes = (nodeId: string, nodeList: DSNode[]): number => {
    const node = nodeList.find(n => n.id === nodeId);
    if (!node) return 0;
    let count = 0;
    if (node.left) count += 1 + countLeftNodes(node.left, nodeList);
    return count;
  };

  const handleDelete = () => {
    setHighlightedLines([10, 11, 12]); // Delete function lines
    
    if (selectedAlgorithm === 'stack' && nodes.length > 0) {
      setCurrentOperation(`Popping ${nodes[0].value}`);
      setNodes(nodes.slice(1));
    } else if (selectedAlgorithm === 'queue' && nodes.length > 0) {
      setCurrentOperation(`Dequeuing ${nodes[0].value}`);
      setNodes(nodes.slice(1));
    } else if (selectedAlgorithm === 'linked-list' && nodes.length > 0) {
      setCurrentOperation(`Removing head ${nodes[0].value}`);
      setNodes(nodes.slice(1));
    }

    setTimeout(() => setHighlightedLines([]), 1000);
  };

  const handleClear = () => {
    setNodes([]);
    setCurrentOperation('Cleared');
    setHighlightedLines([]);
  };

  const getStructureName = (): string => {
    const names: Record<string, string> = {
      'stack': 'Stack',
      'queue': 'Queue',
      'linked-list': 'Linked List',
      'bst': 'Binary Search Tree',
      'heap': 'Heap',
    };
    return names[selectedAlgorithm || ''] || 'Data Structure';
  };

  return (
    <div className="h-full flex bg-[#020617] overflow-hidden">
      {/* Main visualization area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 bg-[#0f172a] px-5 py-4 border-b border-[#1e293b]">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-white">{getStructureName()}</h2>
              <p className="text-slate-400 text-sm mt-1">
                Interactive C++ Implementation
              </p>
              <div className="flex gap-4 text-sm mt-2">
                <span className="text-slate-500">
                  Size: <span className="text-blue-400 font-mono">{nodes.length}</span>
                </span>
                <span className="text-slate-500">
                  Operation: <span className="text-green-400 font-mono">{currentOperation}</span>
                </span>
              </div>
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

        {/* Controls bar */}
        <div className="flex-shrink-0 bg-[#0f172a] px-4 py-3 border-b border-[#1e293b] flex gap-3 items-center flex-wrap">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            className="bg-[#1e293b] text-white px-3 py-1.5 rounded-lg text-sm border border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] w-32"
            onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
          />
          <button
            onClick={handleInsert}
            className="px-3 py-1.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm rounded-lg transition-colors"
          >
            ➕ Insert
          </button>
          <button
            onClick={handleDelete}
            disabled={nodes.length === 0}
            className="px-3 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] disabled:bg-[#1e293b] disabled:text-slate-600 text-white text-sm rounded-lg transition-colors"
          >
            ➖ Delete
          </button>
          <button
            onClick={handleClear}
            disabled={nodes.length === 0}
            className="px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] disabled:bg-[#1e293b] disabled:text-slate-600 text-white text-sm rounded-lg transition-colors border border-[#334155]"
          >
            🗑️ Clear
          </button>
        </div>

        {/* Visualization area */}
        <div ref={containerRef} className="flex-1 relative bg-[#0f172a] overflow-auto min-h-0">
          <svg className="w-full h-full min-h-[600px]" viewBox="0 0 600 600">
            {/* Render connections */}
            {selectedAlgorithm === 'linked-list' && nodes.map((node, idx) => {
              if (idx < nodes.length - 1) {
                const nextNode = nodes[idx + 1];
                return (
                  <motion.line
                    key={`link-${node.id}`}
                    x1={node.x + 30}
                    y1={node.y}
                    x2={nextNode.x - 30}
                    y2={nextNode.y}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                );
              }
              return null;
            })}

            {/* BST connections */}
            {selectedAlgorithm === 'bst' && nodes.map(node => (
              <g key={`bst-edges-${node.id}`}>
                {node.left && (() => {
                  const leftNode = nodes.find(n => n.id === node.left);
                  if (!leftNode) return null;
                  return (
                    <line
                      x1={node.x}
                      y1={node.y + 25}
                      x2={leftNode.x}
                      y2={leftNode.y - 25}
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                  );
                })()}
                {node.right && (() => {
                  const rightNode = nodes.find(n => n.id === node.right);
                  if (!rightNode) return null;
                  return (
                    <line
                      x1={node.x}
                      y1={node.y + 25}
                      x2={rightNode.x}
                      y2={rightNode.y - 25}
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                  );
                })()}
              </g>
            ))}

            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
              </marker>
            </defs>

            {/* Render nodes */}
            <AnimatePresence>
              {nodes.map((node, idx) => (
                <motion.g
                  key={node.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, x: node.x, y: node.y }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <circle
                    cx={0}
                    cy={0}
                    r="25"
                    fill="#3b82f6"
                    stroke="#1e293b"
                    strokeWidth="3"
                  />
                  <text
                    x={0}
                    y={0}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-sm font-bold fill-white pointer-events-none"
                  >
                    {node.value}
                  </text>
                  {selectedAlgorithm === 'stack' && (
                    <text
                      x={50}
                      y={0}
                      textAnchor="start"
                      dominantBaseline="middle"
                      className="text-xs fill-slate-400"
                    >
                      {idx === 0 ? '← Top' : ''}
                    </text>
                  )}
                  {selectedAlgorithm === 'queue' && idx === 0 && (
                    <text
                      x={0}
                      y={-40}
                      textAnchor="middle"
                      className="text-xs fill-slate-400"
                    >
                      Front
                    </text>
                  )}
                  {selectedAlgorithm === 'queue' && idx === nodes.length - 1 && (
                    <text
                      x={0}
                      y={40}
                      textAnchor="middle"
                      className="text-xs fill-slate-400"
                    >
                      Rear
                    </text>
                  )}
                </motion.g>
              ))}
            </AnimatePresence>
          </svg>

          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-slate-400 text-lg">Empty {getStructureName()}</p>
                <p className="text-slate-500 text-sm mt-2">Insert values to begin</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Code Panel */}
      {showCodePanel && dsCode && (
        <div className="w-[450px] flex-shrink-0">
          <CodeViewer
            code={dsCode.code}
            highlightedLines={highlightedLines}
            language={dsCode.language}
            title={getStructureName()}
          />
        </div>
      )}
    </div>
  );
};

export default DataStructureVisualizer;
