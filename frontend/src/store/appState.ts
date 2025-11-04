/**
 * Global Application State Management using Zustand
 * Manages visualization state, controls, and algorithm execution
 */

import { create } from 'zustand';
import { 
  SortingState, 
  GraphState, 
  TreeState, 
  DataStructureState,
  VisualizationConfig,
  GraphNode,
  GraphEdge,
  TreeNode
} from '../types';
import { generateRandomArray, DEFAULT_COLOR_SCHEME } from '../utils/helpers';
import { AlgorithmRunner } from '../utils/animations';

interface AppStore {
  // Current category and algorithm
  currentCategory: 'sorting' | 'graph' | 'tree' | 'data-structure';
  currentAlgorithm: string;
  selectedAlgorithm: string;
  
  // Visualization config
  visualizationConfig: VisualizationConfig;
  
  // Algorithm runner
  algorithmRunner: AlgorithmRunner | null;
  
  // State for each category
  sortingState: SortingState;
  graphState: GraphState;
  treeState: TreeState;
  dataStructureState: DataStructureState;
  
  // Actions
  setCategory: (category: 'sorting' | 'graph' | 'tree' | 'data-structure') => void;
  setAlgorithm: (algorithmId: string) => void;
  setSpeed: (speed: number) => void;
  setAutoPlay: (autoPlay: boolean) => void;
  
  // Sorting actions
  setSortingArray: (array: number[]) => void;
  updateSortingState: (state: Partial<SortingState>) => void;
  resetSorting: () => void;
  
  // Graph actions
  setGraphNodes: (nodes: GraphNode[]) => void;
  setGraphEdges: (edges: GraphEdge[]) => void;
  addGraphNode: (node: GraphNode) => void;
  addGraphEdge: (edge: GraphEdge) => void;
  updateGraphState: (state: Partial<GraphState>) => void;
  resetGraph: () => void;
  
  // Tree actions
  setTreeRoot: (root: TreeNode | null) => void;
  updateTreeState: (state: Partial<TreeState>) => void;
  resetTree: () => void;
  
  // Data structure actions
  updateDataStructureState: (state: Partial<DataStructureState>) => void;
  resetDataStructure: () => void;
  
  // Algorithm runner actions
  setAlgorithmRunner: (runner: AlgorithmRunner | null) => void;
  
  // Global reset
  resetAll: () => void;
}

const initialSortingState: SortingState = {
  array: generateRandomArray(20, 10, 100),
  originalArray: [],
  activeIndices: [],
  sortedIndices: [],
  comparingIndices: [],
  swappingIndices: [],
  swaps: 0,
  comparisons: 0,
  running: false,
  paused: false,
  speed: 5,
  currentStep: 0,
  totalSteps: 0,
  algorithm: '',
  message: '',
};

const initialGraphState: GraphState = {
  nodes: [],
  edges: [],
  originalNodes: [],
  originalEdges: [],
  visitedNodes: [],
  currentNode: null,
  currentEdge: null,
  activeNode: null,
  activeEdge: null,
  distances: {},
  path: [],
  queue: [],
  stack: [],
  algorithm: '',
  running: false,
  paused: false,
  speed: 5,
  message: '',
  comparisons: 0,
  operations: 0,
};

const initialTreeState: TreeState = {
  root: null,
  highlightNodes: [],
  traversalOrder: [],
  algorithm: '',
  running: false,
  paused: false,
  speed: 5,
  message: '',
};

const initialDataStructureState: DataStructureState = {
  type: 'stack',
  structure: null,
  highlight: [],
  operation: '',
  running: false,
  message: '',
};

const initialVisualizationConfig: VisualizationConfig = {
  speed: 5,
  autoPlay: false,
  showStats: true,
  colorScheme: DEFAULT_COLOR_SCHEME,
};

export const useAppStore = create<AppStore>((set) => ({
  // Initial state
  currentCategory: 'sorting',
  currentAlgorithm: 'bubble-sort',
  selectedAlgorithm: 'bubble-sort',
  visualizationConfig: initialVisualizationConfig,
  algorithmRunner: null,
  sortingState: { ...initialSortingState, originalArray: [...initialSortingState.array] },
  graphState: initialGraphState,
  treeState: initialTreeState,
  dataStructureState: initialDataStructureState,

  // Category and algorithm selection
  setCategory: (category) => set({ currentCategory: category }),
  
  setAlgorithm: (algorithmId) => set({ currentAlgorithm: algorithmId, selectedAlgorithm: algorithmId }),

  // Visualization config
  setSpeed: (speed) => set((state) => ({
    visualizationConfig: { ...state.visualizationConfig, speed },
  })),

  setAutoPlay: (autoPlay) => set((state) => ({
    visualizationConfig: { ...state.visualizationConfig, autoPlay },
  })),

  // Sorting actions
  setSortingArray: (array) => set((state) => ({
    sortingState: {
      ...state.sortingState,
      array: [...array],
      originalArray: [...array],
      activeIndices: [],
      sortedIndices: [],
      comparingIndices: [],
      swappingIndices: [],
      swaps: 0,
      comparisons: 0,
      currentStep: 0,
      message: '',
    },
  })),

  updateSortingState: (newState) => set((state) => ({
    sortingState: { ...state.sortingState, ...newState },
  })),

  resetSorting: () => set((state) => ({
    sortingState: {
      ...initialSortingState,
      array: [...state.sortingState.originalArray],
      originalArray: [...state.sortingState.originalArray],
    },
  })),

  // Graph actions
  setGraphNodes: (nodes) => set((state) => ({
    graphState: { ...state.graphState, nodes, originalNodes: nodes },
  })),

  setGraphEdges: (edges) => set((state) => ({
    graphState: { ...state.graphState, edges, originalEdges: edges },
  })),

  addGraphNode: (node) => set((state) => ({
    graphState: {
      ...state.graphState,
      nodes: [...state.graphState.nodes, node],
    },
  })),

  addGraphEdge: (edge) => set((state) => ({
    graphState: {
      ...state.graphState,
      edges: [...state.graphState.edges, edge],
    },
  })),

  updateGraphState: (newState) => set((state) => ({
    graphState: { ...state.graphState, ...newState },
  })),

  resetGraph: () => set({ graphState: initialGraphState }),

  // Tree actions
  setTreeRoot: (root) => set((state) => ({
    treeState: { ...state.treeState, root },
  })),

  updateTreeState: (newState) => set((state) => ({
    treeState: { ...state.treeState, ...newState },
  })),

  resetTree: () => set({ treeState: initialTreeState }),

  // Data structure actions
  updateDataStructureState: (newState) => set((state) => ({
    dataStructureState: { ...state.dataStructureState, ...newState },
  })),

  resetDataStructure: () => set({ dataStructureState: initialDataStructureState }),

  // Algorithm runner
  setAlgorithmRunner: (runner) => set({ algorithmRunner: runner }),

  // Global reset
  resetAll: () => set(() => ({
    sortingState: {
      ...initialSortingState,
      array: generateRandomArray(20, 10, 100),
      originalArray: [],
    },
    graphState: initialGraphState,
    treeState: initialTreeState,
    dataStructureState: initialDataStructureState,
    algorithmRunner: null,
  })),
}));
