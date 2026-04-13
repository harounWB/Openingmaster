'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PGNUpload } from '@/components/PGNUpload';
import { useGameContext } from '@/lib/GameContext';
import { Game } from '@/lib/types';
import { BookOpen } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const { games, setGames, setSelectedGame } = useGameContext();
  const [isLoading, setIsLoading] = useState(false);

  // If games already exist, redirect to training
  useEffect(() => {
    if (games.length > 0) {
      setSelectedGame(games[0]);
      router.push('/training');
    }
  }, [games, router, setSelectedGame]);

  const handleGamesLoaded = (loadedGames: Game[]) => {
    setIsLoading(true);
    setGames(loadedGames);
    
    // Auto-select first game and navigate to training
    if (loadedGames.length > 0) {
      setSelectedGame(loadedGames[0]);
      router.push('/training');
    } else {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <header className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Chess Opening Trainer</h1>
                <p className="text-sm text-gray-500">Master openings with interactive training</p>
              </div>
            </div>
          </header>

          {/* Upload Form */}
          <div className="max-w-md mx-auto pt-12">
            <PGNUpload onGamesLoaded={handleGamesLoaded} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  );
}
