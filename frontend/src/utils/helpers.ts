/**
 * Helper utilities for common operations
 */

import { ColorScheme } from '../types';

/**
 * Generate random array for sorting visualizations
 */
export function generateRandomArray(size: number, min = 10, max = 100): number[] {
  return Array.from({ length: size }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Check if array is sorted
 */
export function isSorted(array: number[]): boolean {
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] > array[i + 1]) return false;
  }
  return true;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Calculate distance between two points (for A* heuristic)
 */
export function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Default color scheme
 */
export const DEFAULT_COLOR_SCHEME: ColorScheme = {
  default: '#64748b',      // slate-500
  comparing: '#f97316',    // orange-500
  swapping: '#ef4444',     // red-500
  sorted: '#10b981',       // green-500
  active: '#3b82f6',       // blue-500
  visited: '#8b5cf6',      // purple-500
  path: '#f59e0b',         // amber-500
  highlight: '#ec4899',    // pink-500
};

/**
 * Get color for visualization state
 */
export function getBarColor(
  index: number,
  comparing: number[],
  swapping: number[],
  sorted: number[],
  colorScheme: ColorScheme = DEFAULT_COLOR_SCHEME
): string {
  if (sorted.includes(index)) return colorScheme.sorted;
  if (swapping.includes(index)) return colorScheme.swapping;
  if (comparing.includes(index)) return colorScheme.comparing;
  return colorScheme.default;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Map value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Create grid positions for graph nodes
 */
export function createGridLayout(
  nodeCount: number,
  width: number,
  height: number,
  padding = 50
): Array<{ x: number; y: number }> {
  const cols = Math.ceil(Math.sqrt(nodeCount));
  const rows = Math.ceil(nodeCount / cols);
  const cellWidth = (width - padding * 2) / cols;
  const cellHeight = (height - padding * 2) / rows;
  
  const positions: Array<{ x: number; y: number }> = [];
  
  for (let i = 0; i < nodeCount; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions.push({
      x: padding + col * cellWidth + cellWidth / 2,
      y: padding + row * cellHeight + cellHeight / 2,
    });
  }
  
  return positions;
}

/**
 * Create circular layout for graph nodes
 */
export function createCircularLayout(
  nodeCount: number,
  centerX: number,
  centerY: number,
  radius: number
): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = [];
  const angleStep = (2 * Math.PI) / nodeCount;
  
  for (let i = 0; i < nodeCount; i++) {
    const angle = i * angleStep - Math.PI / 2; // Start from top
    positions.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }
  
  return positions;
}

/**
 * Calculate tree node positions (for binary tree visualization)
 */
export function calculateTreeLayout(
  node: any,
  depth = 0,
  position = 0,
  positions: Map<string, { x: number; y: number }> = new Map(),
  horizontalSpacing = 60,
  verticalSpacing = 80
): Map<string, { x: number; y: number }> {
  if (!node) return positions;
  
  // Calculate position for current node
  const x = position * horizontalSpacing;
  const y = depth * verticalSpacing;
  positions.set(node.id, { x, y });
  
  // Calculate positions for children
  const offset = Math.pow(2, Math.max(0, 5 - depth));
  
  if (node.left) {
    calculateTreeLayout(
      node.left,
      depth + 1,
      position - offset,
      positions,
      horizontalSpacing,
      verticalSpacing
    );
  }
  
  if (node.right) {
    calculateTreeLayout(
      node.right,
      depth + 1,
      position + offset,
      positions,
      horizontalSpacing,
      verticalSpacing
    );
  }
  
  return positions;
}

/**
 * Parse algorithm complexity notation
 */
export function parseComplexity(complexity: string): string {
  return complexity
    .replace(/O\(/g, 'O(')
    .replace(/\^/g, '²')
    .replace(/log/g, 'log');
}

/**
 * Format time in ms to readable string
 */
export function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}m ${seconds}s`;
}

/**
 * Get algorithm category display name
 */
export function getCategoryDisplayName(category: string): string {
  const names: Record<string, string> = {
    sorting: 'Sorting Algorithms',
    graph: 'Graph Algorithms',
    tree: 'Tree Algorithms',
    'data-structure': 'Data Structures',
  };
  return names[category] || category;
}
