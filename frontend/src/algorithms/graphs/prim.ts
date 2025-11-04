/**
 * PRIM'S ALGORITHM (Minimum Spanning Tree)
 * Time Complexity: O(E log V) with priority queue
 * Space Complexity: O(V)
 * 
 * Builds MST by greedily selecting minimum weight edge from visited to unvisited vertices.
 */

import { AlgorithmStep, GraphNode, GraphEdge } from '../../types';

interface PrimEdge {
  from: string;
  to: string;
  weight: number;
}

export function* prim(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startNodeId?: string
): Generator<AlgorithmStep, void, unknown> {
  const visited = new Set<string>();
  const mstEdges: GraphEdge[] = [];
  const pq: PrimEdge[] = [];
  let totalCost = 0;
  let step = 0;

  const start = startNodeId || nodes[0].id;

  // Initial state
  yield {
    nodes: nodes.map(n => ({ ...n })),
    edges: edges.map(e => ({ ...e })),
    visitedNodes: [],
    message: `Starting Prim's algorithm from node ${start}`,
    step: step++,
  };

  // Add start node to visited
  visited.add(start);

  yield {
    nodes: nodes.map(n => ({ 
      ...n,
      visited: visited.has(n.id),
      active: n.id === start 
    })),
    edges: edges.map(e => ({ ...e })),
    visitedNodes: Array.from(visited),
    message: `Added ${start} to MST`,
    step: step++,
  };

  // Add all edges from start node to priority queue
  const startEdges = edges.filter(e => 
    (e.from === start && !visited.has(e.to)) ||
    (e.to === start && !visited.has(e.from))
  );

  for (const edge of startEdges) {
    const to = edge.from === start ? edge.to : edge.from;
    pq.push({
      from: start,
      to,
      weight: edge.weight || 1
    });
  }

  while (pq.length > 0 && visited.size < nodes.length) {
    // Sort by weight (min heap)
    pq.sort((a, b) => a.weight - b.weight);
    const minEdge = pq.shift()!;

    // Skip if destination already visited
    if (visited.has(minEdge.to)) {
      yield {
        nodes: nodes.map(n => ({ 
          ...n,
          visited: visited.has(n.id)
        })),
        edges: edges.map(e => ({ 
          ...e,
          inMST: mstEdges.some(mst => 
            (mst.from === e.from && mst.to === e.to) ||
            (mst.from === e.to && mst.to === e.from)
          ),
          active: (e.from === minEdge.from && e.to === minEdge.to) ||
                  (e.from === minEdge.to && e.to === minEdge.from)
        })),
        visitedNodes: Array.from(visited),
        message: `Edge ${minEdge.from} → ${minEdge.to} (${minEdge.weight}) skipped: ${minEdge.to} already in MST`,
        step: step++,
      };
      continue;
    }

    // Show edge being considered
    yield {
      nodes: nodes.map(n => ({ 
        ...n,
        visited: visited.has(n.id),
        active: n.id === minEdge.from || n.id === minEdge.to
      })),
      edges: edges.map(e => ({ 
        ...e,
        inMST: mstEdges.some(mst => 
          (mst.from === e.from && mst.to === e.to) ||
          (mst.from === e.to && mst.to === e.from)
        ),
        active: (e.from === minEdge.from && e.to === minEdge.to) ||
                (e.from === minEdge.to && e.to === minEdge.from)
      })),
      visitedNodes: Array.from(visited),
      activeEdge: [minEdge.from, minEdge.to] as [string, string],
      message: `Considering edge ${minEdge.from} → ${minEdge.to} (weight: ${minEdge.weight})`,
      step: step++,
    };

    // Add edge to MST
    const originalEdge = edges.find(e => 
      (e.from === minEdge.from && e.to === minEdge.to) ||
      (e.from === minEdge.to && e.to === minEdge.from)
    );
    if (originalEdge) {
      mstEdges.push({ ...originalEdge, inMST: true });
    }
    
    visited.add(minEdge.to);
    totalCost += minEdge.weight;

    yield {
      nodes: nodes.map(n => ({ 
        ...n,
        visited: visited.has(n.id),
        active: n.id === minEdge.to
      })),
      edges: edges.map(e => ({ 
        ...e,
        inMST: mstEdges.some(mst => 
          (mst.from === e.from && mst.to === e.to) ||
          (mst.from === e.to && mst.to === e.from)
        )
      })),
      visitedNodes: Array.from(visited),
      message: `Added edge ${minEdge.from} → ${minEdge.to} to MST. Total cost: ${totalCost}`,
      step: step++,
    };

    // Add new frontier edges to priority queue
    const newEdges = edges.filter(e => 
      (e.from === minEdge.to && !visited.has(e.to)) ||
      (e.to === minEdge.to && !visited.has(e.from))
    );

    for (const edge of newEdges) {
      const to = edge.from === minEdge.to ? edge.to : edge.from;
      if (!visited.has(to)) {
        pq.push({
          from: minEdge.to,
          to,
          weight: edge.weight || 1
        });
      }
    }
  }

  // Final state
  yield {
    nodes: nodes.map(n => ({ 
      ...n,
      visited: visited.has(n.id),
      active: false
    })),
    edges: edges.map(e => ({ 
      ...e,
      inMST: mstEdges.some(mst => 
        (mst.from === e.from && mst.to === e.to) ||
        (mst.from === e.to && mst.to === e.from)
      )
    })),
    visitedNodes: Array.from(visited),
    message: `Prim's algorithm complete! MST total cost: ${totalCost}, Edges: ${mstEdges.length}`,
    step: step++,
  };
}

export const primInfo = {
  id: 'prim',
  name: "Prim's Algorithm",
  category: 'graph' as const,
  description: 'Builds Minimum Spanning Tree by greedily selecting minimum weight edge from visited to unvisited vertices.',
  timeComplexity: {
    best: 'O(E log V)',
    average: 'O(E log V)',
    worst: 'O(E log V)',
  },
  spaceComplexity: 'O(V)',
};
