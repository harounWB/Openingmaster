'use client';

import React, { useRef, useEffect } from 'react';
import { Game } from '@/lib/types';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentMoveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentMoveRef.current || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const el = currentMoveRef.current;

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const isAbove = elRect.top < containerRect.top + 40;
    const isBelow = elRect.bottom > containerRect.bottom - 40;

    if (isAbove || isBelow) {
      container.scrollTo({
        top: container.scrollTop + (elRect.top - containerRect.top) - container.clientHeight / 2 + el.offsetHeight / 2,
        behavior: 'smooth',
      });
    }
  }, [moveIndex]);

  const handleMoveClick = (index: number) => {
    onNavigateMove(index);
  };

  const getDisplayedMoves = () => {
    const moves = [];
    for (let i = 0; i < game.moves.length; i++) {
      const move = game.moves[i];
      const moveNumber = Math.floor(i / 2) + 1;
      const isWhiteMove = i % 2 === 0;

      if (trainingMode === 'explore') {
        moves.push({ index: i, moveNumber, isWhiteMove, move });
      } else {
        const isPlayerMove = (playerColor === 'w' && isWhiteMove) || (playerColor === 'b' && !isWhiteMove);
        if (isPlayerMove && i >= moveIndex) {
          continue;
        }
        moves.push({ index: i, moveNumber, isWhiteMove, move });
      }
    }
    return moves;
  };

  const displayedMoves = getDisplayedMoves();

  const shouldShowComment = () => trainingMode === 'explore';

  return (
    <div
      ref={scrollContainerRef}
      className="h-96 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/80 p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Move list
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              {trainingMode === 'explore'
                ? 'Browse the full line and read the comments.'
                : 'Your side is hidden until it is time to play.'}
            </p>
          </div>
          <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-200">
            {displayedMoves.length}
          </span>
        </div>

        <div className="space-y-2">
          {displayedMoves.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900 px-4 py-8 text-center">
              <p className="text-sm text-slate-400">No moves to display</p>
            </div>
          ) : (
            displayedMoves.map((item) => {
              const isCurrentMove = item.index === moveIndex - 1;
              const isPastMove = item.index < moveIndex;
              const showComment = item.move.comment && shouldShowComment();

              return (
                <div
                  key={item.index}
                  ref={isCurrentMove ? currentMoveRef : null}
                  className="group"
                >
                  <button
                    onClick={() => handleMoveClick(item.index + 1)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                      isCurrentMove
                        ? 'border-violet-400/40 bg-slate-900 text-white'
                        : isPastMove
                          ? 'border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700 hover:bg-slate-900'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <span
                      className={`min-w-10 rounded-full px-2.5 py-1 text-xs font-mono ${
                        isCurrentMove
                          ? 'bg-violet-500 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.isWhiteMove ? `${item.moveNumber}.` : `${item.moveNumber}...`}
                    </span>

                    <span className={`flex-1 font-semibold tracking-wide ${isCurrentMove ? 'text-white' : ''}`}>
                      {item.move.san}
                    </span>

                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      {item.isWhiteMove ? 'White' : 'Black'}
                    </span>
                  </button>

                  {showComment && (
                    <div className="mt-2 ml-3 mr-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
                      <p className="text-sm leading-6 text-slate-300">
                        {item.move.comment}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
