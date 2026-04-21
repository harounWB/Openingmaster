'use client';

import React from 'react';
import { Game, PlayerColor, TrainingMode, DifficultyLevel } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TrainingPanelProps {
  game: Game;
  moveIndex: number;
  trainingMode: TrainingMode;
  playerColor: PlayerColor;
  message: string;
  isCorrect: boolean | null;
  expectedMove: string | null;
  difficulty?: DifficultyLevel;
  onModeChange: (mode: TrainingMode) => void;
  onColorChange: (color: PlayerColor) => void;
  onFlipBoard: () => void;
  onDifficultyChange?: (difficulty: DifficultyLevel) => void;
  onReset: () => void;
  onNavigateMove: (index: number) => void;
  onCompleteGame: () => void;
  isCompleted: boolean;
}

export function TrainingPanel({
  game,
  moveIndex,
  trainingMode,
  playerColor,
  message,
  isCorrect,
  expectedMove,
  difficulty = 'medium',
  onModeChange,
  onColorChange,
  onFlipBoard,
  onDifficultyChange,
  onReset,
  onNavigateMove,
  onCompleteGame,
  isCompleted,
}: TrainingPanelProps) {
  const moveCount = game.moves.length || 1;
  const moveProgressPercentage = Math.min(100, (moveIndex / moveCount) * 100);
  const isTrainMode = trainingMode === 'train';
  const messageTone =
    isCorrect === true
      ? 'border-emerald-900/40 bg-emerald-950/40 text-emerald-100'
      : isCorrect === false
        ? 'border-rose-900/40 bg-rose-950/40 text-rose-100'
        : 'border-slate-800 bg-slate-900/80 text-slate-200';

  return (
    <Card className="overflow-hidden border border-slate-800 bg-slate-950/80 p-3 shadow-xl shadow-black/10 sm:p-4">
      <div className="space-y-3">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Training panel
              </div>
              <div className="mt-1 text-sm font-semibold text-white sm:text-base">
                {game.white} vs {game.black}
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                {isTrainMode
                  ? 'Train the line move by move.'
                  : 'Review the line and comments.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-0.5 text-[11px] font-medium text-slate-200">
                {trainingMode === 'train' ? 'Train' : 'Explore'}
              </span>
              {isCompleted && (
                <span className="rounded-full border border-emerald-900/40 bg-emerald-950/40 px-2.5 py-0.5 text-[11px] font-medium text-emerald-200">
                  Complete
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-slate-500">
              <span>Progress</span>
              <span>{Math.round(moveProgressPercentage)}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-slate-300 transition-all"
                style={{ width: `${moveProgressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-1 shadow-inner shadow-black/20 sm:grid-cols-2">
          <Button
            size="sm"
            variant={trainingMode === 'train' ? 'default' : 'outline'}
            onClick={() => onModeChange('train')}
            aria-pressed={trainingMode === 'train'}
            className={
              trainingMode === 'train'
                ? 'h-9 border-cyan-400/30 bg-cyan-500/15 text-cyan-100 shadow-none hover:bg-cyan-500/20'
                : 'h-9 border-slate-700 bg-slate-950/80 text-slate-300 shadow-none hover:bg-slate-900 hover:text-white'
            }
          >
            Train
          </Button>
          <Button
            size="sm"
            variant={trainingMode === 'explore' ? 'default' : 'outline'}
            onClick={() => onModeChange('explore')}
            aria-pressed={trainingMode === 'explore'}
            className={
              trainingMode === 'explore'
                ? 'h-9 border-violet-400/30 bg-violet-500/15 text-violet-100 shadow-none hover:bg-violet-500/20'
                : 'h-9 border-slate-700 bg-slate-950/80 text-slate-300 shadow-none hover:bg-slate-900 hover:text-white'
            }
          >
            Explore
          </Button>
        </div>

        {trainingMode === 'explore' ? (
          <Button
            size="sm"
            variant="outline"
            onClick={onFlipBoard}
            className="h-9 w-full justify-start border-slate-700 bg-slate-950/80 px-3 text-slate-200 shadow-none hover:bg-slate-900 hover:text-white"
          >
            Flip board
          </Button>
        ) : (
          <div className="space-y-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-inner shadow-black/10">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Side
              </div>
              <span className="text-[11px] text-slate-400">Choose your side</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                size="sm"
                variant={playerColor === 'w' ? 'default' : 'outline'}
                onClick={() => onColorChange('w')}
                aria-pressed={playerColor === 'w'}
                className={
                  playerColor === 'w'
                    ? 'h-9 border-sky-400/30 bg-sky-500/15 text-sky-100 shadow-none hover:bg-sky-500/20'
                    : 'h-9 border-slate-700 bg-slate-950/80 text-slate-300 shadow-none hover:bg-slate-900 hover:text-white'
                }
              >
                Play white
              </Button>
              <Button
                size="sm"
                variant={playerColor === 'b' ? 'default' : 'outline'}
                onClick={() => onColorChange('b')}
                aria-pressed={playerColor === 'b'}
                className={
                  playerColor === 'b'
                    ? 'h-9 border-slate-200/30 bg-slate-100 text-slate-950 shadow-none hover:bg-white'
                    : 'h-9 border-slate-700 bg-slate-950/80 text-slate-300 shadow-none hover:bg-slate-900 hover:text-white'
                }
              >
                Play black
              </Button>
            </div>
          </div>
        )}

        {isTrainMode && onDifficultyChange && (
          <div className="space-y-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-inner shadow-black/10">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Difficulty
              </div>
              <span className="text-[11px] text-slate-400">Hint behavior changes with the selected level</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <Button
                  key={level}
                  size="sm"
                  onClick={() => onDifficultyChange(level)}
                  aria-pressed={difficulty === level}
                  className={`capitalize ${
                    difficulty === level
                      ? level === 'easy'
                        ? 'h-9 border-emerald-400/30 bg-emerald-500/15 text-emerald-100 shadow-none hover:bg-emerald-500/20'
                        : level === 'medium'
                          ? 'h-9 border-amber-400/30 bg-amber-500/15 text-amber-100 shadow-none hover:bg-amber-500/20'
                          : 'h-9 border-rose-400/30 bg-rose-500/15 text-rose-100 shadow-none hover:bg-rose-500/20'
                      : 'h-9 border-slate-700 bg-slate-950/80 text-slate-300 shadow-none hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  {level}
                </Button>
              ))}
            </div>
            <p className="text-[11px] leading-5 text-slate-400">
              {difficulty === 'easy' && 'Hints available.'}
              {difficulty === 'medium' && 'One hint at a time.'}
              {difficulty === 'hard' && 'No hints.'}
            </p>
          </div>
        )}

        <div
          className={`min-h-10 rounded-2xl border px-3 py-2 text-xs leading-5 shadow-sm ${messageTone}`}
        >
          {message || 'Feedback will appear here as you play.'}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            size="sm"
            onClick={onReset}
            variant="outline"
            className="h-9 border-slate-700 bg-slate-950/80 text-slate-100 shadow-none hover:bg-slate-900 hover:text-white"
          >
            Reset line
          </Button>
          <Button
            size="sm"
            onClick={onCompleteGame}
            className={
              isCompleted
              ? 'h-9 border border-emerald-400/30 bg-emerald-500/15 text-emerald-100 shadow-none hover:bg-emerald-500/20'
              : 'h-9 border border-slate-700 bg-slate-950/80 text-slate-100 shadow-none hover:bg-slate-900 hover:text-white'
            }
          >
            {isCompleted ? 'Completed' : 'Mark complete'}
          </Button>
        </div>

        {game.moves.length > 0 && trainingMode === 'explore' && (
          <div className="space-y-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-inner shadow-black/10">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Move line
              </div>
              <span className="text-[11px] text-slate-400">
                Jump to any move
              </span>
            </div>
            <div className="max-h-28 overflow-y-auto pr-1">
              <div className="flex flex-wrap gap-1.5">
                {game.moves.map((move, index) => (
                  <button
                    key={index}
                    onClick={() => onNavigateMove(index + 1)}
                    aria-current={index === moveIndex ? 'step' : undefined}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                      index < moveIndex
                        ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                        : index === moveIndex
                          ? 'border-violet-400/40 bg-violet-500/15 text-violet-100 shadow-sm shadow-violet-500/10'
                          : 'border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    {move.san}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
