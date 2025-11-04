/**
 * QUEUE DATA STRUCTURE
 * FIFO (First In First Out)
 * Operations: Enqueue, Dequeue, Peek
 */

import { AlgorithmStep } from '../../types';

export interface QueueNode {
  id: string;
  value: number;
  index: number;
}

export class Queue {
  private items: QueueNode[] = [];
  private nextId = 0;

  enqueue(value: number): QueueNode {
    const node: QueueNode = {
      id: `queue-${this.nextId++}`,
      value,
      index: this.items.length
    };
    this.items.push(node);
    return node;
  }

  dequeue(): QueueNode | null {
    const node = this.items.shift() || null;
    // Update indices after dequeue
    this.items.forEach((item, idx) => {
      item.index = idx;
    });
    return node;
  }

  peek(): QueueNode | null {
    return this.items[0] || null;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  getItems(): QueueNode[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
    this.nextId = 0;
  }
}

export function* queueEnqueue(queue: Queue, value: number): Generator<AlgorithmStep, void, unknown> {
  let step = 0;

  yield {
    structure: { items: queue.getItems() },
    operation: 'enqueue',
    message: `Preparing to enqueue ${value}...`,
    step: step++,
  };

  const node = queue.enqueue(value);

  yield {
    structure: { items: queue.getItems(), highlight: [node.id] },
    operation: 'enqueue',
    message: `Enqueued ${value}. Queue size: ${queue.size()}`,
    step: step++,
  };
}

export function* queueDequeue(queue: Queue): Generator<AlgorithmStep, void, unknown> {
  let step = 0;

  if (queue.isEmpty()) {
    yield {
      structure: { items: queue.getItems() },
      operation: 'dequeue',
      message: 'Queue is empty! Cannot dequeue.',
      step: step++,
    };
    return;
  }

  const front = queue.peek()!;

  yield {
    structure: { items: queue.getItems(), highlight: [front.id] },
    operation: 'dequeue',
    message: `Dequeuing ${front.value} from front...`,
    step: step++,
  };

  queue.dequeue();

  yield {
    structure: { items: queue.getItems() },
    operation: 'dequeue',
    message: `Dequeued ${front.value}. Queue size: ${queue.size()}`,
    step: step++,
  };
}

export const queueInfo = {
  id: 'queue',
  name: 'Queue',
  category: 'data-structure' as const,
  description: 'FIFO (First In First Out) data structure. Supports enqueue, dequeue, and peek operations.',
  timeComplexity: {
    best: 'O(1)',
    average: 'O(1)',
    worst: 'O(1)',
  },
  spaceComplexity: 'O(n)',
};
