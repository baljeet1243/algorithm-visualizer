/**
 * STACK DATA STRUCTURE
 * LIFO (Last In First Out)
 * Operations: Push, Pop, Peek
 */

import { AlgorithmStep } from '../../types';

export interface StackNode {
  id: string;
  value: number;
  index: number;
}

export class Stack {
  private items: StackNode[] = [];
  private nextId = 0;

  push(value: number): StackNode {
    const node: StackNode = {
      id: `stack-${this.nextId++}`,
      value,
      index: this.items.length
    };
    this.items.push(node);
    return node;
  }

  pop(): StackNode | null {
    return this.items.pop() || null;
  }

  peek(): StackNode | null {
    return this.items[this.items.length - 1] || null;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  getItems(): StackNode[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
    this.nextId = 0;
  }
}

export function* stackPush(stack: Stack, value: number): Generator<AlgorithmStep, void, unknown> {
  let step = 0;

  yield {
    structure: { items: stack.getItems() },
    operation: 'push',
    message: `Preparing to push ${value} onto stack...`,
    step: step++,
  };

  const node = stack.push(value);

  yield {
    structure: { items: stack.getItems(), highlight: [node.id] },
    operation: 'push',
    message: `Pushed ${value} onto stack. Stack size: ${stack.size()}`,
    step: step++,
  };
}

export function* stackPop(stack: Stack): Generator<AlgorithmStep, void, unknown> {
  let step = 0;

  if (stack.isEmpty()) {
    yield {
      structure: { items: stack.getItems() },
      operation: 'pop',
      message: 'Stack is empty! Cannot pop.',
      step: step++,
    };
    return;
  }

  const top = stack.peek()!;

  yield {
    structure: { items: stack.getItems(), highlight: [top.id] },
    operation: 'pop',
    message: `Popping ${top.value} from stack...`,
    step: step++,
  };

  stack.pop();

  yield {
    structure: { items: stack.getItems() },
    operation: 'pop',
    message: `Popped ${top.value}. Stack size: ${stack.size()}`,
    step: step++,
  };
}

export const stackInfo = {
  id: 'stack',
  name: 'Stack',
  category: 'data-structure' as const,
  description: 'LIFO (Last In First Out) data structure. Supports push, pop, and peek operations.',
  timeComplexity: {
    best: 'O(1)',
    average: 'O(1)',
    worst: 'O(1)',
  },
  spaceComplexity: 'O(n)',
};
