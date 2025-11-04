/**
 * BREADTH-FIRST SEARCH (BFS) ALGORITHM
 * Time Complexity: O(V + E) where V = vertices, E = edges
 * Space Complexity: O(V)
 * 
 * Explores nodes level by level using a queue.
 * Useful for finding shortest path in unweighted graphs.
 */

import { AlgorithmStep, GraphNode, GraphEdge } from '../../types';

export function* bfs(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startNodeId: string
): Generator<AlgorithmStep, void, unknown> {
  const visited = new Set<string>();
  const queue: string[] = [startNodeId];
  const distances: Record<string, number> = {};
  const parent: Record<string, string | null> = {};
  let step = 0;

  // Initialize distances
  nodes.forEach(node => {
    distances[node.id] = Infinity;
    parent[node.id] = null;
  });
  distances[startNodeId] = 0;

  // Initial state
  yield {
    nodes: nodes.map(n => ({ ...n })),
    edges: edges.map(e => ({ ...e })),
    visitedNodes: [],
    activeNode: startNodeId,
    distances,
    message: `Starting BFS from node ${startNodeId}`,
    step: step++,
  };

  // Add start node to queue
  yield {
    nodes: nodes.map(n => ({ 
      ...n, 
      active: n.id === startNodeId 
    })),
    edges: edges.map(e => ({ ...e })),
    visitedNodes: [],
    activeNode: startNodeId,
    distances,
    message: `Added ${startNodeId} to queue`,
    step: step++,
  };

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    
    // Mark as visited
    visited.add(currentId);

    yield {
      nodes: nodes.map(n => ({ 
        ...n, 
        visited: visited.has(n.id),
        active: n.id === currentId 
      })),
      edges: edges.map(e => ({ ...e })),
      visitedNodes: Array.from(visited),
      activeNode: currentId,
      distances,
      message: `Visiting node ${currentId} (distance: ${distances[currentId]})`,
      step: step++,
    };

    // Get neighbors
    const neighbors = edges
      .filter(e => e.from === currentId && !visited.has(e.to))
      .map(e => e.to);

    for (const neighborId of neighbors) {
      if (!visited.has(neighborId) && !queue.includes(neighborId)) {
        queue.push(neighborId);
        distances[neighborId] = distances[currentId] + 1;
        parent[neighborId] = currentId;

        // Show edge exploration
        yield {
          nodes: nodes.map(n => ({ 
            ...n, 
            visited: visited.has(n.id),
            active: n.id === currentId || n.id === neighborId,
            distance: distances[n.id]
          })),
          edges: edges.map(e => ({ 
            ...e,
            active: e.from === currentId && e.to === neighborId
          })),
          visitedNodes: Array.from(visited),
          activeNode: currentId,
          activeEdge: [currentId, neighborId] as [string, string],
          distances,
          message: `Exploring edge ${currentId} → ${neighborId}, adding ${neighborId} to queue`,
          step: step++,
        };
      }
    }

    // Show current queue state
    yield {
      nodes: nodes.map(n => ({ 
        ...n, 
        visited: visited.has(n.id),
        active: queue.includes(n.id),
        distance: distances[n.id]
      })),
      edges: edges.map(e => ({ ...e })),
      visitedNodes: Array.from(visited),
      activeNode: null,
      distances,
      message: `Queue: [${queue.join(', ')}]`,
      step: step++,
    };
  }

  // Final state
  yield {
    nodes: nodes.map(n => ({ 
      ...n, 
      visited: visited.has(n.id),
      active: false,
      distance: distances[n.id]
    })),
    edges: edges.map(e => ({ ...e })),
    visitedNodes: Array.from(visited),
    activeNode: null,
    distances,
    message: `BFS complete! Visited ${visited.size} nodes`,
    step: step++,
  };
}

export const bfsInfo = {
  id: 'bfs',
  name: 'Breadth-First Search',
  category: 'graph' as const,
  description: 'Explores nodes level by level using a queue. Finds shortest path in unweighted graphs.',
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)',
  },
  spaceComplexity: 'O(V)',
};
