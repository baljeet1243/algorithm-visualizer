/**
 * DEPTH-FIRST SEARCH (DFS) ALGORITHM
 * Time Complexity: O(V + E) where V = vertices, E = edges
 * Space Complexity: O(V)
 * 
 * Explores as far as possible along each branch before backtracking.
 * Uses a stack (or recursion).
 */

import { AlgorithmStep, GraphNode, GraphEdge } from '../../types';

export function* dfs(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startNodeId: string
): Generator<AlgorithmStep, void, unknown> {
  const visited = new Set<string>();
  const stack: string[] = [startNodeId];
  const parent: Record<string, string | null> = {};
  let step = 0;

  // Initialize parent
  nodes.forEach(node => {
    parent[node.id] = null;
  });

  // Initial state
  yield {
    nodes: nodes.map(n => ({ ...n })),
    edges: edges.map(e => ({ ...e })),
    visitedNodes: [],
    activeNode: startNodeId,
    message: `Starting DFS from node ${startNodeId}`,
    step: step++,
  };

  // Add start node to stack
  yield {
    nodes: nodes.map(n => ({ 
      ...n, 
      active: n.id === startNodeId 
    })),
    edges: edges.map(e => ({ ...e })),
    visitedNodes: [],
    activeNode: startNodeId,
    message: `Pushed ${startNodeId} onto stack`,
    step: step++,
  };

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    
    if (visited.has(currentId)) {
      continue;
    }

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
      message: `Visiting node ${currentId}`,
      step: step++,
    };

    // Get unvisited neighbors
    const neighbors = edges
      .filter(e => e.from === currentId && !visited.has(e.to))
      .map(e => e.to)
      .reverse(); // Reverse to maintain left-to-right order when popping

    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        stack.push(neighborId);
        parent[neighborId] = currentId;

        // Show edge exploration
        yield {
          nodes: nodes.map(n => ({ 
            ...n, 
            visited: visited.has(n.id),
            active: n.id === currentId || n.id === neighborId
          })),
          edges: edges.map(e => ({ 
            ...e,
            active: e.from === currentId && e.to === neighborId
          })),
          visitedNodes: Array.from(visited),
          activeNode: currentId,
          activeEdge: [currentId, neighborId] as [string, string],
          message: `Exploring edge ${currentId} → ${neighborId}, pushing ${neighborId} onto stack`,
          step: step++,
        };
      }
    }

    // Show current stack state
    if (stack.length > 0) {
      yield {
        nodes: nodes.map(n => ({ 
          ...n, 
          visited: visited.has(n.id),
          active: stack.includes(n.id)
        })),
        edges: edges.map(e => ({ ...e })),
        visitedNodes: Array.from(visited),
        activeNode: null,
        message: `Stack: [${stack.join(', ')}]`,
        step: step++,
      };
    } else {
      // Check for backtracking
      yield {
        nodes: nodes.map(n => ({ 
          ...n, 
          visited: visited.has(n.id),
          active: false
        })),
        edges: edges.map(e => ({ ...e })),
        visitedNodes: Array.from(visited),
        activeNode: null,
        message: `Stack empty, backtracking...`,
        step: step++,
      };
    }
  }

  // Final state
  yield {
    nodes: nodes.map(n => ({ 
      ...n, 
      visited: visited.has(n.id),
      active: false
    })),
    edges: edges.map(e => ({ ...e })),
    visitedNodes: Array.from(visited),
    activeNode: null,
    message: `DFS complete! Visited ${visited.size} nodes`,
    step: step++,
  };
}

export const dfsInfo = {
  id: 'dfs',
  name: 'Depth-First Search',
  category: 'graph' as const,
  description: 'Explores as far as possible along each branch before backtracking. Uses a stack.',
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)',
  },
  spaceComplexity: 'O(V)',
};
