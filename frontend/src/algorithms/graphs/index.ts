/**
 * Graph Algorithms Index
 * Exports all graph algorithms and their metadata
 */

export { bfs, bfsInfo } from './bfs';
export { dfs, dfsInfo } from './dfs';
export { dijkstra, dijkstraInfo } from './dijkstra';
export { aStar, aStarInfo } from './aStar';
export { prim, primInfo } from './prim';
export { kruskal, kruskalInfo } from './kruskal';

import { bfsInfo } from './bfs';
import { dfsInfo } from './dfs';
import { dijkstraInfo } from './dijkstra';
import { aStarInfo } from './aStar';
import { primInfo } from './prim';
import { kruskalInfo } from './kruskal';

export const graphAlgorithms = [
  bfsInfo,
  dfsInfo,
  dijkstraInfo,
  aStarInfo,
  primInfo,
  kruskalInfo,
];
