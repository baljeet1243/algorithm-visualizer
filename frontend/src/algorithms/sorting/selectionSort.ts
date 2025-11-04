/**
 * SELECTION SORT ALGORITHM
 * Time Complexity: O(n²) all cases
 * Space Complexity: O(1)
 * 
 * Divides the array into sorted and unsorted portions.
 * Repeatedly finds the minimum element from unsorted portion and places it at the beginning.
 */

import { AlgorithmStep } from '../../types';

export function* selectionSort(inputArray: number[]): Generator<AlgorithmStep, void, unknown> {
  const array = [...inputArray];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;
  let step = 0;

  // Initial state
  yield {
    array: [...array],
    highlight: [],
    sorted: [],
    comparing: [],
    swapping: [],
    message: 'Starting Selection Sort...',
    comparisons,
    swaps,
    step: step++,
  };

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    // Show starting position for this pass
    yield {
      array: [...array],
      highlight: [i],
      sorted: Array.from({ length: i }, (_, k) => k),
      comparing: [],
      swapping: [],
      message: `Finding minimum element in unsorted portion starting at index ${i}`,
      comparisons,
      swaps,
      step: step++,
    };

    // Find minimum element in unsorted portion
    for (let j = i + 1; j < n; j++) {
      comparisons++;

      yield {
        array: [...array],
        highlight: [minIndex],
        sorted: Array.from({ length: i }, (_, k) => k),
        comparing: [minIndex, j],
        swapping: [],
        message: `Comparing ${array[minIndex]} (current min) with ${array[j]}`,
        comparisons,
        swaps,
        step: step++,
      };

      if (array[j] < array[minIndex]) {
        minIndex = j;

        yield {
          array: [...array],
          highlight: [minIndex],
          sorted: Array.from({ length: i }, (_, k) => k),
          comparing: [],
          swapping: [],
          message: `New minimum found: ${array[minIndex]} at index ${minIndex}`,
          comparisons,
          swaps,
          step: step++,
        };
      }
    }

    // Swap minimum element with first element of unsorted portion
    if (minIndex !== i) {
      yield {
        array: [...array],
        highlight: [],
        sorted: Array.from({ length: i }, (_, k) => k),
        comparing: [],
        swapping: [i, minIndex],
        message: `Swapping ${array[i]} with minimum ${array[minIndex]}`,
        comparisons,
        swaps,
        step: step++,
      };

      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      swaps++;

      yield {
        array: [...array],
        highlight: [i],
        sorted: Array.from({ length: i }, (_, k) => k),
        comparing: [],
        swapping: [],
        message: `Swapped: ${array[i]} is now at position ${i}`,
        comparisons,
        swaps,
        step: step++,
      };
    } else {
      yield {
        array: [...array],
        highlight: [i],
        sorted: Array.from({ length: i }, (_, k) => k),
        comparing: [],
        swapping: [],
        message: `${array[i]} is already in correct position`,
        comparisons,
        swaps,
        step: step++,
      };
    }

    // Mark element as sorted
    yield {
      array: [...array],
      highlight: [],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      comparing: [],
      swapping: [],
      message: `Element ${array[i]} is now in sorted portion`,
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
    message: `Selection Sort complete! Comparisons: ${comparisons}, Swaps: ${swaps}`,
    comparisons,
    swaps,
    step: step++,
  };
}

export const selectionSortInfo = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: 'sorting' as const,
  description: 'Repeatedly finds the minimum element from the unsorted portion and places it at the beginning.',
  timeComplexity: {
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
};
