/**
 * MIN-HEAP DATA STRUCTURE
 * Complete binary tree where parent is smaller than children
 * Operations: Insert, Extract-Min, Heapify
 */

import { AlgorithmStep } from '../../types';

export interface HeapNode {
  value: number;
  index: number;
}

export class MinHeap {
  private heap: number[] = [];

  insert(value: number): void {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin(): number | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!;

    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);
    return min;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex] <= this.heap[index]) break;
      
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    while (true) {
      let smallest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (leftChild < this.heap.length && this.heap[leftChild] < this.heap[smallest]) {
        smallest = leftChild;
      }

      if (rightChild < this.heap.length && this.heap[rightChild] < this.heap[smallest]) {
        smallest = rightChild;
      }

      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }

  peek(): number | null {
    return this.heap[0] || null;
  }

  size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  getArray(): number[] {
    return [...this.heap];
  }

  getNodes(): HeapNode[] {
    return this.heap.map((value, index) => ({ value, index }));
  }

  clear(): void {
    this.heap = [];
  }
}

export function* heapInsert(heap: MinHeap, value: number): Generator<AlgorithmStep, void, unknown> {
  let step = 0;

  yield {
    structure: { nodes: heap.getNodes(), array: heap.getArray() },
    operation: 'insert',
    message: `Inserting ${value} into heap...`,
    step: step++,
  };

  const initialSize = heap.size();
  heap.insert(value);
  let currentIndex = initialSize;

  yield {
    structure: { nodes: heap.getNodes(), array: heap.getArray(), highlight: [currentIndex] },
    operation: 'insert',
    message: `Added ${value} at end of heap`,
    step: step++,
  };

  // Bubble up visualization
  while (currentIndex > 0) {
    const parentIndex = Math.floor((currentIndex - 1) / 2);
    const array = heap.getArray();

    yield {
      structure: { nodes: heap.getNodes(), array, highlight: [currentIndex, parentIndex] },
      operation: 'insert',
      message: `Comparing ${array[currentIndex]} with parent ${array[parentIndex]}`,
      step: step++,
    };

    if (array[parentIndex] <= array[currentIndex]) {
      yield {
        structure: { nodes: heap.getNodes(), array },
        operation: 'insert',
        message: `Heap property satisfied. Insert complete.`,
        step: step++,
      };
      break;
    }

    currentIndex = parentIndex;
  }

  yield {
    structure: { nodes: heap.getNodes(), array: heap.getArray() },
    operation: 'insert',
    message: `Inserted ${value}. Heap size: ${heap.size()}`,
    step: step++,
  };
}

export function* heapExtractMin(heap: MinHeap): Generator<AlgorithmStep, void, unknown> {
  let step = 0;

  if (heap.isEmpty()) {
    yield {
      structure: { nodes: heap.getNodes(), array: heap.getArray() },
      operation: 'extract-min',
      message: 'Heap is empty! Cannot extract.',
      step: step++,
    };
    return;
  }

  const min = heap.peek()!;

  yield {
    structure: { nodes: heap.getNodes(), array: heap.getArray(), highlight: [0] },
    operation: 'extract-min',
    message: `Extracting minimum: ${min}`,
    step: step++,
  };

  const lastValue = heap.getArray()[heap.size() - 1];

  yield {
    structure: { nodes: heap.getNodes(), array: heap.getArray(), highlight: [0, heap.size() - 1] },
    operation: 'extract-min',
    message: `Swapping root with last element (${lastValue})`,
    step: step++,
  };

  heap.extractMin();

  if (heap.isEmpty()) {
    yield {
      structure: { nodes: heap.getNodes(), array: heap.getArray() },
      operation: 'extract-min',
      message: `Extracted ${min}. Heap is now empty.`,
      step: step++,
    };
    return;
  }

  // Bubble down visualization
  let currentIndex = 0;
  const array = heap.getArray();

  while (true) {
    const leftChild = 2 * currentIndex + 1;
    const rightChild = 2 * currentIndex + 2;

    if (leftChild >= array.length) break;

    const indices = [currentIndex];
    if (leftChild < array.length) indices.push(leftChild);
    if (rightChild < array.length) indices.push(rightChild);

    yield {
      structure: { nodes: heap.getNodes(), array, highlight: indices },
      operation: 'extract-min',
      message: `Bubbling down from index ${currentIndex}`,
      step: step++,
    };

    let smallest = currentIndex;
    if (leftChild < array.length && array[leftChild] < array[smallest]) {
      smallest = leftChild;
    }
    if (rightChild < array.length && array[rightChild] < array[smallest]) {
      smallest = rightChild;
    }

    if (smallest === currentIndex) break;
    currentIndex = smallest;
  }

  yield {
    structure: { nodes: heap.getNodes(), array: heap.getArray() },
    operation: 'extract-min',
    message: `Extracted ${min}. Heap size: ${heap.size()}`,
    step: step++,
  };
}

export const heapInfo = {
  id: 'min-heap',
  name: 'Min-Heap',
  category: 'data-structure' as const,
  description: 'Complete binary tree where parent is smaller than children. Efficient for priority queue operations.',
  timeComplexity: {
    best: 'O(1) peek',
    average: 'O(log n)',
    worst: 'O(log n)',
  },
  spaceComplexity: 'O(n)',
};
