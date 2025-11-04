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

#### 3. Setup Backend (Optional - for AI explanations)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Backend will run at `http://localhost:8000`

## 📁 Project Structure

```
algorithm-visualizer/
├── frontend/
│   ├── src/
│   │   ├── algorithms/           # Algorithm implementations
│   │   │   ├── sorting/          # Bubble, Quick, Merge, etc.
│   │   │   ├── graphs/           # BFS, DFS, Dijkstra, A*, MST
│   │   │   ├── structures/       # Stack, Queue, BST, Heap
│   │   │   └── index.ts          # Algorithm registry
│   │   ├── components/           # React components
│   │   │   ├── SortingVisualizer.tsx
│   │   │   ├── ControlsPanel.tsx
│   │   │   └── ...
│   │   ├── utils/                # Utilities & animation engine
│   │   │   ├── animations.ts     # AlgorithmRunner class
│   │   │   └── helpers.ts
│   │   ├── store/                # Zustand state management
│   │   ├── types/                # TypeScript definitions
│   │   └── App.tsx
│   └── package.json
├── backend/                       # Optional FastAPI backend
│   ├── main.py
│   ├── routers/
│   └── requirements.txt
├── IMPLEMENTATION_GUIDE.md        # Detailed implementation docs
└── README.md
```

## 🎓 How It Works

### Generator Pattern for Algorithms

All algorithms use JavaScript generators that `yield` visualization steps:

```typescript
export function* bubbleSort(array: number[]): Generator<AlgorithmStep> {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      // Yield comparison step for visualization
      yield {
        array: [...array],
        comparing: [j, j + 1],
        message: `Comparing ${array[j]} and ${array[j + 1]}`
      };

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        
        // Yield swap step
        yield {
          array: [...array],
          swapping: [j, j + 1],
          message: `Swapped ${array[j + 1]} and ${array[j]}`
        };
      }
    }
  }
}
```

### Algorithm Runner

The `AlgorithmRunner` class manages step-by-step execution:

```typescript
const runner = new AlgorithmRunner(generator);

runner.onStep((step, index) => {
  // Update visualization
  updateState(step);
});

runner.setSpeed(5);
await runner.play();      // Play
runner.pause();           // Pause
runner.stepForward();     // Step forward
runner.stepBackward();    // Step backward
runner.reset();           // Reset
```

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

**That's it!** Your algorithm is now available in the UI.

## 📚 Documentation

- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Comprehensive architecture, roadmap, and implementation details
- **[API Documentation](./backend/README.md)** - Backend API reference (if using FastAPI)

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

## 🎯 Roadmap

### Phase 1: Core Functionality ✅
- [x] Sorting algorithms with visualization
- [x] Graph algorithms (BFS, DFS, Dijkstra, A*, MST)
- [x] Data structures (Stack, Queue, LinkedList, BST, Heap)
- [x] Interactive controls (play/pause/step/reset)
- [x] Speed control and statistics

### Phase 2: Enhanced Visualization ✅
- [x] Graph Visualizer with interactive editing
- [x] Data Structure Visualizer with C++ code
- [x] Code highlighting synchronized with execution
- [x] Real-time step-by-step visualization
- [x] Legend and color-coded states

### Phase 3: Advanced Features 🔮
- [ ] Algorithm comparison mode (side-by-side)
- [ ] Custom input (user-defined data)
- [ ] Export visualizations (GIF/video)
- [ ] Save/load configurations (JSON)
- [ ] Mobile-optimized controls
- [ ] Accessibility improvements

### Phase 4: AI Integration 🤖
- [ ] OpenAI/Claude API integration
- [ ] Step-by-step explanations
- [ ] Interactive Q&A
- [ ] Complexity analysis
- [ ] Hint system for learning

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

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

## 🙏 Acknowledgments

- Algorithm implementations inspired by classic computer science textbooks
- Visualization concepts from [VisuAlgo](https://visualgo.net/) and [Algorithm Visualizer](https://algorithm-visualizer.org/)
- Built with modern web technologies

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/balljeet1243/algorithm-visualizer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/balljeet1243/algorithm-visualizer/discussions)

## 🌟 Show Your Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing code
- 📢 Sharing with others

## 📊 Status

**Current Version**: 1.0.0 Beta  
**Last Updated**: November 2025  
**Status**: Active Development

### Implemented Features
- ✅ 8 Sorting Algorithms (Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix)
- ✅ 6 Graph Algorithms (BFS, DFS, Dijkstra, A*, Prim, Kruskal)
- ✅ 5 Data Structures (Stack, Queue, Linked List, BST, Heap)
- ✅ Full Animation Engine with Generator Pattern
- ✅ Interactive Controls (Play, Pause, Step, Speed)
- ✅ Code Viewer with Syntax Highlighting
- ✅ Real-time Code Line Synchronization
- ✅ TypeScript Strict Mode
- ✅ Responsive Design
- ✅ Graph Editor with Custom Graphs
- ✅ Undirected Graph Support

### In Progress
- ⏳ Mobile optimization
- ⏳ Additional tree algorithms

### Planned
- 🔮 AI integration
- 🔮 Algorithm comparison
- 🔮 Export/import functionality
- 🔮 Tutorial mode

---

**Built with ❤️ by developers, for developers**

