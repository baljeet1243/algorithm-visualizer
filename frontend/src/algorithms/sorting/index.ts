/**
 * Sorting Algorithms Index
 * Exports all sorting algorithms and their metadata
 */

export { bubbleSort, bubbleSortInfo } from './bubbleSort';
export { insertionSort, insertionSortInfo } from './insertionSort';
export { selectionSort, selectionSortInfo } from './selectionSort';
export { mergeSort, mergeSortInfo } from './mergeSort';
export { quickSort, quickSortInfo } from './quickSort';
export { heapSort, heapSortInfo } from './heapSort';
export { countingSort, countingSortInfo } from './countingSort';
export { radixSort, radixSortInfo } from './radixSort';

import { bubbleSortInfo } from './bubbleSort';
import { insertionSortInfo } from './insertionSort';
import { selectionSortInfo } from './selectionSort';
import { mergeSortInfo } from './mergeSort';
import { quickSortInfo } from './quickSort';
import { heapSortInfo } from './heapSort';
import { countingSortInfo } from './countingSort';
import { radixSortInfo } from './radixSort';

export const sortingAlgorithms = [
  bubbleSortInfo,
  insertionSortInfo,
  selectionSortInfo,
  mergeSortInfo,
  quickSortInfo,
  heapSortInfo,
  countingSortInfo,
  radixSortInfo,
];
