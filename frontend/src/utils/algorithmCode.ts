/**
 * Python code implementations for graph algorithms
 * Each algorithm includes line-by-line step mappings
 */

export interface CodeLine {
  line: number;
  code: string;
  indent: number;
}

export interface AlgorithmCode {
  algorithmId: string;
  language: string;
  code: CodeLine[];
  stepToLineMap: Record<string, number[]>; // Maps step type to line numbers
}

export const graphAlgorithmCodes: Record<string, AlgorithmCode> = {
  'bfs': {
    algorithmId: 'bfs',
    language: 'python',
    code: [
      { line: 1, code: 'def bfs(graph, start):', indent: 0 },
      { line: 2, code: '"""Breadth-First Search traversal"""', indent: 1 },
      { line: 3, code: 'visited = set()', indent: 1 },
      { line: 4, code: 'queue = [start]', indent: 1 },
      { line: 5, code: 'visited.add(start)', indent: 1 },
      { line: 6, code: '', indent: 0 },
      { line: 7, code: 'while queue:', indent: 1 },
      { line: 8, code: 'node = queue.pop(0)', indent: 2 },
      { line: 9, code: 'print(f"Visiting: {node}")', indent: 2 },
      { line: 10, code: '', indent: 0 },
      { line: 11, code: 'for neighbor in graph[node]:', indent: 2 },
      { line: 12, code: 'if neighbor not in visited:', indent: 3 },
      { line: 13, code: 'visited.add(neighbor)', indent: 4 },
      { line: 14, code: 'queue.append(neighbor)', indent: 4 },
      { line: 15, code: '', indent: 0 },
      { line: 16, code: 'return visited', indent: 1 },
    ],
    stepToLineMap: {
      'init': [3, 4, 5],
      'dequeue': [8],
      'visit': [9],
      'check_neighbor': [11, 12],
      'enqueue': [13, 14],
      'complete': [16],
    }
  },

  'dfs': {
    algorithmId: 'dfs',
    language: 'python',
    code: [
      { line: 1, code: 'def dfs(graph, start):', indent: 0 },
      { line: 2, code: '"""Depth-First Search traversal"""', indent: 1 },
      { line: 3, code: 'visited = set()', indent: 1 },
      { line: 4, code: 'stack = [start]', indent: 1 },
      { line: 5, code: '', indent: 0 },
      { line: 6, code: 'while stack:', indent: 1 },
      { line: 7, code: 'node = stack.pop()', indent: 2 },
      { line: 8, code: '', indent: 0 },
      { line: 9, code: 'if node not in visited:', indent: 2 },
      { line: 10, code: 'visited.add(node)', indent: 3 },
      { line: 11, code: 'print(f"Visiting: {node}")', indent: 3 },
      { line: 12, code: '', indent: 0 },
      { line: 13, code: 'for neighbor in graph[node]:', indent: 3 },
      { line: 14, code: 'if neighbor not in visited:', indent: 4 },
      { line: 15, code: 'stack.append(neighbor)', indent: 5 },
      { line: 16, code: '', indent: 0 },
      { line: 17, code: 'return visited', indent: 1 },
    ],
    stepToLineMap: {
      'init': [3, 4],
      'pop': [7],
      'visit': [10, 11],
      'check_neighbor': [13, 14],
      'push': [15],
      'complete': [17],
    }
  },

  'dijkstra': {
    algorithmId: 'dijkstra',
    language: 'python',
    code: [
      { line: 1, code: 'def dijkstra(graph, start, end):', indent: 0 },
      { line: 2, code: '"""Dijkstra\'s shortest path algorithm"""', indent: 1 },
      { line: 3, code: 'import heapq', indent: 1 },
      { line: 4, code: 'distances = {node: float(\'inf\') for node in graph}', indent: 1 },
      { line: 5, code: 'distances[start] = 0', indent: 1 },
      { line: 6, code: 'pq = [(0, start)]', indent: 1 },
      { line: 7, code: 'visited = set()', indent: 1 },
      { line: 8, code: '', indent: 0 },
      { line: 9, code: 'while pq:', indent: 1 },
      { line: 10, code: 'current_dist, current = heapq.heappop(pq)', indent: 2 },
      { line: 11, code: '', indent: 0 },
      { line: 12, code: 'if current in visited:', indent: 2 },
      { line: 13, code: 'continue', indent: 3 },
      { line: 14, code: 'visited.add(current)', indent: 2 },
      { line: 15, code: '', indent: 0 },
      { line: 16, code: 'if current == end:', indent: 2 },
      { line: 17, code: 'break', indent: 3 },
      { line: 18, code: '', indent: 0 },
      { line: 19, code: 'for neighbor, weight in graph[current]:', indent: 2 },
      { line: 20, code: 'distance = current_dist + weight', indent: 3 },
      { line: 21, code: '', indent: 0 },
      { line: 22, code: 'if distance < distances[neighbor]:', indent: 3 },
      { line: 23, code: 'distances[neighbor] = distance', indent: 4 },
      { line: 24, code: 'heapq.heappush(pq, (distance, neighbor))', indent: 4 },
      { line: 25, code: '', indent: 0 },
      { line: 26, code: 'return distances', indent: 1 },
    ],
    stepToLineMap: {
      'init': [4, 5, 6, 7],
      'extract_min': [10],
      'visit': [14],
      'check_end': [16, 17],
      'relax': [19, 20, 22, 23, 24],
      'complete': [26],
    }
  },

  'astar': {
    algorithmId: 'astar',
    language: 'python',
    code: [
      { line: 1, code: 'def astar(graph, start, goal, h):', indent: 0 },
      { line: 2, code: '"""A* pathfinding algorithm"""', indent: 1 },
      { line: 3, code: 'import heapq', indent: 1 },
      { line: 4, code: 'open_set = [(0, start)]', indent: 1 },
      { line: 5, code: 'came_from = {}', indent: 1 },
      { line: 6, code: 'g_score = {node: float(\'inf\') for node in graph}', indent: 1 },
      { line: 7, code: 'g_score[start] = 0', indent: 1 },
      { line: 8, code: 'f_score = {node: float(\'inf\') for node in graph}', indent: 1 },
      { line: 9, code: 'f_score[start] = h(start, goal)', indent: 1 },
      { line: 10, code: '', indent: 0 },
      { line: 11, code: 'while open_set:', indent: 1 },
      { line: 12, code: 'current = heapq.heappop(open_set)[1]', indent: 2 },
      { line: 13, code: '', indent: 0 },
      { line: 14, code: 'if current == goal:', indent: 2 },
      { line: 15, code: 'return reconstruct_path(came_from, current)', indent: 3 },
      { line: 16, code: '', indent: 0 },
      { line: 17, code: 'for neighbor, weight in graph[current]:', indent: 2 },
      { line: 18, code: 'tentative_g = g_score[current] + weight', indent: 3 },
      { line: 19, code: '', indent: 0 },
      { line: 20, code: 'if tentative_g < g_score[neighbor]:', indent: 3 },
      { line: 21, code: 'came_from[neighbor] = current', indent: 4 },
      { line: 22, code: 'g_score[neighbor] = tentative_g', indent: 4 },
      { line: 23, code: 'f_score[neighbor] = tentative_g + h(neighbor, goal)', indent: 4 },
      { line: 24, code: 'heapq.heappush(open_set, (f_score[neighbor], neighbor))', indent: 4 },
      { line: 25, code: '', indent: 0 },
      { line: 26, code: 'return None', indent: 1 },
    ],
    stepToLineMap: {
      'init': [4, 5, 6, 7, 8, 9],
      'starting': [4, 5, 6, 7, 8, 9],
      'extract_min': [11, 12],
      'exploring': [11, 12],
      'check_goal': [14, 15],
      'path_found': [14, 15],
      'checking': [17, 18],
      'check_edge': [17, 18],
      'tentative': [18, 20],
      'updated': [20, 21, 22, 23, 24],
      'update': [20, 21, 22, 23, 24],
      'complete': [26],
      'no_path': [26],
    }
  },

  'prim': {
    algorithmId: 'prim',
    language: 'python',
    code: [
      { line: 1, code: 'def prim(graph, start):', indent: 0 },
      { line: 2, code: '"""Prim\'s Minimum Spanning Tree"""', indent: 1 },
      { line: 3, code: 'import heapq', indent: 1 },
      { line: 4, code: 'mst = []', indent: 1 },
      { line: 5, code: 'visited = set([start])', indent: 1 },
      { line: 6, code: 'edges = [(weight, start, neighbor)', indent: 1 },
      { line: 7, code: '         for neighbor, weight in graph[start]]', indent: 1 },
      { line: 8, code: 'heapq.heapify(edges)', indent: 1 },
      { line: 9, code: '', indent: 0 },
      { line: 10, code: 'while edges and len(visited) < len(graph):', indent: 1 },
      { line: 11, code: 'weight, frm, to = heapq.heappop(edges)', indent: 2 },
      { line: 12, code: '', indent: 0 },
      { line: 13, code: 'if to in visited:', indent: 2 },
      { line: 14, code: 'continue', indent: 3 },
      { line: 15, code: '', indent: 0 },
      { line: 16, code: 'visited.add(to)', indent: 2 },
      { line: 17, code: 'mst.append((frm, to, weight))', indent: 2 },
      { line: 18, code: '', indent: 0 },
      { line: 19, code: 'for neighbor, w in graph[to]:', indent: 2 },
      { line: 20, code: 'if neighbor not in visited:', indent: 3 },
      { line: 21, code: 'heapq.heappush(edges, (w, to, neighbor))', indent: 4 },
      { line: 22, code: '', indent: 0 },
      { line: 23, code: 'return mst', indent: 1 },
    ],
    stepToLineMap: {
      'init': [4, 5, 6, 7, 8],
      'extract_min': [11],
      'add_to_mst': [16, 17],
      'add_edges': [19, 20, 21],
      'complete': [23],
    }
  },

  'kruskal': {
    algorithmId: 'kruskal',
    language: 'python',
    code: [
      { line: 1, code: 'def kruskal(graph):', indent: 0 },
      { line: 2, code: '"""Kruskal\'s Minimum Spanning Tree"""', indent: 1 },
      { line: 3, code: 'edges = []', indent: 1 },
      { line: 4, code: 'for node in graph:', indent: 1 },
      { line: 5, code: 'for neighbor, weight in graph[node]:', indent: 2 },
      { line: 6, code: 'edges.append((weight, node, neighbor))', indent: 3 },
      { line: 7, code: '', indent: 0 },
      { line: 8, code: 'edges.sort()', indent: 1 },
      { line: 9, code: 'parent = {node: node for node in graph}', indent: 1 },
      { line: 10, code: 'mst = []', indent: 1 },
      { line: 11, code: '', indent: 0 },
      { line: 12, code: 'def find(node):', indent: 1 },
      { line: 13, code: 'if parent[node] != node:', indent: 2 },
      { line: 14, code: 'parent[node] = find(parent[node])', indent: 3 },
      { line: 15, code: 'return parent[node]', indent: 2 },
      { line: 16, code: '', indent: 0 },
      { line: 17, code: 'for weight, u, v in edges:', indent: 1 },
      { line: 18, code: 'root_u = find(u)', indent: 2 },
      { line: 19, code: 'root_v = find(v)', indent: 2 },
      { line: 20, code: '', indent: 0 },
      { line: 21, code: 'if root_u != root_v:', indent: 2 },
      { line: 22, code: 'mst.append((u, v, weight))', indent: 3 },
      { line: 23, code: 'parent[root_u] = root_v', indent: 3 },
      { line: 24, code: '', indent: 0 },
      { line: 25, code: 'return mst', indent: 1 },
    ],
    stepToLineMap: {
      'init': [3, 4, 5, 6, 8, 9, 10],
      'check_edge': [17, 18, 19],
      'union': [21, 22, 23],
      'complete': [25],
    }
  },
};

export function getAlgorithmCode(algorithmId: string): AlgorithmCode | null {
  return graphAlgorithmCodes[algorithmId] || null;
}

export function getHighlightedLines(algorithmId: string, stepType: string): number[] {
  const code = graphAlgorithmCodes[algorithmId];
  if (!code) return [];
  return code.stepToLineMap[stepType] || [];
}
