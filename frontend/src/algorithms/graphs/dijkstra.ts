/**
 * DIJKSTRA'S ALGORITHM
 * Time Complexity: O((V + E) log V) with priority queue
 * Space Complexity: O(V)
 * 
 * Finds shortest path from source to all other vertices in weighted graph.
 * Works only with non-negative edge weights.
 */

import { AlgorithmStep, GraphNode, GraphEdge } from '../../types';

interface PQNode {
  id: string;
  distance: number;
}

export function* dijkstra(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startNodeId: string,
  endNodeId?: string
): Generator<AlgorithmStep, void, unknown> {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();
  const pq: PQNode[] = [];
  let step = 0;

  // Initialize distances and previous
  nodes.forEach(node => {
    distances[node.id] = node.id === startNodeId ? 0 : Infinity;
    previous[node.id] = null;
  });

  pq.push({ id: startNodeId, distance: 0 });

  // Initial state
  yield {
    nodes: nodes.map(n => ({ 
      ...n, 
      distance: distances[n.id],
      active: n.id === startNodeId 
    })),
    edges: edges.map(e => ({ ...e })),
    visitedNodes: [],
    distances,
    message: `Starting Dijkstra's algorithm from node ${startNodeId}`,
    step: step++,
  };

  while (pq.length > 0) {
    // Sort priority queue by distance (min-heap behavior)
    pq.sort((a, b) => a.distance - b.distance);
    const { id: currentId, distance: currentDist } = pq.shift()!;

    // Skip if already visited
    if (visited.has(currentId)) continue;

    // Mark as visited
    visited.add(currentId);

    yield {
      nodes: nodes.map(n => ({ 
        ...n, 
        distance: distances[n.id],
        visited: visited.has(n.id),
        active: n.id === currentId 
      })),
      edges: edges.map(e => ({ ...e })),
      visitedNodes: Array.from(visited),
      activeNode: currentId,
      distances,
      message: `Visiting node ${currentId} with distance ${currentDist}`,
      step: step++,
    };

    // If we reached the end node, we can stop
    if (endNodeId && currentId === endNodeId) {
      break;
    }

    // Check all neighbors
    const neighborEdges = edges.filter(e => e.from === currentId);

    for (const edge of neighborEdges) {
      const neighborId = edge.to;
      const weight = edge.weight || 1;

      if (visited.has(neighborId)) continue;

      const newDist = currentDist + weight;

      // Show edge relaxation
      yield {
        nodes: nodes.map(n => ({ 
          ...n, 
          distance: distances[n.id],
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
        distances,
        message: `Checking edge ${currentId} → ${neighborId} (weight: ${weight})`,
        step: step++,
      };

      if (newDist < distances[neighborId]) {
        distances[neighborId] = newDist;
        previous[neighborId] = currentId;
        pq.push({ id: neighborId, distance: newDist });

        yield {
          nodes: nodes.map(n => ({ 
            ...n, 
            distance: distances[n.id],
            visited: visited.has(n.id),
            active: n.id === neighborId 
          })),
          edges: edges.map(e => ({ 
            ...e,
            active: e.from === currentId && e.to === neighborId
          })),
          visitedNodes: Array.from(visited),
          activeNode: currentId,
          activeEdge: [currentId, neighborId] as [string, string],
          distances,
          message: `Updated distance to ${neighborId}: ${newDist} (via ${currentId})`,
          step: step++,
        };
      } else {
        yield {
          nodes: nodes.map(n => ({ 
            ...n, 
            distance: distances[n.id],
            visited: visited.has(n.id)
          })),
          edges: edges.map(e => ({ ...e })),
          visitedNodes: Array.from(visited),
          distances,
          message: `No improvement for ${neighborId} (current: ${distances[neighborId]}, new: ${newDist})`,
          step: step++,
        };
      }
    }
  }

  // Reconstruct path if end node specified
  let path: string[] = [];
  if (endNodeId && distances[endNodeId] !== Infinity) {
    let current: string | null = endNodeId;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }

    yield {
      nodes: nodes.map(n => ({ 
        ...n, 
        distance: distances[n.id],
        visited: visited.has(n.id),
        active: path.includes(n.id)
      })),
      edges: edges.map(e => ({ 
        ...e,
        active: path.includes(e.from) && path.includes(e.to) &&
                path.indexOf(e.to) === path.indexOf(e.from) + 1
      })),
      visitedNodes: Array.from(visited),
      path,
      distances,
      message: `Shortest path from ${startNodeId} to ${endNodeId}: ${path.join(' → ')} (distance: ${distances[endNodeId]})`,
      step: step++,
    };
  } else {
    // Final state without specific path
    yield {
      nodes: nodes.map(n => ({ 
        ...n, 
        distance: distances[n.id],
        visited: visited.has(n.id),
        active: false
      })),
      edges: edges.map(e => ({ ...e })),
      visitedNodes: Array.from(visited),
      distances,
      message: `Dijkstra's algorithm complete! Shortest distances computed.`,
      step: step++,
    };
  }
}

export const dijkstraInfo = {
  id: 'dijkstra',
  name: "Dijkstra's Algorithm",
  category: 'graph' as const,
  description: 'Finds shortest path from source to all vertices in weighted graph with non-negative weights.',
  timeComplexity: {
    best: 'O((V + E) log V)',
    average: 'O((V + E) log V)',
    worst: 'O((V + E) log V)',
  },
  spaceComplexity: 'O(V)',
};
