/**
 * Heap Sort Algorithm
 * Time: O(n log n) in all cases
 * Space: O(1)
 * Method: Build max heap, repeatedly extract max
 */

import { AlgorithmStep, AlgorithmInfo } from '../../types';

export function* heapSort(array: number[]): Generator<AlgorithmStep> {
  const arr = [...array];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  // Build max heap
  yield {
    array: [...arr],
    message: 'Building max heap...',
    comparisons,
    swaps,
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(arr, n, i);
  }

  yield {
    array: [...arr],
    message: 'Max heap built. Starting extraction...',
    comparisons,
    swaps,
  };

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    [arr[0], arr[i]] = [arr[i], arr[0]];
    swaps++;

    yield {
      array: [...arr],
      swapping: [0, i],
      sorted: Array.from({ length: n - i }, (_, idx) => n - 1 - idx),
      message: `Moved max element ${arr[i]} to position ${i}`,
      comparisons,
      swaps,
    };

    // Heapify the reduced heap
    yield* heapify(arr, i, 0);
  }

  yield {
    array: [...arr],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: 'Heap sort complete!',
    comparisons,
    swaps,
  };

  function* heapify(arr: number[], n: number, i: number): Generator<AlgorithmStep> {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      comparisons++;
      yield {
        array: [...arr],
        comparing: [left, largest],
        message: `Comparing left child ${arr[left]} with parent ${arr[largest]}`,
        comparisons,
        swaps,
      };

      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < n) {
      comparisons++;
      yield {
        array: [...arr],
        comparing: [right, largest],
        message: `Comparing right child ${arr[right]} with current largest ${arr[largest]}`,
        comparisons,
        swaps,
      };

      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      swaps++;

      yield {
        array: [...arr],
        swapping: [i, largest],
        message: `Swapping ${arr[largest]} with ${arr[i]} to maintain heap property`,
        comparisons,
        swaps,
      };

      yield* heapify(arr, n, largest);
    }
  }
}

export const heapSortInfo: AlgorithmInfo = {
  id: 'heap-sort',
  name: 'Heap Sort',
  category: 'sorting',
  description: 'Comparison-based sorting using a binary heap data structure. Builds a max heap, then repeatedly extracts the maximum element.',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
  },
  spaceComplexity: 'O(1)',
};
