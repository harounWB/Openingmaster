'use client';

import React from 'react';
import { Game } from '@/lib/types';
import { THEME_COLORS } from '@/lib/constants';
import { Button } from '@/components/ui/button';

interface MovesPanelProps {
  game: Game;
  moveIndex: number;
  onNavigateMove: (index: number) => void;
  trainingMode: 'train' | 'explore';
  playerColor: 'w' | 'b';
}

export function MovesPanel({
  game,
  moveIndex,
  onNavigateMove,
  trainingMode,
  playerColor,
}: MovesPanelProps) {
  const getDisplayedMoves = () => {
    const moves = [];
    for (let i = 0; i < game.moves.length; i++) {
      const move = game.moves[i];
      const moveNumber = Math.floor(i / 2) + 1;
      const isWhiteMove = i % 2 === 0;
      
      // In TRAIN mode, only show moves that have been played and opponent's moves
      if (trainingMode === 'train') {
        const isPlayerMove = (playerColor === 'w' && isWhiteMove) || (playerColor === 'b' && !isWhiteMove);
        if (isPlayerMove && i >= moveIndex) {
          continue; // Hide future player moves in TRAIN mode
        }
      }

      moves.push({ index: i, moveNumber, isWhiteMove, move });
    }
    return moves;
  };

  const displayedMoves = getDisplayedMoves();

  return (
    <div className="h-96 overflow-y-auto rounded-lg border border-white border-opacity-10 bg-opacity-50 p-4">
      <div className="space-y-3">
        {displayedMoves.length === 0 ? (
          <p className="text-sm text-gray-500">No moves to display</p>
        ) : (
          displayedMoves.map((item, idx) => {
            const isCurrentMove = item.index === moveIndex - 1;
            const isPastMove = item.index < moveIndex;
            
            return (
              <div key={item.index} className="space-y-1">
                <button
                  onClick={() => onNavigateMove(item.index + 1)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                    isCurrentMove
                      ? 'bg-purple-600 text-white shadow-lg'
                      : isPastMove
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <span className="text-gray-500">{item.moveNumber}.</span> {item.move.san}
                </button>
                
                {/* Comment under move */}
                {item.move.comment && (
                  <div
                    className="ml-2 px-3 py-2 rounded-lg text-xs leading-relaxed border-l-2"
                    style={{
                      backgroundColor: 'rgba(124, 58, 237, 0.1)',
                      borderLeftColor: THEME_COLORS.accentPrimary,
                      color: THEME_COLORS.textSecondary,
                    }}
                  >
                    {item.move.comment}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
