'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Trainer } from '@/components/Trainer';
import { useGameContext } from '@/lib/GameContext';
import { ArrowLeft, Plus } from 'lucide-react';

export default function TrainingPage() {
  const router = useRouter();
  const { games, selectedGame, setSelectedGame, clearGameData } = useGameContext();

  const handleNewGame = () => {
    clearGameData();
    router.push('/upload');
  };

  if (!selectedGame) {
    return (
      <main className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No Game Selected</h1>
          <p className="text-gray-400 mb-6">Please select a game from the upload page.</p>
          <button
            onClick={() => router.push('/upload')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Upload
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Control Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              setSelectedGame(null);
              router.push('/upload');
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </button>

          <button
            onClick={handleNewGame}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            New Game
          </button>
        </div>

        {/* Trainer Component */}
        <Trainer games={games} />
      </div>
    </main>
  );
}
