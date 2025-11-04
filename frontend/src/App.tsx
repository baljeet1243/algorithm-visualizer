/**
 * Main App Component - Modern Sleek Design
 * Root component with navigation and route handling
 */

import { useState } from 'react';
import { useAppStore } from './store/appState';
import SortingVisualizer from './components/SortingVisualizer';
import { GraphVisualizer } from './components/GraphVisualizer';
import { DataStructureVisualizer } from './components/DataStructureVisualizer';
import { algorithmMetadata, getAllCategories } from './algorithms';

function App() {
  const { currentCategory, currentAlgorithm, setCategory, setAlgorithm } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const categories = getAllCategories();
  const algorithmsInCategory = algorithmMetadata.filter(
    (algo) => algo.category === currentCategory
  );

  const categoryIcons: Record<string, string> = {
    sorting: '📊',
    graph: '🕸️',
    'data-structure': '🗂️',
  };

  const categoryNames: Record<string, string> = {
    sorting: 'Sorting',
    graph: 'Graphs',
    'data-structure': 'Data Structures',
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-80' : 'w-16'
        } bg-[#0f172a] border-r border-[#1e293b] transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-[#1e293b] flex items-center justify-between min-h-[72px]">
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Algorithm Visualizer
              </h1>
              <p className="text-xs text-slate-500 mt-1">Interactive Learning Platform</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2.5 hover:bg-[#1e293b] rounded-lg text-slate-400 hover:text-white transition-all duration-200 ${
              !sidebarOpen && 'mx-auto'
            }`}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {sidebarOpen ? (
                <path d="M15 18l-6-6 6-6" />
              ) : (
                <path d="M9 18l6-6-6-6" />
              )}
            </svg>
          </button>
        </div>

        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto p-4">
            {/* Category Selection */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
                Categories
              </h3>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat as any)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 group ${
                      currentCategory === cat
                        ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-500/20'
                        : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
                    }`}
                  >
                    <span className="text-2xl">{categoryIcons[cat]}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{categoryNames[cat]}</div>
                      <div className={`text-xs mt-0.5 ${
                        currentCategory === cat ? 'text-blue-100' : 'text-slate-500'
                      }`}>
                        {algorithmMetadata.filter(a => a.category === cat).length} algorithms
                      </div>
                    </div>
                    {currentCategory === cat && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Algorithm Selection */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
                Algorithms
              </h3>
              <div className="space-y-1">
                {algorithmsInCategory.map((algo) => (
                  <button
                    key={algo.id}
                    onClick={() => setAlgorithm(algo.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      currentAlgorithm === algo.id
                        ? 'bg-[#1e293b] text-white border-l-2 border-[#3b82f6] shadow-sm'
                        : 'text-slate-400 hover:bg-[#1e293b]/50 hover:text-white border-l-2 border-transparent'
                    }`}
                  >
                    <div className="font-medium text-sm">{algo.name}</div>
                    <div className={`text-xs mt-1 flex items-center gap-2 ${
                      currentAlgorithm === algo.id ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <span>⏱️ {algo.timeComplexity.average}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {!sidebarOpen && (
          <div className="flex-1 flex flex-col items-center gap-3 py-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat as any)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  currentCategory === cat
                    ? 'bg-[#3b82f6] text-white shadow-lg'
                    : 'text-slate-400 hover:bg-[#1e293b] hover:text-white'
                }`}
                title={categoryNames[cat]}
              >
                <span className="text-2xl">{categoryIcons[cat]}</span>
              </button>
            ))}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentCategory === 'sorting' && <SortingVisualizer />}
        {currentCategory === 'graph' && <GraphVisualizer />}
        {currentCategory === 'data-structure' && <DataStructureVisualizer />}
      </main>
    </div>
  );
}

export default App;
