'use client';

import React from 'react';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  disabled?: boolean;
}

export function PlaybackControls({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  speed,
  onSpeedChange,
  disabled = false,
}: PlaybackControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-inner shadow-black/10">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={isPlaying ? onPause : onPlay}
          disabled={disabled}
          aria-pressed={isPlaying}
          className="h-9 w-9 rounded-full bg-violet-500 p-0 text-white shadow-lg shadow-violet-500/20 hover:bg-violet-400"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <Button
          size="sm"
          onClick={onReset}
          disabled={disabled}
          variant="outline"
          className="h-9 w-9 rounded-full border-slate-700 bg-slate-950/80 p-0 text-slate-200 shadow-none hover:bg-slate-900 hover:text-white"
          title="Reset to start"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-2.5 py-1">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Speed
        </span>
        <div className="flex gap-1">
          {[0.5, 1, 2].map((s) => (
            <Button
              key={s}
              size="sm"
              onClick={() => onSpeedChange(s)}
              disabled={disabled}
              aria-pressed={speed === s}
              className={`h-7 rounded-full px-2.5 text-[11px] font-medium ${
                speed === s
                  ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20 hover:bg-cyan-400'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {s}x
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
