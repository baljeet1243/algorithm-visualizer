/**
 * INSERTION SORT ALGORITHM
 * Time Complexity: O(n²) average and worst case, O(n) best case
 * Space Complexity: O(1)
 * 
 * Builds the final sorted array one item at a time by inserting elements
 * into their correct position within the sorted portion.
 */

import { AlgorithmStep } from '../../types';

export function* insertionSort(inputArray: number[]): Generator<AlgorithmStep, void, unknown> {
  const array = [...inputArray];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;
  let step = 0;

  // Initial state
  yield {
    array: [...array],
    highlight: [],
    sorted: [0],
    comparing: [],
    swapping: [],
    message: 'Starting Insertion Sort... First element is already sorted',
    comparisons,
    swaps,
    step: step++,
  };

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;

    // Show the key element being inserted
    yield {
      array: [...array],
      highlight: [i],
      sorted: Array.from({ length: i }, (_, k) => k),
      comparing: [],
      swapping: [],
      message: `Inserting ${key} into sorted portion`,
      comparisons,
      swaps,
      step: step++,
    };

    // Shift elements greater than key to the right
    while (j >= 0 && array[j] > key) {
      comparisons++;

      // Show comparison
      yield {
        array: [...array],
        highlight: [i],
        sorted: Array.from({ length: i }, (_, k) => k),
        comparing: [j, i],
        swapping: [],
        message: `Comparing ${array[j]} with ${key}`,
        comparisons,
        swaps,
        step: step++,
      };

      // Shift element
      array[j + 1] = array[j];
      swaps++;

      yield {
        array: [...array],
        highlight: [j + 1],
        sorted: Array.from({ length: i }, (_, k) => k),
        comparing: [],
        swapping: [j, j + 1],
        message: `Shifting ${array[j + 1]} to the right`,
        comparisons,
        swaps,
        step: step++,
      };

      j--;
    }

    // Final comparison if we didn't break early
    if (j >= 0) {
      comparisons++;
      yield {
        array: [...array],
        highlight: [i],
        sorted: Array.from({ length: i }, (_, k) => k),
        comparing: [j, i],
        swapping: [],
        message: `${array[j]} is less than ${key}, found insertion point`,
        comparisons,
        swaps,
        step: step++,
      };
    }

    // Insert key at correct position
    array[j + 1] = key;

    yield {
      array: [...array],
      highlight: [j + 1],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      comparing: [],
      swapping: [],
      message: `Inserted ${key} at position ${j + 1}`,
      comparisons,
      swaps,
      step: step++,
    };
  }

  // All elements sorted
  yield {
    array: [...array],
    highlight: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    comparing: [],
    swapping: [],
    message: `Insertion Sort complete! Comparisons: ${comparisons}, Shifts: ${swaps}`,
    comparisons,
    swaps,
    step: step++,
  };
}

export const insertionSortInfo = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'sorting' as const,
  description: 'Builds the final sorted array one item at a time, inserting each element into its correct position.',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
};
