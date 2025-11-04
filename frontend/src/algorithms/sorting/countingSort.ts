/**
 * Counting Sort Algorithm
 * Time: O(n + k) where k is the range of input
 * Space: O(k)
 * Method: Count occurrences, then place elements in order
 */

import { AlgorithmStep, AlgorithmInfo } from '../../types';

export function* countingSort(array: number[]): Generator<AlgorithmStep> {
  const arr = [...array];
  const n = arr.length;
  let comparisons = 0;
  let operations = 0;

  if (n <= 1) {
    yield {
      array: [...arr],
      sorted: [0],
      message: 'Array already sorted!',
      comparisons,
      swaps: 0,
    };
    return;
  }

  // Find min and max
  let min = arr[0];
  let max = arr[0];

  for (let i = 1; i < n; i++) {
    comparisons += 2;
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];

    yield {
      array: [...arr],
      highlight: [i],
      message: `Finding range: min=${min}, max=${max}`,
      comparisons,
      swaps: 0,
    };
  }

  const range = max - min + 1;

  yield {
    array: [...arr],
    message: `Range is ${range}. Creating count array...`,
    comparisons,
    swaps: 0,
  };

  // Create count array
  const count = new Array(range).fill(0);

  // Count occurrences
  for (let i = 0; i < n; i++) {
    count[arr[i] - min]++;
    operations++;

    yield {
      array: [...arr],
      highlight: [i],
      message: `Counting ${arr[i]}: count = ${count[arr[i] - min]}`,
      comparisons,
      swaps: 0,
    };
  }

  // Cumulative count
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
    operations++;
  }

  yield {
    array: [...arr],
    message: 'Count array ready. Placing elements in sorted order...',
    comparisons,
    swaps: 0,
  };

  // Build output array
  const output = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    const value = arr[i];
    const pos = count[value - min] - 1;
    output[pos] = value;
    count[value - min]--;
    operations++;

    // Create a partially sorted view
    const temp = [...arr];
    for (let j = 0; j < n; j++) {
      if (output[j] !== undefined) {
        temp[j] = output[j];
      }
    }

    yield {
      array: temp,
      highlight: [pos],
      message: `Placing ${value} at position ${pos}`,
      comparisons,
      swaps: operations,
    };
  }

  yield {
    array: output,
    sorted: Array.from({ length: n }, (_, i) => i),
    message: 'Counting sort complete!',
    comparisons,
    swaps: operations,
  };
}

export const countingSortInfo: AlgorithmInfo = {
  id: 'counting-sort',
  name: 'Counting Sort',
  category: 'sorting',
  description: 'Non-comparison based sorting algorithm. Counts occurrences of each value and places them in order. Efficient for small range of integers.',
  timeComplexity: {
    best: 'O(n + k)',
    average: 'O(n + k)',
    worst: 'O(n + k)',
  },
  spaceComplexity: 'O(k)',
};
