/**
 * SortingVisualizer Component
 * Visualizes sorting algorithms with animated bars
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appState';
import { getAlgorithm, getAlgorithmInfo } from '../algorithms';
import { AlgorithmRunner } from '../utils/animations';
import { generateRandomArray, getBarColor } from '../utils/helpers';
import ControlsPanel from './ControlsPanel';
import { AlgorithmStep } from '../types';

export const SortingVisualizer: React.FC = () => {
  const {
    sortingState,
    currentAlgorithm,
    visualizationConfig,
    updateSortingState,
    setSortingArray,
    algorithmRunner,
    setAlgorithmRunner,
  } = useAppStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const algorithmInfo = getAlgorithmInfo(currentAlgorithm);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (algorithmRunner) {
        algorithmRunner.stop();
      }
    };
  }, [algorithmRunner]);

  const handlePlay = async () => {
    if (!algorithmRunner) {
      // Create new runner
      const algorithmFn = getAlgorithm('sorting', currentAlgorithm);
      if (!algorithmFn) return;

      const generator = algorithmFn(sortingState.array);
      const runner = new AlgorithmRunner(generator);

      runner.setSpeed(visualizationConfig.speed);
      
      runner.onStep((step: AlgorithmStep, index: number) => {
        updateSortingState({
          array: step.array || sortingState.array,
          comparingIndices: step.comparing || [],
          swappingIndices: step.swapping || [],
          sortedIndices: step.sorted || [],
          comparisons: step.comparisons || 0,
          swaps: step.swaps || 0,
          message: step.message || '',
          currentStep: index,
          totalSteps: runner.getTotalSteps(),
        });
      });

      runner.onComplete(() => {
        setIsPlaying(false);
        updateSortingState({ running: false });
      });

      setAlgorithmRunner(runner);
      setIsPlaying(true);
      updateSortingState({ running: true });
      
      await runner.play();
    } else {
      // Resume existing runner
      setIsPlaying(true);
      updateSortingState({ running: true, paused: false });
      await algorithmRunner.play();
    }
  };

  const handlePause = () => {
    if (algorithmRunner) {
      algorithmRunner.pause();
      setIsPlaying(false);
      updateSortingState({ running: false, paused: true });
    }
  };

  const handleReset = () => {
    if (algorithmRunner) {
      algorithmRunner.stop();
      setAlgorithmRunner(null);
    }
    setIsPlaying(false);
    setSortingArray([...sortingState.originalArray]);
    updateSortingState({
      running: false,
      paused: false,
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      comparisons: 0,
      swaps: 0,
      message: '',
      currentStep: 0,
    });
  };

  const handleGenerateNew = () => {
    handleReset();
    const newArray = generateRandomArray(20, 10, 100);
    setSortingArray(newArray);
  };

  const handleStepForward = () => {
    if (!algorithmRunner) {
      // Initialize runner first
      const algorithmFn = getAlgorithm('sorting', currentAlgorithm);
      if (!algorithmFn) return;

      const generator = algorithmFn(sortingState.array);
      const runner = new AlgorithmRunner(generator);
      runner.setSpeed(visualizationConfig.speed);
      
      runner.onStep((step: AlgorithmStep) => {
        updateSortingState({
          array: step.array || sortingState.array,
          comparingIndices: step.comparing || [],
          swappingIndices: step.swapping || [],
          sortedIndices: step.sorted || [],
          comparisons: step.comparisons || 0,
          swaps: step.swaps || 0,
          message: step.message || '',
        });
      });

      setAlgorithmRunner(runner);
      runner.stepForward();
    } else {
      algorithmRunner.stepForward();
    }
  };

  const handleStepBackward = () => {
    if (algorithmRunner) {
      algorithmRunner.stepBackward();
    }
  };

  const maxValue = Math.max(...sortingState.array);
  const containerHeight = 400;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          {algorithmInfo?.name || 'Sorting Algorithm'}
        </h2>
        <p className="text-slate-400">{algorithmInfo?.description}</p>
      </div>

      {/* Algorithm Info */}
      {algorithmInfo && (
        <div className="bg-slate-800 rounded-lg p-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-slate-400 mb-1">Best Case</div>
            <div className="text-green-400 font-mono">{algorithmInfo.timeComplexity.best}</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400 mb-1">Average Case</div>
            <div className="text-yellow-400 font-mono">{algorithmInfo.timeComplexity.average}</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400 mb-1">Worst Case</div>
            <div className="text-red-400 font-mono">{algorithmInfo.timeComplexity.worst}</div>
          </div>
        </div>
      )}

      {/* Visualization Area */}
      <div
        ref={containerRef}
        className="bg-slate-900 rounded-lg p-8 relative"
        style={{ height: containerHeight + 80 }}
      >
        <div className="flex items-end justify-center gap-1 h-full">
          {sortingState.array.map((value, index) => {
            const height = (value / maxValue) * containerHeight;
            const barColor = getBarColor(
              index,
              sortingState.comparingIndices,
              sortingState.swappingIndices,
              sortingState.sortedIndices,
              visualizationConfig.colorScheme
            );

            return (
              <motion.div
                key={`bar-${index}`}
                className="flex-1 max-w-[50px] bar-transition"
                style={{
                  height: `${height}px`,
                  backgroundColor: barColor,
                }}
                initial={{ height: 0 }}
                animate={{ height: `${height}px` }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-xs text-white text-center mt-1">
                  {value}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      {visualizationConfig.showStats && (
        <div className="bg-slate-800 rounded-lg p-4 grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-slate-400 text-sm">Comparisons</div>
            <div className="text-2xl font-bold text-orange-400">{sortingState.comparisons}</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm">Swaps</div>
            <div className="text-2xl font-bold text-red-400">{sortingState.swaps}</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm">Array Size</div>
            <div className="text-2xl font-bold text-blue-400">{sortingState.array.length}</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm">Progress</div>
            <div className="text-2xl font-bold text-green-400">
              {sortingState.totalSteps > 0
                ? `${Math.round((sortingState.currentStep / sortingState.totalSteps) * 100)}%`
                : '0%'}
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      {sortingState.message && (
        <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-3 text-center">
          <p className="text-blue-200">{sortingState.message}</p>
        </div>
      )}

      {/* Controls */}
      <ControlsPanel
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        onStepForward={handleStepForward}
        onStepBackward={handleStepBackward}
        onGenerateNew={handleGenerateNew}
        isPlaying={isPlaying}
        canStepForward={!algorithmRunner || algorithmRunner.getCurrentIndex() < algorithmRunner.getTotalSteps()}
        canStepBackward={!!algorithmRunner && algorithmRunner.getCurrentIndex() > 0}
      />
    </div>
  );
};

export default SortingVisualizer;
