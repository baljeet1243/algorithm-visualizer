/**
 * KRUSKAL'S ALGORITHM (Minimum Spanning Tree)
 * Time Complexity: O(E log E) or O(E log V)
 * Space Complexity: O(V)
 * 
 * Builds MST by sorting edges and adding them if they don't create a cycle.
 * Uses Union-Find data structure for cycle detection.
 */

import { AlgorithmStep, GraphNode, GraphEdge } from '../../types';

class UnionFind {
  private parent: Map<string, string>;
  private rank: Map<string, number>;

  constructor(nodes: GraphNode[]) {
    this.parent = new Map();
    this.rank = new Map();
    
    nodes.forEach(node => {
      this.parent.set(node.id, node.id);
      this.rank.set(node.id, 0);
    });
  }

  find(x: string): string {
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)!));
    }
    return this.parent.get(x)!;
  }

  union(x: string, y: string): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    const rankX = this.rank.get(rootX)!;
    const rankY = this.rank.get(rootY)!;

    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }

    return true;
  }

  getComponents(): Map<string, string[]> {
    const components = new Map<string, string[]>();
    
    this.parent.forEach((_, node) => {
      const root = this.find(node);
      if (!components.has(root)) {
        components.set(root, []);
      }
      components.get(root)!.push(node);
    });

    return components;
  }
}

export function* kruskal(
  nodes: GraphNode[],
  edges: GraphEdge[]
): Generator<AlgorithmStep, void, unknown> {
  const mstEdges: GraphEdge[] = [];
  const uf = new UnionFind(nodes);
  let totalCost = 0;
  let step = 0;

  // Initial state
  yield {
    nodes: nodes.map(n => ({ ...n })),
    edges: edges.map(e => ({ ...e })),
    visitedNodes: [],
    message: `Starting Kruskal's algorithm. Sorting ${edges.length} edges by weight...`,
    step: step++,
  };

  // Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => (a.weight || 1) - (b.weight || 1));

  yield {
    nodes: nodes.map(n => ({ ...n })),
    edges: edges.map(e => ({ ...e })),
    visitedNodes: [],
    message: `Edges sorted. Processing edges in order of increasing weight...`,
    step: step++,
  };

  // Process each edge
  for (let i = 0; i < sortedEdges.length; i++) {
    const edge = sortedEdges[i];
    const weight = edge.weight || 1;

    // Show current edge being considered
    yield {
      nodes: nodes.map(n => ({ 
        ...n,
        active: n.id === edge.from || n.id === edge.to
      })),
      edges: edges.map(e => ({ 
        ...e,
        inMST: mstEdges.some(mst => 
          (mst.from === e.from && mst.to === e.to) ||
          (mst.from === e.to && mst.to === e.from)
        ),
        active: (e.from === edge.from && e.to === edge.to) ||
                (e.from === edge.to && e.to === edge.from)
      })),
      visitedNodes: [],
      activeEdge: [edge.from, edge.to] as [string, string],
      message: `Considering edge ${edge.from} → ${edge.to} (weight: ${weight})`,
      step: step++,
    };

    // Check if adding this edge creates a cycle
    const fromRoot = uf.find(edge.from);
    const toRoot = uf.find(edge.to);

    if (fromRoot !== toRoot) {
      // No cycle - add to MST
      uf.union(edge.from, edge.to);
      mstEdges.push({ ...edge, inMST: true });
      totalCost += weight;

      yield {
        nodes: nodes.map(n => ({ 
          ...n,
          active: n.id === edge.from || n.id === edge.to
        })),
        edges: edges.map(e => ({ 
          ...e,
          inMST: mstEdges.some(mst => 
            (mst.from === e.from && mst.to === e.to) ||
            (mst.from === e.to && mst.to === e.from)
          )
        })),
        visitedNodes: [],
        message: `Added edge ${edge.from} → ${edge.to} to MST. Total cost: ${totalCost}, Edges: ${mstEdges.length}/${nodes.length - 1}`,
        step: step++,
      };

      // Show current components
      const components = uf.getComponents();
      const componentMsg = Array.from(components.values())
        .map(comp => `{${comp.join(', ')}}`)
        .join(' ');

      yield {
        nodes: nodes.map(n => ({ ...n })),
        edges: edges.map(e => ({ 
          ...e,
          inMST: mstEdges.some(mst => 
            (mst.from === e.from && mst.to === e.to) ||
            (mst.from === e.to && mst.to === e.from)
          )
        })),
        visitedNodes: [],
        message: `Current components: ${componentMsg}`,
        step: step++,
      };

      // Check if MST is complete
      if (mstEdges.length === nodes.length - 1) {
        break;
      }
    } else {
      // Would create cycle - skip
      yield {
        nodes: nodes.map(n => ({ ...n })),
        edges: edges.map(e => ({ 
          ...e,
          inMST: mstEdges.some(mst => 
            (mst.from === e.from && mst.to === e.to) ||
            (mst.from === e.to && mst.to === e.from)
          ),
          active: (e.from === edge.from && e.to === edge.to) ||
                  (e.from === edge.to && e.to === edge.from)
        })),
        visitedNodes: [],
        message: `Edge ${edge.from} → ${edge.to} would create cycle. Skipping...`,
        step: step++,
      };
    }
  }

  // Final state
  yield {
    nodes: nodes.map(n => ({ 
      ...n,
      active: false
    })),
    edges: edges.map(e => ({ 
      ...e,
      inMST: mstEdges.some(mst => 
        (mst.from === e.from && mst.to === e.to) ||
        (mst.from === e.to && mst.to === e.from)
      )
    })),
    visitedNodes: [],
    message: `Kruskal's algorithm complete! MST total cost: ${totalCost}, Edges: ${mstEdges.length}`,
    step: step++,
  };
}

export const kruskalInfo = {
  id: 'kruskal',
  name: "Kruskal's Algorithm",
  category: 'graph' as const,
  description: 'Builds Minimum Spanning Tree by sorting edges and adding them if they don\'t create a cycle. Uses Union-Find.',
  timeComplexity: {
    best: 'O(E log E)',
    average: 'O(E log E)',
    worst: 'O(E log E)',
  },
  spaceComplexity: 'O(V)',
};
