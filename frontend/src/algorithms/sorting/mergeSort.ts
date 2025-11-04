/**
 * MERGE SORT ALGORITHM
 * Time Complexity: O(n log n) all cases
 * Space Complexity: O(n)
 * 
 * Divide and conquer algorithm that divides the array into two halves,
 * recursively sorts them, and then merges the sorted halves.
 */

import { AlgorithmStep } from '../../types';

export function* mergeSort(inputArray: number[]): Generator<AlgorithmStep, void, unknown> {
  const array = [...inputArray];
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
    message: 'Starting Merge Sort...',
    comparisons,
    swaps,
    step: step++,
  };

  // Helper function to merge two sorted subarrays
  function* merge(
    arr: number[],
    left: number,
    mid: number,
    right: number
  ): Generator<AlgorithmStep, void, unknown> {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    let i = 0;
    let j = 0;
    let k = left;

    // Show the two subarrays being merged
    yield {
      array: [...arr],
      highlight: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
      sorted: [],
      comparing: [],
      swapping: [],
      message: `Merging subarrays [${leftArr.join(', ')}] and [${rightArr.join(', ')}]`,
      comparisons,
      swaps,
      step: step++,
    };

    // Merge the two subarrays
    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;

      yield {
        array: [...arr],
        highlight: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
        sorted: [],
        comparing: [left + i, mid + 1 + j],
        swapping: [],
        message: `Comparing ${leftArr[i]} and ${rightArr[j]}`,
        comparisons,
        swaps,
        step: step++,
      };

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }

      yield {
        array: [...arr],
        highlight: [k],
        sorted: [],
        comparing: [],
        swapping: [],
        message: `Placed ${arr[k]} at position ${k}`,
        comparisons,
        swaps,
        step: step++,
      };

      k++;
    }

    // Copy remaining elements from left subarray
    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      
      yield {
        array: [...arr],
        highlight: [k],
        sorted: [],
        comparing: [],
        swapping: [],
        message: `Copying remaining element ${arr[k]} from left subarray`,
        comparisons,
        swaps,
        step: step++,
      };

      i++;
      k++;
    }

    // Copy remaining elements from right subarray
    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      
      yield {
        array: [...arr],
        highlight: [k],
        sorted: [],
        comparing: [],
        swapping: [],
        message: `Copying remaining element ${arr[k]} from right subarray`,
        comparisons,
        swaps,
        step: step++,
      };

      j++;
      k++;
    }

    // Show merged subarray
    yield {
      array: [...arr],
      highlight: [],
      sorted: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
      comparing: [],
      swapping: [],
      message: `Merged subarray from index ${left} to ${right}`,
      comparisons,
      swaps,
      step: step++,
    };
  }

  // Recursive merge sort helper
  function* mergeSortHelper(
    arr: number[],
    left: number,
    right: number
  ): Generator<AlgorithmStep, void, unknown> {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    // Show division
    yield {
      array: [...arr],
      highlight: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
      sorted: [],
      comparing: [],
      swapping: [],
      message: `Dividing array from index ${left} to ${right} at midpoint ${mid}`,
      comparisons,
      swaps,
      step: step++,
    };

    // Sort left half
    yield* mergeSortHelper(arr, left, mid);

    // Sort right half
    yield* mergeSortHelper(arr, mid + 1, right);

    // Merge sorted halves
    yield* merge(arr, left, mid, right);
  }

  // Start merge sort
  yield* mergeSortHelper(array, 0, array.length - 1);

  // All elements sorted
  yield {
    array: [...array],
    highlight: [],
    sorted: Array.from({ length: array.length }, (_, i) => i),
    comparing: [],
    swapping: [],
    message: `Merge Sort complete! Comparisons: ${comparisons}`,
    comparisons,
    swaps,
    step: step++,
  };
}

export const mergeSortInfo = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'sorting' as const,
  description: 'Divide and conquer algorithm that divides the array into halves, recursively sorts them, and merges the results.',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
  },
  spaceComplexity: 'O(n)',
};
