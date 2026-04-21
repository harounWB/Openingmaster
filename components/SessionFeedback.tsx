'use client';

import React from 'react';
import { GameSession, MoveAttempt } from '@/lib/types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle, RotateCcw, Trophy } from 'lucide-react';

interface SessionFeedbackProps {
  session: GameSession;
  moveAttempts: MoveAttempt[];
  onReplay?: () => void;
  onReplayMistakes?: () => void;
  onNewGame?: () => void;
}

export function SessionFeedback({
  session,
  moveAttempts,
  onReplay,
  onReplayMistakes,
  onNewGame,
}: SessionFeedbackProps) {
  const accuracy = (session.correctMoves + session.incorrectMoves + session.hintsUsed) > 0
    ? Math.round((session.correctMoves / (session.correctMoves + session.incorrectMoves + session.hintsUsed)) * 100)
    : 0;

  const mistakeMoves = moveAttempts.filter(a => a.wrongAttempts > 0);
  const hasMistakes = mistakeMoves.length > 0;

  const sessionDuration = session.completedAt
    ? Math.round((session.completedAt - session.startTime) / 1000)
    : 0;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Card className="overflow-hidden border border-slate-800 bg-slate-950/80 p-4 shadow-xl shadow-black/10 sm:p-5">
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-4 text-center">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-200">
              <Trophy className="h-6 w-6" />
            </div>
          </div>
          <h2 className="mt-3 text-xl font-semibold text-white">
            Game complete
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Difficulty: <span className="font-medium capitalize text-slate-200">{session.difficulty}</span>
          </p>
          <p className="mt-3 text-sm text-slate-300">
            You finished the line with {accuracy}% accuracy and {session.correctMoves} clean moves.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
            <div className="text-xl font-semibold text-emerald-200">{accuracy}%</div>
            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-emerald-100/70">Accuracy</div>
          </div>
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-3">
            <div className="text-xl font-semibold text-sky-200">{session.correctMoves}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-sky-100/70">Correct</div>
          </div>
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3">
            <div className="text-xl font-semibold text-rose-200">{session.incorrectMoves}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-rose-100/70">Incorrect</div>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
            <div className="text-xl font-semibold text-amber-200">{session.hintsUsed}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-amber-100/70">Hints</div>
          </div>
        </div>

        <div className="grid gap-2 rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span>Duration</span>
            <span className="font-medium text-white">{formatDuration(sessionDuration)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Total moves</span>
            <span className="font-medium text-white">{session.totalMoves}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Correct on first try</span>
            <span className="font-medium text-emerald-200">{session.correctMoves}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Incorrect moves</span>
            <span className="font-medium text-rose-200">{session.incorrectMoves}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Hints used</span>
            <span className="font-medium text-amber-200">{session.hintsUsed}</span>
          </div>
        </div>

        {hasMistakes && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
            <p className="text-sm font-medium text-rose-100">
              {mistakeMoves.length} move{mistakeMoves.length !== 1 ? 's' : ''} had mistakes
            </p>
            <p className="mt-1 text-xs text-rose-100/70">
              Total wrong attempts: {moveAttempts.reduce((sum, a) => sum + a.wrongAttempts, 0)}
            </p>
          </div>
        )}

        <div className="grid gap-2 pt-1 sm:grid-cols-2">
          {hasMistakes && onReplayMistakes && (
            <Button
              onClick={onReplayMistakes}
              className="h-9 w-full bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-400"
            >
              <RotateCcw className="h-4 w-4" />
              Replay mistakes
            </Button>
          )}
          {onReplay && (
            <Button
              onClick={onReplay}
              variant="outline"
              className="h-9 w-full border-slate-700 bg-slate-950/80 text-slate-200 shadow-none hover:bg-slate-900 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Replay game
            </Button>
          )}
          {onNewGame && (
            <Button
              onClick={onNewGame}
              className="h-9 w-full bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
            >
              <CheckCircle className="h-4 w-4" />
              New game
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
