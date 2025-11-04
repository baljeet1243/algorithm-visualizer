/**
 * A* PATHFINDING ALGORITHM
 * Time Complexity: O(E log V) with priority queue
 * Space Complexity: O(V)
 * 
 * Finds shortest path using heuristic to guide search.
 * More efficient than Dijkstra when good heuristic available.
 */

import { AlgorithmStep, GraphNode, GraphEdge } from '../../types';
import { calculateDistance } from '../../utils/helpers';

interface AStarNode {
  id: string;
  g: number; // Cost from start
  h: number; // Heuristic to goal
  f: number; // g + h
}

export function* aStar(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startNodeId: string,
  endNodeId: string
): Generator<AlgorithmStep, void, unknown> {
  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const closedSet = new Set<string>();
  const openSet: AStarNode[] = [];
  let step = 0;

  // Find goal node for heuristic calculation
  const goalNode = nodes.find(n => n.id === endNodeId);
  if (!goalNode) {
    throw new Error(`End node ${endNodeId} not found`);
  }

  // Heuristic function (Euclidean distance)
  const heuristic = (nodeId: string): number => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return Infinity;
    return calculateDistance(node.x, node.y, goalNode.x, goalNode.y);
  };

  // Initialize scores
  nodes.forEach(node => {
    gScore[node.id] = Infinity;
    fScore[node.id] = Infinity;
    previous[node.id] = null;
  });

  gScore[startNodeId] = 0;
  fScore[startNodeId] = heuristic(startNodeId);
  openSet.push({
    id: startNodeId,
    g: 0,
    h: heuristic(startNodeId),
    f: heuristic(startNodeId)
  });

  // Initial state
  yield {
    nodes: nodes.map(n => ({ 
      ...n,
      heuristic: heuristic(n.id),
      fScore: fScore[n.id],
      active: n.id === startNodeId 
    })),
    edges: edges.map(e => ({ ...e })),
    visitedNodes: [],
    message: `Starting A* from ${startNodeId} to ${endNodeId}`,
    step: step++,
  };

  while (openSet.length > 0) {
    // Get node with lowest f score
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    const currentId = current.id;

    // Check if we reached the goal
    if (currentId === endNodeId) {
      // Reconstruct path
      const path: string[] = [];
      let curr: string | null = endNodeId;
      while (curr !== null) {
        path.unshift(curr);
        curr = previous[curr];
      }

      yield {
        nodes: nodes.map(n => ({ 
          ...n,
          visited: closedSet.has(n.id) || n.id === endNodeId,
          active: path.includes(n.id),
          heuristic: heuristic(n.id),
          fScore: fScore[n.id]
        })),
        edges: edges.map(e => ({ 
          ...e,
          active: path.includes(e.from) && path.includes(e.to) &&
                  path.indexOf(e.to) === path.indexOf(e.from) + 1
        })),
        visitedNodes: Array.from(closedSet),
        path,
        message: `Path found: ${path.join(' → ')} (cost: ${gScore[endNodeId].toFixed(2)})`,
        step: step++,
      };
      return;
    }

    closedSet.add(currentId);

    yield {
      nodes: nodes.map(n => ({ 
        ...n,
        visited: closedSet.has(n.id),
        active: n.id === currentId,
        heuristic: heuristic(n.id),
        fScore: fScore[n.id]
      })),
      edges: edges.map(e => ({ ...e })),
      visitedNodes: Array.from(closedSet),
      activeNode: currentId,
      message: `Exploring ${currentId} (g=${current.g.toFixed(2)}, h=${current.h.toFixed(2)}, f=${current.f.toFixed(2)})`,
      step: step++,
    };

    // Check all neighbors
    const neighborEdges = edges.filter(e => e.from === currentId);

    for (const edge of neighborEdges) {
      const neighborId = edge.to;

      if (closedSet.has(neighborId)) continue;

      const weight = edge.weight || 1;
      const tentativeG = gScore[currentId] + weight;

      // Show edge exploration
      yield {
        nodes: nodes.map(n => ({ 
          ...n,
          visited: closedSet.has(n.id),
          active: n.id === currentId || n.id === neighborId,
          heuristic: heuristic(n.id),
          fScore: fScore[n.id]
        })),
        edges: edges.map(e => ({ 
          ...e,
          active: e.from === currentId && e.to === neighborId
        })),
        visitedNodes: Array.from(closedSet),
        activeNode: currentId,
        activeEdge: [currentId, neighborId] as [string, string],
        message: `Checking ${currentId} → ${neighborId} (tentative g=${tentativeG.toFixed(2)})`,
        step: step++,
      };

      if (tentativeG < gScore[neighborId]) {
        previous[neighborId] = currentId;
        gScore[neighborId] = tentativeG;
        fScore[neighborId] = tentativeG + heuristic(neighborId);

        // Add to open set if not already there
        if (!openSet.find(n => n.id === neighborId)) {
          openSet.push({
            id: neighborId,
            g: tentativeG,
            h: heuristic(neighborId),
            f: fScore[neighborId]
          });
        }

        yield {
          nodes: nodes.map(n => ({ 
            ...n,
            visited: closedSet.has(n.id),
            active: n.id === neighborId,
            heuristic: heuristic(n.id),
            fScore: fScore[n.id]
          })),
          edges: edges.map(e => ({ 
            ...e,
            active: e.from === currentId && e.to === neighborId
          })),
          visitedNodes: Array.from(closedSet),
          activeNode: currentId,
          activeEdge: [currentId, neighborId] as [string, string],
          message: `Updated ${neighborId}: g=${tentativeG.toFixed(2)}, f=${fScore[neighborId].toFixed(2)}`,
          step: step++,
        };
      }
    }
  }

  // No path found
  yield {
    nodes: nodes.map(n => ({ 
      ...n,
      visited: closedSet.has(n.id),
      active: false
    })),
    edges: edges.map(e => ({ ...e })),
    visitedNodes: Array.from(closedSet),
    message: `No path found from ${startNodeId} to ${endNodeId}`,
    step: step++,
  };
}

export const aStarInfo = {
  id: 'a-star',
  name: 'A* Algorithm',
  category: 'graph' as const,
  description: 'Finds shortest path using heuristic to guide search. More efficient than Dijkstra when good heuristic available.',
  timeComplexity: {
    best: 'O(E)',
    average: 'O(E log V)',
    worst: 'O(E log V)',
  },
  spaceComplexity: 'O(V)',
};
