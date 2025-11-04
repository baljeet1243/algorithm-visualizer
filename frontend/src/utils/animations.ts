/**
 * Animation Engine - Core utilities for step-by-step algorithm execution
 * Handles timing, playback control, and step iteration
 */

import { AlgorithmStep, AlgorithmGenerator } from '../types';

/**
 * Calculates delay in ms based on speed setting (1-10)
 * Speed 1 = 2000ms (slow), Speed 10 = 50ms (fast)
 */
export function calculateDelay(speed: number): number {
  const minDelay = 50;
  const maxDelay = 2000;
  const normalizedSpeed = Math.max(1, Math.min(10, speed));
  return maxDelay - ((normalizedSpeed - 1) * (maxDelay - minDelay)) / 9;
}

/**
 * Sleep utility for async delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Algorithm Step Iterator
 * Manages stepping through algorithm execution with pause/resume
 */
export class AlgorithmRunner {
  private generator: AlgorithmGenerator | null = null;
  private steps: AlgorithmStep[] = [];
  private currentIndex = 0;
  private isRunning = false;
  private isPaused = false;
  private speed = 5;
  private onStepCallback: ((step: AlgorithmStep, index: number) => void) | null = null;
  private onCompleteCallback: (() => void) | null = null;
  private abortController: AbortController | null = null;

  constructor(
    generator: AlgorithmGenerator,
    onStep?: (step: AlgorithmStep, index: number) => void,
    onComplete?: () => void
  ) {
    this.generator = generator;
    if (onStep) this.onStepCallback = onStep;
    if (onComplete) this.onCompleteCallback = onComplete;
    this.collectAllSteps();
  }

  /**
   * Pre-collect all steps for full control over playback
   */
  private collectAllSteps(): void {
    if (!this.generator) return;
    
    this.steps = [];
    let result = this.generator.next();
    
    while (!result.done) {
      this.steps.push(result.value);
      result = this.generator.next();
    }
  }

  /**
   * Start or resume execution
   */
  async play(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.isPaused = false;
    this.abortController = new AbortController();

    while (this.currentIndex < this.steps.length && !this.abortController.signal.aborted) {
      if (this.isPaused) {
        await sleep(100);
        continue;
      }

      const step = this.steps[this.currentIndex];
      
      if (this.onStepCallback) {
        this.onStepCallback(step, this.currentIndex);
      }

      this.currentIndex++;

      if (this.currentIndex < this.steps.length) {
        await sleep(calculateDelay(this.speed));
      }
    }

    this.isRunning = false;

    if (this.currentIndex >= this.steps.length && this.onCompleteCallback) {
      this.onCompleteCallback();
    }
  }

  /**
   * Pause execution
   */
  pause(): void {
    this.isPaused = true;
  }

  /**
   * Resume execution
   */
  resume(): void {
    this.isPaused = false;
  }

  /**
   * Stop and reset
   */
  stop(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.isRunning = false;
    this.isPaused = false;
  }

  /**
   * Reset to beginning
   */
  reset(): void {
    this.stop();
    this.currentIndex = 0;
  }

  /**
   * Step forward one step
   */
  stepForward(): AlgorithmStep | null {
    if (this.currentIndex >= this.steps.length) return null;
    
    const step = this.steps[this.currentIndex];
    
    if (this.onStepCallback) {
      this.onStepCallback(step, this.currentIndex);
    }
    
    this.currentIndex++;
    return step;
  }

  /**
   * Step backward one step
   */
  stepBackward(): AlgorithmStep | null {
    if (this.currentIndex <= 0) return null;
    
    this.currentIndex--;
    const step = this.steps[this.currentIndex];
    
    if (this.onStepCallback) {
      this.onStepCallback(step, this.currentIndex);
    }
    
    return step;
  }

  /**
   * Get current step index
   */
  get currentStep(): number {
    return this.currentIndex;
  }

  /**
   * Get total number of steps
   */
  get totalSteps(): number {
    return this.steps.length;
  }

  /**
   * Jump to specific step
   */
  jumpToStep(index: number): AlgorithmStep | null {
    if (index < 0 || index >= this.steps.length) return null;
    
    this.currentIndex = index;
    const step = this.steps[index];
    
    if (this.onStepCallback) {
      this.onStepCallback(step, index);
    }
    
    return step;
  }

  /**
   * Set playback speed (1-10)
   */
  setSpeed(speed: number): void {
    this.speed = Math.max(1, Math.min(10, speed));
  }

  /**
   * Register callback for each step
   */
  onStep(callback: (step: AlgorithmStep, index: number) => void): void {
    this.onStepCallback = callback;
  }

  /**
   * Register callback for completion
   */
  onComplete(callback: () => void): void {
    this.onCompleteCallback = callback;
  }

  /**
   * Get total number of steps
   */
  getTotalSteps(): number {
    return this.steps.length;
  }

  /**
   * Get current step index
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Get all steps (for timeline scrubbing)
   */
  getAllSteps(): AlgorithmStep[] {
    return this.steps;
  }

  /**
   * Check if running
   */
  getIsRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Check if paused
   */
  getIsPaused(): boolean {
    return this.isPaused;
  }
}

/**
 * Batch Runner - Run multiple algorithms in parallel for comparison
 */
export class BatchAlgorithmRunner {
  private runners: Map<string, AlgorithmRunner> = new Map();

  addRunner(id: string, generator: AlgorithmGenerator): void {
    this.runners.set(id, new AlgorithmRunner(generator));
  }

  async playAll(): Promise<void> {
    const promises = Array.from(this.runners.values()).map(runner => runner.play());
    await Promise.all(promises);
  }

  pauseAll(): void {
    this.runners.forEach(runner => runner.pause());
  }

  stopAll(): void {
    this.runners.forEach(runner => runner.stop());
  }

  resetAll(): void {
    this.runners.forEach(runner => runner.reset());
  }

  getRunner(id: string): AlgorithmRunner | undefined {
    return this.runners.get(id);
  }
}
