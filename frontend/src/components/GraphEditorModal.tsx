/**
 * GraphEditorModal Component
 * Modal for manual graph creation and editing
 */

import { useState } from 'react';
import { GraphNode, GraphEdge } from '../types';

interface GraphEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nodes: GraphNode[], edges: GraphEdge[]) => void;
  initialNodes?: GraphNode[];
  initialEdges?: GraphEdge[];
}

export const GraphEditorModal: React.FC<GraphEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialNodes = [],
  initialEdges = [],
}) => {
  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [edges, setEdges] = useState<GraphEdge[]>(initialEdges);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [edgeFrom, setEdgeFrom] = useState('');
  const [edgeTo, setEdgeTo] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('1');

  if (!isOpen) return null;

  const handleAddNode = () => {
    if (!newNodeLabel.trim()) return;

    const id = nodes.length.toString();
    const newNode: GraphNode = {
      id,
      label: newNodeLabel,
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 200,
    };

    setNodes([...nodes, newNode]);
    setNewNodeLabel('');
  };

  const handleAddEdge = () => {
    if (!edgeFrom || !edgeTo || edgeFrom === edgeTo) return;

    // Check if edge already exists
    const exists = edges.some(
      e => (e.from === edgeFrom && e.to === edgeTo) || (e.from === edgeTo && e.to === edgeFrom)
    );

    if (exists) return;

    const newEdge: GraphEdge = {
      from: edgeFrom,
      to: edgeTo,
      weight: parseInt(edgeWeight) || 1,
    };

    setEdges([...edges, newEdge]);
    setEdgeFrom('');
    setEdgeTo('');
    setEdgeWeight('1');
  };

  const handleDeleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    setEdges(edges.filter(e => e.from !== id && e.to !== id));
  };

  const handleDeleteEdge = (index: number) => {
    setEdges(edges.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(nodes, edges);
    onClose();
  };

  const loadPreset = (preset: string) => {
    const centerX = 400;
    const centerY = 300;

    if (preset === 'complete') {
      // Complete graph with 5 nodes
      const presetNodes: GraphNode[] = Array.from({ length: 5 }, (_, i) => {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        return {
          id: String(i),
          label: String(i),
          x: centerX + 150 * Math.cos(angle),
          y: centerY + 150 * Math.sin(angle),
        };
      });

      const presetEdges: GraphEdge[] = [];
      for (let i = 0; i < 5; i++) {
        for (let j = i + 1; j < 5; j++) {
          presetEdges.push({
            from: String(i),
            to: String(j),
            weight: Math.floor(Math.random() * 10) + 1,
          });
        }
      }

      setNodes(presetNodes);
      setEdges(presetEdges);
    } else if (preset === 'grid') {
      // 3x3 grid
      const presetNodes: GraphNode[] = [];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          presetNodes.push({
            id: String(row * 3 + col),
            label: String(row * 3 + col),
            x: 200 + col * 150,
            y: 150 + row * 150,
          });
        }
      }

      const presetEdges: GraphEdge[] = [];
      for (let i = 0; i < 9; i++) {
        // Horizontal edges
        if ((i + 1) % 3 !== 0) {
          presetEdges.push({ from: String(i), to: String(i + 1), weight: 1 });
        }
        // Vertical edges
        if (i < 6) {
          presetEdges.push({ from: String(i), to: String(i + 3), weight: 1 });
        }
      }

      setNodes(presetNodes);
      setEdges(presetEdges);
    } else if (preset === 'tree') {
      // Binary tree
      const presetNodes: GraphNode[] = [
        { id: '0', label: '0', x: 400, y: 100 },
        { id: '1', label: '1', x: 250, y: 200 },
        { id: '2', label: '2', x: 550, y: 200 },
        { id: '3', label: '3', x: 150, y: 300 },
        { id: '4', label: '4', x: 350, y: 300 },
        { id: '5', label: '5', x: 450, y: 300 },
        { id: '6', label: '6', x: 650, y: 300 },
      ];

      const presetEdges: GraphEdge[] = [
        { from: '0', to: '1', weight: 1 },
        { from: '0', to: '2', weight: 1 },
        { from: '1', to: '3', weight: 2 },
        { from: '1', to: '4', weight: 3 },
        { from: '2', to: '5', weight: 4 },
        { from: '2', to: '6', weight: 5 },
      ];

      setNodes(presetNodes);
      setEdges(presetEdges);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1e293b] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Graph Editor</h2>
            <p className="text-sm text-slate-400 mt-1">Create or modify your graph</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1e293b] rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Add Elements */}
            <div className="space-y-6">
              {/* Presets */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Quick Presets</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => loadPreset('complete')}
                    className="px-3 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-sm rounded-lg transition-colors"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => loadPreset('grid')}
                    className="px-3 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-sm rounded-lg transition-colors"
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => loadPreset('tree')}
                    className="px-3 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-sm rounded-lg transition-colors"
                  >
                    Tree
                  </button>
                </div>
              </div>

              {/* Add Node */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Add Node</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNodeLabel}
                    onChange={(e) => setNewNodeLabel(e.target.value)}
                    placeholder="Node label"
                    className="flex-1 px-3 py-2 bg-[#1e293b] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNode()}
                  />
                  <button
                    onClick={handleAddNode}
                    className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Add Edge */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Add Edge</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={edgeFrom}
                      onChange={(e) => setEdgeFrom(e.target.value)}
                      className="px-3 py-2 bg-[#1e293b] border border-[#334155] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                    >
                      <option value="">From node</option>
                      {nodes.map(n => (
                        <option key={n.id} value={n.id}>{n.label}</option>
                      ))}
                    </select>
                    <select
                      value={edgeTo}
                      onChange={(e) => setEdgeTo(e.target.value)}
                      className="px-3 py-2 bg-[#1e293b] border border-[#334155] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                    >
                      <option value="">To node</option>
                      {nodes.map(n => (
                        <option key={n.id} value={n.id}>{n.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={edgeWeight}
                      onChange={(e) => setEdgeWeight(e.target.value)}
                      placeholder="Weight"
                      className="flex-1 px-3 py-2 bg-[#1e293b] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                      min="1"
                    />
                    <button
                      onClick={handleAddEdge}
                      className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg transition-colors"
                      disabled={!edgeFrom || !edgeTo}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Current Graph */}
            <div className="space-y-6">
              {/* Nodes List */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">
                  Nodes ({nodes.length})
                </h3>
                <div className="bg-[#1e293b] rounded-lg p-3 max-h-40 overflow-y-auto">
                  {nodes.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">No nodes yet</p>
                  ) : (
                    <div className="space-y-1">
                      {nodes.map(node => (
                        <div
                          key={node.id}
                          className="flex items-center justify-between px-3 py-2 bg-[#0f172a] rounded"
                        >
                          <span className="text-white text-sm">{node.label}</span>
                          <button
                            onClick={() => handleDeleteNode(node.id)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Edges List */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">
                  Edges ({edges.length})
                </h3>
                <div className="bg-[#1e293b] rounded-lg p-3 max-h-40 overflow-y-auto">
                  {edges.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">No edges yet</p>
                  ) : (
                    <div className="space-y-1">
                      {edges.map((edge, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-3 py-2 bg-[#0f172a] rounded"
                        >
                          <span className="text-white text-sm">
                            {nodes.find(n => n.id === edge.from)?.label} →{' '}
                            {nodes.find(n => n.id === edge.to)?.label}
                            {edge.weight && <span className="text-slate-400 ml-2">({edge.weight})</span>}
                          </span>
                          <button
                            onClick={() => handleDeleteEdge(index)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1e293b] flex items-center justify-between">
          <button
            onClick={() => {
              setNodes([]);
              setEdges([]);
            }}
            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
          >
            Clear All
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg transition-colors font-medium"
              disabled={nodes.length === 0}
            >
              Save Graph
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
