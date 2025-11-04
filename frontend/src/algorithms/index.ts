/**
 * Algorithm Registry
 * Central registry for all algorithms with metadata and dynamic loading
 */

import { AlgorithmInfo, AlgorithmFunction } from '../types';

// Import sorting algorithms
import * as sorting from './sorting';

// Import graph algorithms
import * as graphs from './graphs';

// Import data structures
import * as structures from './structures';

/**
 * Algorithm Registry Map
 * Maps category -> algorithm-id -> function
 */
export const algorithmRegistry: Record<string, Record<string, AlgorithmFunction>> = {
  sorting: {
    'bubble-sort': sorting.bubbleSort,
    'insertion-sort': sorting.insertionSort,
    'selection-sort': sorting.selectionSort,
    'merge-sort': sorting.mergeSort,
    'quick-sort': sorting.quickSort,
    'heap-sort': sorting.heapSort,
    'counting-sort': sorting.countingSort,
    'radix-sort': sorting.radixSort,
  },
  graph: {
    'bfs': graphs.bfs,
    'dfs': graphs.dfs,
    'dijkstra': graphs.dijkstra,
    'a-star': graphs.aStar,
    'prim': graphs.prim,
    'kruskal': graphs.kruskal,
  },
  'data-structure': {
    'stack-push': structures.stackPush,
    'stack-pop': structures.stackPop,
    'queue-enqueue': structures.queueEnqueue,
    'queue-dequeue': structures.queueDequeue,
    'linked-list-insert': structures.linkedListInsert,
    'linked-list-search': structures.linkedListSearch,
    'linked-list-reverse': structures.linkedListReverse,
    'bst-insert': structures.bstInsert,
    'bst-search': structures.bstSearch,
    'bst-inorder': structures.bstInorderTraversal,
    'bst-preorder': structures.bstPreorderTraversal,
    'bst-postorder': structures.bstPostorderTraversal,
    'heap-insert': structures.heapInsert,
    'heap-extract': structures.heapExtractMin,
  },
};

/**
 * Algorithm Metadata Registry
 */
export const algorithmMetadata: AlgorithmInfo[] = [
  ...sorting.sortingAlgorithms,
  ...graphs.graphAlgorithms,
  ...structures.dataStructures,
];

/**
 * Get algorithm function by category and ID
 */
export function getAlgorithm(category: string, algorithmId: string): AlgorithmFunction | null {
  const categoryAlgorithms = algorithmRegistry[category];
  if (!categoryAlgorithms) return null;
  
  return categoryAlgorithms[algorithmId] || null;
}

/**
 * Get algorithm metadata by ID
 * Optionally filter by category
 */
export function getAlgorithmInfo(categoryOrId: string, algorithmId?: string): AlgorithmInfo | null {
  // If two parameters provided, filter by category
  if (algorithmId) {
    return algorithmMetadata.find(algo => 
      algo.category === categoryOrId && algo.id === algorithmId
    ) || null;
  }
  // If one parameter, just search by ID
  return algorithmMetadata.find(algo => algo.id === categoryOrId) || null;
}

/**
 * Get all algorithms in a category
 */
export function getAlgorithmsByCategory(category: string): AlgorithmInfo[] {
  return algorithmMetadata.filter(algo => algo.category === category);
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
  return ['sorting', 'graph', 'data-structure'];
}

/**
 * Search algorithms by name or description
 */
export function searchAlgorithms(query: string): AlgorithmInfo[] {
  const lowerQuery = query.toLowerCase();
  return algorithmMetadata.filter(algo =>
    algo.name.toLowerCase().includes(lowerQuery) ||
    algo.description.toLowerCase().includes(lowerQuery)
  );
}
