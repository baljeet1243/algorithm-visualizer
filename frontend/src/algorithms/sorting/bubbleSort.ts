/**
 * BUBBLE SORT ALGORITHM
 * Time Complexity: O(n²) average and worst case
 * Space Complexity: O(1)
 * 
 * Compares adjacent elements and swaps them if they're in wrong order.
 * Continues until no more swaps are needed.
 */

import { AlgorithmStep } from '../../types';

export function* bubbleSort(inputArray: number[]): Generator<AlgorithmStep, void, unknown> {
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
    message: 'Starting Bubble Sort...',
    comparisons,
    swaps,
    step: step++,
  };

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      // Comparing two adjacent elements
      comparisons++;
      yield {
        array: [...array],
        highlight: [],
        sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
        comparing: [j, j + 1],
        swapping: [],
        message: `Comparing ${array[j]} and ${array[j + 1]}`,
        comparisons,
        swaps,
        step: step++,
      };

      if (array[j] > array[j + 1]) {
        // Swap elements
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swaps++;
        swapped = true;

        yield {
          array: [...array],
          highlight: [],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
          comparing: [],
          swapping: [j, j + 1],
          message: `Swapped ${array[j + 1]} and ${array[j]}`,
          comparisons,
          swaps,
          step: step++,
        };
      }
    }

    // Mark last element as sorted
    yield {
      array: [...array],
      highlight: [],
      sorted: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
      comparing: [],
      swapping: [],
      message: `Element ${array[n - 1 - i]} is in its final position`,
      comparisons,
      swaps,
      step: step++,
    };

    // If no swaps occurred, array is sorted
    if (!swapped) {
      break;
    }
  }

  // All elements sorted
  yield {
    array: [...array],
    highlight: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    comparing: [],
    swapping: [],
    message: `Bubble Sort complete! Comparisons: ${comparisons}, Swaps: ${swaps}`,
    comparisons,
    swaps,
    step: step++,
  };
}

export const bubbleSortInfo = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'sorting' as const,
  description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
};
