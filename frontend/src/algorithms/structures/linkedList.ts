/**
 * LINKED LIST DATA STRUCTURE
 * Operations: Insert, Delete, Search, Reverse
 */

import { AlgorithmStep } from '../../types';

export interface LinkedListNode {
  id: string;
  value: number;
  next: LinkedListNode | null;
}

export class LinkedList {
  head: LinkedListNode | null = null;
  private nextId = 0;

  // Insert at end
  insert(value: number): LinkedListNode {
    const newNode: LinkedListNode = {
      id: `node-${this.nextId++}`,
      value,
      next: null
    };

    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }

    return newNode;
  }

  // Insert at beginning
  insertFront(value: number): LinkedListNode {
    const newNode: LinkedListNode = {
      id: `node-${this.nextId++}`,
      value,
      next: this.head
    };
    this.head = newNode;
    return newNode;
  }

  // Delete node with value
  delete(value: number): LinkedListNode | null {
    if (!this.head) return null;

    if (this.head.value === value) {
      const deleted = this.head;
      this.head = this.head.next;
      return deleted;
    }

    let current = this.head;
    while (current.next && current.next.value !== value) {
      current = current.next;
    }

    if (current.next) {
      const deleted = current.next;
      current.next = current.next.next;
      return deleted;
    }

    return null;
  }

  // Search for node
  search(value: number): LinkedListNode | null {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }

  // Reverse the list
  reverse(): void {
    let prev: LinkedListNode | null = null;
    let current = this.head;
    let next: LinkedListNode | null = null;

    while (current) {
      next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }

    this.head = prev;
  }

  // Get all nodes as array
  toArray(): LinkedListNode[] {
    const result: LinkedListNode[] = [];
    let current = this.head;
    while (current) {
      result.push(current);
      current = current.next;
    }
    return result;
  }

  clear(): void {
    this.head = null;
    this.nextId = 0;
  }
}

export function* linkedListInsert(list: LinkedList, value: number): Generator<AlgorithmStep, void, unknown> {
  let step = 0;

  yield {
    structure: { head: list.head, nodes: list.toArray() },
    operation: 'insert',
    message: `Inserting ${value} at end of list...`,
    step: step++,
  };

  if (!list.head) {
    const newNode = list.insert(value);
    yield {
      structure: { head: list.head, nodes: list.toArray(), highlight: [newNode.id] },
      operation: 'insert',
      message: `Inserted ${value} as first node`,
      step: step++,
    };
    return;
  }

  // Traverse to end
  let current = list.head;
  let nodes = list.toArray();
  let index = 0;
  
  while (current.next) {
    yield {
      structure: { head: list.head, nodes, highlight: [current.id] },
      operation: 'insert',
      message: `Traversing... at node ${current.value}`,
      step: step++,
    };
    current = current.next;
    index++;
  }

  yield {
    structure: { head: list.head, nodes, highlight: [current.id] },
    operation: 'insert',
    message: `Found end of list at node ${current.value}`,
    step: step++,
  };

  const newNode = list.insert(value);
  nodes = list.toArray();

  yield {
    structure: { head: list.head, nodes, highlight: [newNode.id] },
    operation: 'insert',
    message: `Inserted ${value} at end. List size: ${nodes.length}`,
    step: step++,
  };
}

export function* linkedListSearch(list: LinkedList, value: number): Generator<AlgorithmStep, void, unknown> {
  let step = 0;
  let current = list.head;
  const nodes = list.toArray();

  yield {
    structure: { head: list.head, nodes },
    operation: 'search',
    message: `Searching for ${value}...`,
    step: step++,
  };

  while (current) {
    yield {
      structure: { head: list.head, nodes, highlight: [current.id] },
      operation: 'search',
      message: `Checking node with value ${current.value}`,
      step: step++,
    };

    if (current.value === value) {
      yield {
        structure: { head: list.head, nodes, highlight: [current.id] },
        operation: 'search',
        message: `Found ${value}!`,
        step: step++,
      };
      return;
    }

    current = current.next;
  }

  yield {
    structure: { head: list.head, nodes },
    operation: 'search',
    message: `${value} not found in list`,
    step: step++,
  };
}

export function* linkedListReverse(list: LinkedList): Generator<AlgorithmStep, void, unknown> {
  let step = 0;
  let prev: LinkedListNode | null = null;
  let current = list.head;

  yield {
    structure: { head: list.head, nodes: list.toArray() },
    operation: 'reverse',
    message: 'Starting list reversal...',
    step: step++,
  };

  while (current) {
    const next = current.next;
    
    yield {
      structure: { head: list.head, nodes: list.toArray(), highlight: current ? [current.id] : [] },
      operation: 'reverse',
      message: `Reversing pointer at node ${current.value}`,
      step: step++,
    };

    current.next = prev;
    prev = current;
    current = next;
  }

  list.head = prev;

  yield {
    structure: { head: list.head, nodes: list.toArray() },
    operation: 'reverse',
    message: 'List reversed!',
    step: step++,
  };
}

export const linkedListInfo = {
  id: 'linked-list',
  name: 'Linked List',
  category: 'data-structure' as const,
  description: 'Linear data structure where each element points to the next. Supports insert, delete, search, and reverse.',
  timeComplexity: {
    best: 'O(1) insert at head',
    average: 'O(n)',
    worst: 'O(n)',
  },
  spaceComplexity: 'O(n)',
};
