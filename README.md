# 🎨 Algorithm Visualizer

A modern, interactive web application for visualizing algorithms and data structures with step-by-step execution, built with React, TypeScript, and Vite.

![Algorithm Visualizer](https://img.shields.io/badge/status-ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🔄 Sorting Algorithms
- **Bubble Sort** - O(n²) comparison-based algorithm
- **Insertion Sort** - O(n²) builds sorted array incrementally
- **Selection Sort** - O(n²) selects minimum repeatedly
- **Merge Sort** - O(n log n) divide and conquer
- **Quick Sort** - O(n log n) partition-based sorting

### 🕸️ Graph Algorithms
- **BFS** - Breadth-First Search for level-order traversal
- **DFS** - Depth-First Search with backtracking
- **Dijkstra's Algorithm** - Shortest path with non-negative weights
- **A\* Algorithm** - Heuristic-guided pathfinding
- **Prim's Algorithm** - Minimum Spanning Tree
- **Kruskal's Algorithm** - MST with Union-Find

### 🗂️ Data Structures
- **Stack** - LIFO with push/pop operations
- **Queue** - FIFO with enqueue/dequeue operations
- **Linked List** - Insert, search, reverse operations
- **Binary Search Tree** - Insert, search, traversals
- **Min-Heap** - Insert and extract-min with heapify

### 🎮 Interactive Controls
- ▶️ Play/Pause execution
- ⏭️ Step forward/backward through algorithm
- 🎲 Generate random input data
- 🔄 Reset to initial state
- ⚡ Speed control (1x - 10x)
- 📊 Real-time statistics (comparisons, swaps, time)

### 🎯 Key Capabilities
- **Generator-based algorithms** for pausable execution
- **Type-safe TypeScript** throughout
- **Responsive design** with TailwindCSS
- **Smooth animations** with Framer Motion
- **Extensible architecture** - easily add new algorithms
- **Optional AI explanations** (FastAPI backend)

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Python** 3.8+ (optional, for backend AI features)

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd algorithm-visualizer
```

#### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

The application will open at `http://localhost:3000`
Backend will run at `http://localhost:8000`

## 🔧 Adding a New Algorithm

### Step 1: Create Algorithm File

```typescript
// frontend/src/algorithms/sorting/heapSort.ts
export function* heapSort(inputArray: number[]): Generator<AlgorithmStep> {
  // Implementation with yield statements
  yield {
    array: [...array],
    message: 'Starting Heap Sort...'
  };
  // ... algorithm logic
}

export const heapSortInfo = {
  id: 'heap-sort',
  name: 'Heap Sort',
  category: 'sorting' as const,
  description: 'Efficient sorting using binary heap',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
  },
  spaceComplexity: 'O(1)',
};
```

### Step 2: Register Algorithm

```typescript
// frontend/src/algorithms/sorting/index.ts
export { heapSort, heapSortInfo } from './heapSort';

export const sortingAlgorithms = [
  // ... existing
  heapSortInfo,
];
```

### Step 3: Add to Registry

```typescript
// frontend/src/algorithms/index.ts
export const algorithmRegistry = {
  sorting: {
    // ... existing
    'heap-sort': sorting.heapSort,
  },
};
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management

### Backend (Optional)
- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **OpenAI/Claude API** - AI explanations (optional)

Contributions are welcome

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Implement your algorithm/feature following existing patterns
4. Commit your changes (`git commit -m 'Add AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

### Contribution Guidelines

- Follow existing code style and patterns
- Use TypeScript with strict types
- Write generator functions that yield visualization steps
- Include algorithm metadata (name, description, complexity)
- Test thoroughly with different inputs
- Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by developers, for developers**

