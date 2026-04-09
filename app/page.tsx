'use client';

import React, { useState } from 'react';
import { PGNUpload } from '@/components/PGNUpload';
import { Trainer } from '@/components/Trainer';
import { Game } from '@/lib/types';

export default function Page() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGamesLoaded = (loadedGames: Game[]) => {
    setIsLoading(true);
    setTimeout(() => {
      setGames(loadedGames);
      setIsLoading(false);
    }, 500);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-purple-400">Chess Opening Trainer</h1>
            <p className="text-gray-400">Master chess openings with interactive training</p>
          </div>

          {/* Main Content */}
          {games.length === 0 ? (
            <div className="max-w-md mx-auto">
              <PGNUpload onGamesLoaded={handleGamesLoaded} isLoading={isLoading} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-gray-200">
                  {games.length} game{games.length !== 1 ? 's' : ''} loaded
                </div>
                <button
                  onClick={() => {
                    setGames([]);
                  }}
                  className="text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors"
                >
                  Load Different File
                </button>
              </div>

              <Trainer games={games} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
