'use client';

import React from 'react';
import { Game } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface GameListProps {
  games: Game[];
  selectedGame: Game | null;
  onSelectGame: (game: Game) => void;
  completedGames: Set<string>;
}

export function GameList({
  games,
  selectedGame,
  onSelectGame,
  completedGames,
}: GameListProps) {
  return (
    <Card className="h-fit overflow-hidden border border-slate-800 bg-slate-950/80 p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Games
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Pick a line.
            </p>
          </div>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200">
            {games.length}
          </span>
        </div>

        <div className="max-h-[500px] space-y-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
          {games.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900 px-4 py-8 text-center">
              <p className="text-sm text-slate-400">No games loaded</p>
            </div>
          ) : (
            games.map((game, index) => {
              const isSelected = selectedGame?.id === game.id;
              const isCompleted = completedGames.has(game.id);

              return (
                <button
                  key={game.id}
                  onClick={() => onSelectGame(game)}
                  className={`group w-full rounded-xl border px-3 py-3 text-left transition-colors ${
                    isSelected
                      ? 'border-cyan-400/40 bg-slate-900'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                        isSelected
                          ? 'bg-cyan-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-white">
                          {game.white}
                        </span>
                        {isCompleted && (
                          <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300">
                            Done
                          </span>
                        )}
                      </div>
                      <div className="truncate text-xs text-slate-400">
                        vs {game.black}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] font-medium text-slate-300">
                        {game.moves.length} moves
                      </span>
                      {isSelected && (
                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
}
