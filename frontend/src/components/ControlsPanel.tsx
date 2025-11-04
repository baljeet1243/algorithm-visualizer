/**
 * ControlsPanel Component
 * Provides play/pause/reset controls and speed adjustment for algorithm visualization
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/appState';

interface ControlsPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward?: () => void;
  onStepBackward?: () => void;
  onGenerateNew?: () => void;
  isPlaying: boolean;
  canStepForward?: boolean;
  canStepBackward?: boolean;
  speed?: number;
  onSpeedChange?: (newSpeed: number) => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onGenerateNew,
  isPlaying,
  canStepForward = true,
  canStepBackward = true,
}) => {
  const { visualizationConfig, setSpeed } = useAppStore();
  const [localSpeed, setLocalSpeed] = useState(visualizationConfig.speed);

  const handleSpeedChange = (newSpeed: number) => {
    setLocalSpeed(newSpeed);
    setSpeed(newSpeed);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
      <div className="flex flex-col gap-4">
        {/* Main Controls */}
        <div className="flex items-center justify-center gap-3">
          {onStepBackward && (
            <button
              onClick={onStepBackward}
              disabled={!canStepBackward || isPlaying}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded-lg transition-colors"
              title="Step Backward"
            >
              ⏮ Step Back
            </button>
          )}

          {isPlaying ? (
            <button
              onClick={onPause}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
            >
              ⏸ Pause
            </button>
          ) : (
            <button
              onClick={onPlay}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              ▶ Play
            </button>
          )}

          <button
            onClick={onReset}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            🔄 Reset
          </button>

          {onStepForward && (
            <button
              onClick={onStepForward}
              disabled={!canStepForward || isPlaying}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded-lg transition-colors"
              title="Step Forward"
            >
              Step Forward ⏭
            </button>
          )}

          {onGenerateNew && (
            <button
              onClick={onGenerateNew}
              disabled={isPlaying}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded-lg transition-colors"
            >
              🎲 Generate New
            </button>
          )}
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-4">
          <label className="text-slate-300 text-sm font-medium min-w-[60px]">
            Speed:
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={localSpeed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(localSpeed - 1) * 11.11}%, #334155 ${(localSpeed - 1) * 11.11}%, #334155 100%)`
            }}
          />
          <span className="text-slate-300 text-sm font-mono min-w-[30px]">
            {localSpeed}x
          </span>
        </div>

        {/* Speed Labels */}
        <div className="flex justify-between text-xs text-slate-500 px-2">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>
    </div>
  );
};

export default ControlsPanel;
