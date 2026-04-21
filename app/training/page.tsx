'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trainer } from '@/components/Trainer';
import { useGameContext } from '@/lib/GameContext';
import { Header } from '@/components/Header';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TrainingMode } from '@/lib/types';

export default function TrainingPage() {
  const router = useRouter();
  const { games, selectedGame, setSelectedGame, setMoveIndex, clearGameData, getPGNProgress } = useGameContext();
  const [isLoading, setIsLoading] = useState(true);
  const [initialMode, setInitialMode] = useState<TrainingMode>('train');
  const [preferredGameId, setPreferredGameId] = useState<string | null>(null);
  const hasAppliedPreferredGameRef = useRef(false);

  // Wait for context to hydrate from localStorage
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setInitialMode(query.get('mode') === 'explore' ? 'explore' : 'train');
    setPreferredGameId(query.get('game'));
    document.title = 'Chess Opening Trainer - Practice Openings Interactively | OpeningMaster';

    // Give context time to load from localStorage
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Select the intended game once the context is ready.
  useEffect(() => {
    if (isLoading || games.length === 0) {
      return;
    }

    if (!hasAppliedPreferredGameRef.current) {
      const preferredGame = preferredGameId
        ? games.find(game => game.id === preferredGameId)
        : null;

      if (preferredGame) {
        hasAppliedPreferredGameRef.current = true;
        if (selectedGame?.id !== preferredGame.id) {
          setSelectedGame(preferredGame);
          setMoveIndex(0);
        }
        return;
      }

      hasAppliedPreferredGameRef.current = true;
    }

    if (!selectedGame) {
      router.replace('/upload');
    }
  }, [isLoading, games, preferredGameId, selectedGame, router, setSelectedGame, setMoveIndex]);

  // Redirect to upload if no game after hydration
  useEffect(() => {
    if (!isLoading && games.length === 0) {
      router.push('/upload');
    }
  }, [isLoading, games, router]);

  const handleNewGame = () => {
    clearGameData();
    router.push('/upload');
  };

  const currentPgnFileName =
    selectedGame?.id?.includes('::')
      ? selectedGame.id.split('::')[0]
      : games[0]?.id?.includes('::')
        ? games[0].id.split('::')[0]
        : selectedGame?.opening || 'PGN file';
  const pgnName = currentPgnFileName;
  const pgnProgress = pgnName !== 'PGN file' ? getPGNProgress(pgnName) : null;
  const pgnTotalGames = pgnProgress?.games.length || games.length;
  const pgnCompletedGames = pgnProgress
    ? pgnProgress.games.reduce((count, game) => {
        const isExplored = pgnProgress.exploredGames.has(game.id);
        const isTrained = pgnProgress.trainedGames.has(game.id);
        return count + (isExplored && isTrained ? 1 : 0);
      }, 0)
    : 0;
  const pgnProgressPercentage = pgnTotalGames > 0 ? Math.round((pgnCompletedGames / pgnTotalGames) * 100) : 0;

  // Show loading state while context hydrates
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </main>
    );
  }

  // If no game after hydration, show nothing (redirect effect is running)
  if (games.length === 0) {
    return null;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gray-950 text-gray-100">
      <Header />
      <div className="relative mx-auto max-w-screen-xl px-4 py-4 sm:py-6">
        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-5 md:px-6 md:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 space-y-3">
              <div className="space-y-2">
                <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                  Training
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Simple controls, the current PGN, and the board in one place.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-0.5 text-[11px] font-medium text-slate-200">
                  {pgnName}
                </span>
                {selectedGame && (
                  <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-0.5 text-[11px] font-medium text-slate-200">
                    {selectedGame.white} vs {selectedGame.black}
                  </span>
                )}
                <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-0.5 text-[11px] font-medium text-slate-200">
                  {initialMode === 'explore' ? 'Explore' : 'Train'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => {
                  clearGameData();
                  router.push('/upload');
                }}
                className="h-9 justify-start gap-2 border-slate-700 bg-slate-950/80 px-3 text-slate-200 shadow-none hover:bg-slate-900 hover:text-white sm:w-auto"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Games
              </Button>
              <Button
                onClick={handleNewGame}
                className="h-9 justify-start gap-2 bg-cyan-500 px-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 sm:w-auto"
              >
                <Plus className="h-3.5 w-3.5" />
                New Game
              </Button>
            </div>
          </div>

          <div className="mt-5 space-y-2 border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>PGN progress</span>
              <span>
                {pgnCompletedGames} / {pgnTotalGames} games complete
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all"
                style={{ width: `${pgnProgressPercentage}%` }}
              />
            </div>
          </div>
        </section>

        <Trainer games={games} initialMode={initialMode} />
      </div>
    </main>
  );
}
