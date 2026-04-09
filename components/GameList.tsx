'use client';

import React from 'react';
import { Game } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    <Card className="p-4 bg-gray-900 border-gray-800 h-fit">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-200">Games ({games.length})</h3>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {games.length === 0 ? (
            <p className="text-xs text-gray-500">No games loaded</p>
          ) : (
            games.map((game) => (
              <Button
                key={game.id}
                onClick={() => onSelectGame(game)}
                variant="ghost"
                className={`w-full justify-start text-left text-xs px-3 py-2 h-auto ${
                  selectedGame?.id === game.id
                    ? 'bg-purple-900 text-purple-100'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-2 flex-1">
                  {completedGames.has(game.id) && (
                    <span className="text-green-400">✔</span>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{game.white}</div>
                    <div className="text-gray-500">vs {game.black}</div>
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
