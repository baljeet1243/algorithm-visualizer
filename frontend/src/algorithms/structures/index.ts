/**
 * Data Structures Index
 * Exports all data structure implementations and their metadata
 */

export { Stack, stackPush, stackPop, stackInfo } from './stack';
export { Queue, queueEnqueue, queueDequeue, queueInfo } from './queue';
export { LinkedList, linkedListInsert, linkedListSearch, linkedListReverse, linkedListInfo } from './linkedList';
export { BST, bstInsert, bstSearch, bstInorderTraversal, bstPreorderTraversal, bstPostorderTraversal, bstInfo } from './bst';
export { MinHeap, heapInsert, heapExtractMin, heapInfo } from './heap';

import { stackInfo } from './stack';
import { queueInfo } from './queue';
import { linkedListInfo } from './linkedList';
import { bstInfo } from './bst';
import { heapInfo } from './heap';

export const dataStructures = [
  stackInfo,
  queueInfo,
  linkedListInfo,
  bstInfo,
  heapInfo,
];
