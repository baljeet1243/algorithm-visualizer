/**
 * Radix Sort Algorithm (LSD - Least Significant Digit)
 * Time: O(d * (n + k)) where d is number of digits, k is radix
 * Space: O(n + k)
 * Method: Sort digit by digit using counting sort
 */

import { AlgorithmStep, AlgorithmInfo } from '../../types';

export function* radixSort(array: number[]): Generator<AlgorithmStep> {
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

  // Find maximum to know number of digits
  let max = Math.max(...arr);

  yield {
    array: [...arr],
    message: `Maximum value is ${max}. Starting radix sort...`,
    comparisons,
    swaps: 0,
  };

  // Do counting sort for every digit
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    yield* countingSortByDigit(arr, n, exp);
  }

  yield {
    array: [...arr],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: 'Radix sort complete!',
    comparisons,
    swaps: operations,
  };

  function* countingSortByDigit(arr: number[], n: number, exp: number): Generator<AlgorithmStep> {
    const output = new Array(n);
    const count = new Array(10).fill(0);
    const digit = Math.floor(Math.log10(exp)) + 1;

    yield {
      array: [...arr],
      message: `Sorting by digit ${digit} (place value ${exp})...`,
      comparisons,
      swaps: operations,
    };

    // Store count of occurrences
    for (let i = 0; i < n; i++) {
      const digitValue = Math.floor(arr[i] / exp) % 10;
      count[digitValue]++;
      operations++;

      yield {
        array: [...arr],
        highlight: [i],
        message: `Digit ${digit} of ${arr[i]} is ${digitValue}`,
        comparisons,
        swaps: operations,
      };
    }

    // Change count[i] so it contains actual position
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Build output array
    for (let i = n - 1; i >= 0; i--) {
      const digitValue = Math.floor(arr[i] / exp) % 10;
      output[count[digitValue] - 1] = arr[i];
      count[digitValue]--;
      operations++;

      const temp = [...output];
      for (let j = i + 1; j < n; j++) {
        if (temp[j] === undefined) {
          temp[j] = arr[j];
        }
      }

      yield {
        array: temp,
        highlight: [count[digitValue]],
        message: `Placing ${arr[i]} (digit ${digitValue}) at position ${count[digitValue]}`,
        comparisons,
        swaps: operations,
      };
    }

    // Copy output array to arr
    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
    }

    yield {
      array: [...arr],
      message: `Digit ${digit} sorted!`,
      comparisons,
      swaps: operations,
    };
  }
}

export const radixSortInfo: AlgorithmInfo = {
  id: 'radix-sort',
  name: 'Radix Sort',
  category: 'sorting',
  description: 'Non-comparison based sorting algorithm. Sorts integers digit by digit from least significant to most significant using counting sort.',
  timeComplexity: {
    best: 'O(d * (n + k))',
    average: 'O(d * (n + k))',
    worst: 'O(d * (n + k))',
  },
  spaceComplexity: 'O(n + k)',
};
