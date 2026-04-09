'use client';

import React from 'react';
import { Game, PlayerColor, TrainingMode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { THEME_COLORS } from '@/lib/constants';

interface TrainingPanelProps {
  game: Game;
  moveIndex: number;
  trainingMode: TrainingMode;
  playerColor: PlayerColor;
  message: string;
  isCorrect: boolean | null;
  expectedMove: string | null;
  onModeChange: (mode: TrainingMode) => void;
  onColorChange: (color: PlayerColor) => void;
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
  onModeChange,
  onColorChange,
  onReset,
  onNavigateMove,
  onCompleteGame,
  isCompleted,
}: TrainingPanelProps) {
  const moveProgressPercentage = (moveIndex / (game.moves.length || 1)) * 100;

  const getMessageColor = () => {
    if (isCorrect === true) return 'text-green-400';
    if (isCorrect === false) return 'text-red-400';
    return 'text-blue-300';
  };

  return (
    <Card className="p-4 bg-gray-900 border-gray-800">
      <div className="space-y-4">
        {/* Game Header */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-300">
            {game.white} vs {game.black}
          </div>
          {isCompleted && (
            <div className="text-xs px-2 py-1 bg-green-900 text-green-300 rounded">
              ✔ Complete
            </div>
          )}
        </div>

        {/* Mode Selection */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={trainingMode === 'train' ? 'default' : 'outline'}
            onClick={() => onModeChange('train')}
            className={
              trainingMode === 'train'
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-gray-800 hover:bg-gray-700'
            }
          >
            Train
          </Button>
          <Button
            size="sm"
            variant={trainingMode === 'explore' ? 'default' : 'outline'}
            onClick={() => onModeChange('explore')}
            className={
              trainingMode === 'explore'
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-gray-800 hover:bg-gray-700'
            }
          >
            Explore
          </Button>
        </div>

        {/* Player Color Selection */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={playerColor === 'w' ? 'default' : 'outline'}
            onClick={() => onColorChange('w')}
            className={
              playerColor === 'w'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-800 hover:bg-gray-700'
            }
          >
            Play White
          </Button>
          <Button
            size="sm"
            variant={playerColor === 'b' ? 'default' : 'outline'}
            onClick={() => onColorChange('b')}
            className={
              playerColor === 'b'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-800 hover:bg-gray-700'
            }
          >
            Play Black
          </Button>
        </div>

        {/* Status Message */}
        <div
          className={`text-sm p-3 rounded bg-gray-800 ${getMessageColor()} min-h-10 flex items-center`}
        >
          {message}
        </div>

        {/* Expected Move (Explore mode) */}
        {trainingMode === 'explore' && expectedMove && (
          <div className="text-sm p-2 bg-gray-800 rounded border border-gray-700">
            <div className="text-gray-400 text-xs mb-1">Next move:</div>
            <div className="text-blue-300 font-mono">{expectedMove}</div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="text-xs text-gray-400">
            Progress: {moveIndex}/{game.moves.length}
          </div>
          <div className="w-full bg-gray-800 rounded h-2 overflow-hidden border border-gray-700">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${moveProgressPercentage}%` }}
            />
          </div>
        </div>

        {/* Move Navigation */}
        <div className="space-y-1">
          <div className="text-xs text-gray-400">Navigate:</div>
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              onClick={() => onNavigateMove(0)}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs"
            >
              Start
            </Button>
            <Button
              size="sm"
              onClick={() => onNavigateMove(Math.max(0, moveIndex - 1))}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs"
            >
              Prev
            </Button>
            <Button
              size="sm"
              onClick={() => onNavigateMove(Math.min(game.moves.length, moveIndex + 1))}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs"
            >
              Next
            </Button>
            <Button
              size="sm"
              onClick={() => onNavigateMove(game.moves.length)}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs"
            >
              End
            </Button>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onReset}
            className="flex-1 bg-gray-800 hover:bg-gray-700"
          >
            Reset
          </Button>
          <Button
            size="sm"
            onClick={onCompleteGame}
            className={`flex-1 ${
              isCompleted
                ? 'bg-green-900 hover:bg-green-800'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {isCompleted ? '✔ Done' : 'Mark Done'}
          </Button>
        </div>

        {/* Move History */}
        {game.moves.length > 0 && (
          <div className="mt-4 p-2 bg-gray-800 rounded border border-gray-700">
            <div className="text-xs text-gray-400 mb-2">Moves:</div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {game.moves.map((move, index) => (
                <button
                  key={index}
                  onClick={() => onNavigateMove(index + 1)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    index < moveIndex
                      ? 'bg-purple-900 text-purple-100'
                      : index === moveIndex
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {move.san}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
