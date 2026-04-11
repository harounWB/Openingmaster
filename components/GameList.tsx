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
    <Card className="p-4 bg-gray-900/80 border-gray-800 h-fit backdrop-blur-sm">
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Games ({games.length})
        </h3>
        <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {games.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No games loaded</p>
          ) : (
            games.map((game, index) => {
              const isSelected = selectedGame?.id === game.id;
              const isCompleted = completedGames.has(game.id);
              
              return (
                <button
                  key={game.id}
                  onClick={() => onSelectGame(game)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isSelected
                      ? 'bg-purple-600/90 text-white shadow-lg shadow-purple-500/20 ring-1 ring-purple-400/50'
                      : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80 hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Game number */}
                    <span className={`text-xs font-mono min-w-[20px] ${
                      isSelected ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {index + 1}.
                    </span>
                    
                    {/* Game info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{game.white}</span>
                        {isCompleted && (
                          <span className="text-green-400 text-xs flex-shrink-0">✔</span>
                        )}
                      </div>
                      <div className={`text-xs truncate ${
                        isSelected ? 'text-purple-200' : 'text-gray-500'
                      }`}>
                        vs {game.black}
                      </div>
                    </div>
                    
                    {/* Move count */}
                    <span className={`text-xs ${
                      isSelected ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {game.moves.length} moves
                    </span>
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
