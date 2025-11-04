/**
 * QUICK SORT ALGORITHM
 * Time Complexity: O(n log n) average, O(n²) worst case
 * Space Complexity: O(log n)
 * 
 * Divide and conquer algorithm that picks a pivot element and partitions
 * the array around it, then recursively sorts the partitions.
 */

import { AlgorithmStep } from '../../types';

export function* quickSort(inputArray: number[]): Generator<AlgorithmStep, void, unknown> {
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
    message: 'Starting Quick Sort...',
    comparisons,
    swaps,
    step: step++,
  };

  // Partition function
  function* partition(
    arr: number[],
    low: number,
    high: number
  ): Generator<AlgorithmStep | number, number, unknown> {
    const pivot = arr[high];
    
    // Show pivot selection
    yield {
      array: [...arr],
      highlight: [high],
      sorted: [],
      comparing: [],
      swapping: [],
      message: `Selected pivot: ${pivot} at index ${high}`,
      comparisons,
      swaps,
      step: step++,
    };

    let i = low - 1;

    for (let j = low; j < high; j++) {
      comparisons++;

      // Compare with pivot
      yield {
        array: [...arr],
        highlight: [high],
        sorted: [],
        comparing: [j, high],
        swapping: [],
        message: `Comparing ${arr[j]} with pivot ${pivot}`,
        comparisons,
        swaps,
        step: step++,
      };

      if (arr[j] < pivot) {
        i++;

        if (i !== j) {
          // Show swap
          yield {
            array: [...arr],
            highlight: [high],
            sorted: [],
            comparing: [],
            swapping: [i, j],
            message: `Swapping ${arr[i]} and ${arr[j]} (both less than pivot)`,
            comparisons,
            swaps,
            step: step++,
          };

          [arr[i], arr[j]] = [arr[j], arr[i]];
          swaps++;

          yield {
            array: [...arr],
            highlight: [high, i],
            sorted: [],
            comparing: [],
            swapping: [],
            message: `Elements less than pivot are now to the left of index ${i}`,
            comparisons,
            swaps,
            step: step++,
          };
        }
      }
    }

    // Place pivot in correct position
    const pivotIndex = i + 1;
    
    if (pivotIndex !== high) {
      yield {
        array: [...arr],
        highlight: [],
        sorted: [],
        comparing: [],
        swapping: [pivotIndex, high],
        message: `Placing pivot ${pivot} in its final position at index ${pivotIndex}`,
        comparisons,
        swaps,
        step: step++,
      };

      [arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]];
      swaps++;
    }

    // Show pivot in final position
    yield {
      array: [...arr],
      highlight: [pivotIndex],
      sorted: [pivotIndex],
      comparing: [],
      swapping: [],
      message: `Pivot ${pivot} is now in its final sorted position`,
      comparisons,
      swaps,
      step: step++,
    };

    return pivotIndex;
  }

  // Recursive quick sort helper
  function* quickSortHelper(
    arr: number[],
    low: number,
    high: number,
    sortedIndices: Set<number> = new Set()
  ): Generator<AlgorithmStep, void, unknown> {
    if (low < high) {
      // Show current subarray
      yield {
        array: [...arr],
        highlight: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
        sorted: Array.from(sortedIndices),
        comparing: [],
        swapping: [],
        message: `Sorting subarray from index ${low} to ${high}`,
        comparisons,
        swaps,
        step: step++,
      };

      // Partition and get pivot index
      const partitionGen = partition(arr, low, high);
      let partitionResult = partitionGen.next();
      
      while (!partitionResult.done) {
        if (typeof partitionResult.value === 'number') {
          // This is the return value (pivot index)
          break;
        }
        yield partitionResult.value as AlgorithmStep;
        partitionResult = partitionGen.next();
      }

      const pivotIndex = partitionResult.value as number;
      sortedIndices.add(pivotIndex);

      // Sort left partition
      yield* quickSortHelper(arr, low, pivotIndex - 1, sortedIndices);

      // Sort right partition
      yield* quickSortHelper(arr, pivotIndex + 1, high, sortedIndices);
    } else if (low === high) {
      // Single element is already sorted
      sortedIndices.add(low);
      yield {
        array: [...arr],
        highlight: [low],
        sorted: Array.from(sortedIndices),
        comparing: [],
        swapping: [],
        message: `Element ${arr[low]} at index ${low} is in final position`,
        comparisons,
        swaps,
        step: step++,
      };
    }
  }

  // Start quick sort
  const sortedIndices = new Set<number>();
  yield* quickSortHelper(array, 0, array.length - 1, sortedIndices);

  // All elements sorted
  yield {
    array: [...array],
    highlight: [],
    sorted: Array.from({ length: array.length }, (_, i) => i),
    comparing: [],
    swapping: [],
    message: `Quick Sort complete! Comparisons: ${comparisons}, Swaps: ${swaps}`,
    comparisons,
    swaps,
    step: step++,
  };
}

export const quickSortInfo = {
  id: 'quick-sort',
  name: 'Quick Sort',
  category: 'sorting' as const,
  description: 'Divide and conquer algorithm that picks a pivot and partitions the array around it, then recursively sorts the partitions.',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(log n)',
};
