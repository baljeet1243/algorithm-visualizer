// ============================================
// CORE ALGORITHM INTERFACES
// ============================================

/**
 * Base step returned by algorithm generators
 * Each algorithm yields these steps for visualization
 */
export interface AlgorithmStep {
  // For sorting algorithms
  array?: number[];
  highlight?: number[];
  sorted?: number[];
  comparing?: number[];
  swapping?: number[];
  
  // For graph algorithms
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  visitedNodes?: string[];
  activeNode?: string | null;
  activeEdge?: [string, string] | null;
  distances?: Record<string, number>;
  path?: string[];
  
  // For tree algorithms
  tree?: TreeNode | null;
  highlightNodes?: string[];
  traversalOrder?: string[];
  
  // For data structures
  structure?: any;
  operation?: string;
  
  // Common fields
  message?: string;
  comparisons?: number;
  swaps?: number;
  step?: number;
}

/**
 * Algorithm metadata for registry
 */
export interface AlgorithmInfo {
  id: string;
  name: string;
  category: 'sorting' | 'graph' | 'tree' | 'data-structure';
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
}

/**
 * Algorithm generator function signature
 */
export type AlgorithmGenerator = Generator<AlgorithmStep, void, unknown>;
export type AlgorithmFunction = (input: any, ...args: any[]) => AlgorithmGenerator;

// ============================================
// SORTING TYPES
// ============================================

export interface SortingState {
  array: number[];
  originalArray: number[];
  activeIndices: number[];
  sortedIndices: number[];
  comparingIndices: number[];
  swappingIndices: number[];
  swaps: number;
  comparisons: number;
  running: boolean;
  paused: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
  algorithm: string;
  message: string;
}

// ============================================
// GRAPH TYPES
// ============================================

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  visited?: boolean;
  active?: boolean;
  distance?: number;
  heuristic?: number;
  fScore?: number;
  parent?: string | null;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  directed?: boolean;
  active?: boolean;
  inMST?: boolean;
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  originalNodes: GraphNode[];
  originalEdges: GraphEdge[];
  visitedNodes: string[];
  currentNode: string | null;
  currentEdge: [string, string] | null;
  activeNode: string | null;
  activeEdge: [string, string] | null;
  distances: Record<string, number>;
  path: string[];
  queue: string[];
  stack: string[];
  algorithm: string;
  running: boolean;
  paused: boolean;
  speed: number;
  message: string;
  comparisons: number;
  operations: number;
}

// ============================================
// TREE TYPES
// ============================================

export interface TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  parent?: TreeNode | null;
  x?: number;
  y?: number;
  visited?: boolean;
  active?: boolean;
  height?: number;
}

export interface TreeState {
  root: TreeNode | null;
  highlightNodes: string[];
  traversalOrder: string[];
  algorithm: string;
  running: boolean;
  paused: boolean;
  speed: number;
  message: string;
}

// ============================================
// DATA STRUCTURE TYPES
// ============================================

export interface StackNode {
  id: string;
  value: number;
  index: number;
}

export interface QueueNode {
  id: string;
  value: number;
  index: number;
}

export interface LinkedListNode {
  id: string;
  value: number;
  next: LinkedListNode | null;
  active?: boolean;
}

export interface HeapNode {
  value: number;
  index: number;
  active?: boolean;
}

export interface DataStructureState {
  type: 'stack' | 'queue' | 'linked-list' | 'heap' | 'bst';
  structure: any;
  highlight: string[];
  operation: string;
  running: boolean;
  message: string;
}

// ============================================
// ANIMATION TYPES
// ============================================

export interface AnimationConfig {
  duration: number;
  delay: number;
  ease?: string;
}

export interface VisualizationConfig {
  speed: number; // 1-10 scale
  autoPlay: boolean;
  showStats: boolean;
  colorScheme: ColorScheme;
}

export interface ColorScheme {
  default: string;
  comparing: string;
  swapping: string;
  sorted: string;
  active: string;
  visited: string;
  path: string;
  highlight: string;
}

// ============================================
// CONTROL TYPES
// ============================================

export interface ControlState {
  playing: boolean;
  speed: number;
  step: number;
  canStepForward: boolean;
  canStepBackward: boolean;
  canReset: boolean;
}

// ============================================
// APP STATE
// ============================================

export interface AppState {
  currentCategory: 'sorting' | 'graph' | 'tree' | 'data-structure';
  currentAlgorithm: string;
  visualizationConfig: VisualizationConfig;
  sortingState: SortingState;
  graphState: GraphState;
  treeState: TreeState;
  dataStructureState: DataStructureState;
}
