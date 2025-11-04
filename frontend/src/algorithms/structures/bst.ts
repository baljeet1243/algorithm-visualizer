/**
 * BINARY SEARCH TREE (BST)
 * Operations: Insert, Search, Delete, Traverse (Inorder, Preorder, Postorder)
 */

import { AlgorithmStep, TreeNode } from '../../types';

export class BST {
  root: TreeNode | null = null;
  private nextId = 0;

  insert(value: number): TreeNode {
    const newNode: TreeNode = {
      id: `bst-${this.nextId++}`,
      value,
      left: null,
      right: null
    };

    if (!this.root) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }

    return newNode;
  }

  private insertNode(node: TreeNode, newNode: TreeNode): void {
    if (newNode.value < node.value) {
      if (!node.left) {
        node.left = newNode;
        newNode.parent = node;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (!node.right) {
        node.right = newNode;
        newNode.parent = node;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }

  search(value: number): TreeNode | null {
    return this.searchNode(this.root, value);
  }

  private searchNode(node: TreeNode | null, value: number): TreeNode | null {
    if (!node) return null;
    if (value === node.value) return node;
    if (value < node.value) return this.searchNode(node.left, value);
    return this.searchNode(node.right, value);
  }

  delete(value: number): TreeNode | null {
    let deletedNode: TreeNode | null = null;
    this.root = this.deleteNode(this.root, value, (node) => { deletedNode = node; });
    return deletedNode;
  }

  private deleteNode(node: TreeNode | null, value: number, onDelete: (node: TreeNode) => void): TreeNode | null {
    if (!node) return null;

    if (value < node.value) {
      node.left = this.deleteNode(node.left, value, onDelete);
    } else if (value > node.value) {
      node.right = this.deleteNode(node.right, value, onDelete);
    } else {
      onDelete(node);

      // Node with no children
      if (!node.left && !node.right) {
        return null;
      }

      // Node with one child
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Node with two children - find inorder successor
      const minRight = this.findMin(node.right);
      node.value = minRight.value;
      node.id = minRight.id;
      node.right = this.deleteNode(node.right, minRight.value, () => {});
    }

    return node;
  }

  private findMin(node: TreeNode): TreeNode {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  clear(): void {
    this.root = null;
    this.nextId = 0;
  }
}

export function* bstInsert(bst: BST, value: number): Generator<AlgorithmStep, void, unknown> {
  let step = 0;

  yield {
    tree: bst.root,
    highlightNodes: [],
    message: `Inserting ${value} into BST...`,
    step: step++,
  };

  if (!bst.root) {
    const newNode = bst.insert(value);
    yield {
      tree: bst.root,
      highlightNodes: [newNode.id],
      message: `Inserted ${value} as root`,
      step: step++,
    };
    return;
  }

  // Traverse to find insertion point
  let current: TreeNode | null = bst.root;
  const path: string[] = [];

  while (current) {
    path.push(current.id);
    
    yield {
      tree: bst.root,
      highlightNodes: path,
      message: `Comparing ${value} with ${current.value}`,
      step: step++,
    };

    if (value < current.value) {
      if (!current.left) {
        break;
      }
      current = current.left;
    } else {
      if (!current.right) {
        break;
      }
      current = current.right;
    }
  }

  const newNode = bst.insert(value);
  path.push(newNode.id);

  yield {
    tree: bst.root,
    highlightNodes: path,
    message: `Inserted ${value}`,
    step: step++,
  };
}

export function* bstSearch(bst: BST, value: number): Generator<AlgorithmStep, void, unknown> {
  let step = 0;
  let current: TreeNode | null = bst.root;
  const path: string[] = [];

  yield {
    tree: bst.root,
    highlightNodes: [],
    message: `Searching for ${value}...`,
    step: step++,
  };

  while (current) {
    path.push(current.id);

    yield {
      tree: bst.root,
      highlightNodes: path,
      message: `Checking node ${current.value}`,
      step: step++,
    };

    if (value === current.value) {
      yield {
        tree: bst.root,
        highlightNodes: [current.id],
        message: `Found ${value}!`,
        step: step++,
      };
      return;
    }

    if (value < current.value) {
      current = current.left;
    } else {
      current = current.right;
    }
  }

  yield {
    tree: bst.root,
    highlightNodes: path,
    message: `${value} not found in BST`,
    step: step++,
  };
}

export function* bstInorderTraversal(node: TreeNode | null, order: string[] = []): Generator<AlgorithmStep, void, unknown> {
  let step = 0;

  if (!node) return;

  // Traverse left
  if (node.left) {
    yield* bstInorderTraversal(node.left, order);
  }

  // Visit current
  order.push(node.id);
  yield {
    tree: node,
    highlightNodes: [node.id],
    traversalOrder: [...order],
    message: `Visiting node ${node.value} (Inorder)`,
    step: step++,
  };

  // Traverse right
  if (node.right) {
    yield* bstInorderTraversal(node.right, order);
  }
}

export function* bstPreorderTraversal(node: TreeNode | null, order: string[] = []): Generator<AlgorithmStep, void, unknown> {
  let step = 0;

  if (!node) return;

  // Visit current
  order.push(node.id);
  yield {
    tree: node,
    highlightNodes: [node.id],
    traversalOrder: [...order],
    message: `Visiting node ${node.value} (Preorder)`,
    step: step++,
  };

  // Traverse left
  if (node.left) {
    yield* bstPreorderTraversal(node.left, order);
  }

  // Traverse right
  if (node.right) {
    yield* bstPreorderTraversal(node.right, order);
  }
}

export function* bstPostorderTraversal(node: TreeNode | null, order: string[] = []): Generator<AlgorithmStep, void, unknown> {
  let step = 0;

  if (!node) return;

  // Traverse left
  if (node.left) {
    yield* bstPostorderTraversal(node.left, order);
  }

  // Traverse right
  if (node.right) {
    yield* bstPostorderTraversal(node.right, order);
  }

  // Visit current
  order.push(node.id);
  yield {
    tree: node,
    highlightNodes: [node.id],
    traversalOrder: [...order],
    message: `Visiting node ${node.value} (Postorder)`,
    step: step++,
  };
}

export const bstInfo = {
  id: 'bst',
  name: 'Binary Search Tree',
  category: 'data-structure' as const,
  description: 'Binary tree where left child < parent < right child. Supports insert, search, delete, and traversals.',
  timeComplexity: {
    best: 'O(log n)',
    average: 'O(log n)',
    worst: 'O(n)',
  },
  spaceComplexity: 'O(n)',
};
