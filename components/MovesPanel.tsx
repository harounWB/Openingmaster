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
      
      // Always show all moves in EXPLORE mode
      if (trainingMode === 'explore') {
        moves.push({ index: i, moveNumber, isWhiteMove, move });
      } else {
        // In TRAIN mode, only show moves that have been played and opponent's moves
        const isPlayerMove = (playerColor === 'w' && isWhiteMove) || (playerColor === 'b' && !isWhiteMove);
        if (isPlayerMove && i >= moveIndex) {
          continue; // Hide future player moves in TRAIN mode
        }
        moves.push({ index: i, moveNumber, isWhiteMove, move });
      }
    }
    return moves;
  };

  const displayedMoves = getDisplayedMoves();

  return (
    <div className="h-96 overflow-y-auto rounded-lg border border-white border-opacity-10 bg-opacity-50 p-4">
      <div className="space-y-2">
        {displayedMoves.length === 0 ? (
          <p className="text-sm text-gray-500">No moves to display</p>
        ) : (
          displayedMoves.map((item) => {
            const isCurrentMove = item.index === moveIndex - 1;
            const isPastMove = item.index < moveIndex;
            
            return (
              <div key={item.index}>
                <button
                  onClick={() => onNavigateMove(item.index + 1)}
                  className={`w-full text-left px-3 py-2 rounded transition-all text-sm font-medium ${
                    isCurrentMove
                      ? 'bg-purple-600 text-white shadow-lg'
                      : isPastMove
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <span className="text-xs text-gray-500">{item.moveNumber}.</span> {item.move.san}
                </button>
                
                {/* Always show comment if present */}
                {item.move.comment && (
                  <div
                    className="mt-1 ml-1 px-3 py-2 rounded text-xs leading-relaxed border-l-2"
                    style={{
                      backgroundColor: 'rgba(124, 58, 237, 0.15)',
                      borderLeftColor: '#7c3aed',
                      color: '#e0d5ff',
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
