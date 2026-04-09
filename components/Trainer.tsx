'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Game, PlayerColor, TrainingMode } from '@/lib/types';
import { ChessBoard } from './ChessBoard';
import { TrainingPanel } from './TrainingPanel';
import { GameList } from './GameList';

interface TrainerProps {
  games: Game[];
}

export function Trainer({ games }: TrainerProps) {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [trainingMode, setTrainingMode] = useState<TrainingMode>('train');
  const [playerColor, setPlayerColor] = useState<PlayerColor>('w');
  const [gameState, setGameState] = useState<Chess | null>(null);
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completedGames, setCompletedGames] = useState<Set<string>>(new Set());

  // Initialize game state when game is selected
  useEffect(() => {
    if (currentGame) {
      const chess = new Chess();
      setGameState(chess);
      setMoveIndex(0);
      setMessage(`Playing as ${playerColor === 'w' ? 'White' : 'Black'}. ${playerColor === 'w' ? 'White to move.' : 'Black to move.'}`);
      setIsCorrect(null);
    }
  }, [currentGame, playerColor]);

  // Get current FEN position by replaying moves
  const getCurrentFen = useCallback((): string => {
    if (!currentGame || !gameState) return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    const chess = new Chess();
    for (let i = 0; i < moveIndex; i++) {
      if (i < currentGame.moves.length) {
        const move = currentGame.moves[i];
        try {
          chess.move({
            from: move.from,
            to: move.to,
            promotion: move.promotion,
          });
        } catch (e) {
          console.error('[v0] Error replaying move:', move, e);
        }
      }
    }
    return chess.fen();
  }, [currentGame, moveIndex]);

  const getCurrentPosition = useCallback((): Chess => {
    const chess = new Chess();
    if (currentGame) {
      for (let i = 0; i < moveIndex; i++) {
        if (i < currentGame.moves.length) {
          const move = currentGame.moves[i];
          try {
            chess.move({
              from: move.from,
              to: move.to,
              promotion: move.promotion,
            });
          } catch (e) {
            console.error('[v0] Error replaying move:', move, e);
          }
        }
      }
    }
    return chess;
  }, [currentGame, moveIndex]);

  const getExpectedMove = useCallback((): string | null => {
    if (!currentGame || moveIndex >= currentGame.moves.length) {
      return null;
    }

    const currentPos = getCurrentPosition();
    const playerToMove = currentPos.turn();

    // Skip moves that don't match our training perspective
    let expectedIndex = moveIndex;
    while (expectedIndex < currentGame.moves.length) {
      const chess = new Chess();
      for (let i = 0; i < expectedIndex; i++) {
        if (i < currentGame.moves.length) {
          const move = currentGame.moves[i];
          chess.move({
            from: move.from,
            to: move.to,
            promotion: move.promotion,
          });
        }
      }

      if (chess.turn() === playerColor) {
        return currentGame.moves[expectedIndex]?.san || null;
      }
      expectedIndex++;
    }

    return null;
  }, [currentGame, moveIndex, playerColor]);

  const handleMove = useCallback(
    (move: { from: string; to: string; promotion?: string }) => {
      if (!currentGame) return;

      const currentPos = getCurrentPosition();

      // Validate move is legal
      try {
        const result = currentPos.move(move, { sloppy: false });
        if (!result) {
          setMessage('Invalid move!');
          setIsCorrect(false);
          return;
        }

        // Check if it's training mode and validate against expected move
        if (trainingMode === 'train') {
          const expectedMove = getExpectedMove();

          if (!expectedMove) {
            setMessage('No more moves in this game.');
            setIsCorrect(null);
            return;
          }

          // Find the matching move in the game
          const nextGameMove = currentGame.moves[moveIndex];
          if (
            nextGameMove &&
            nextGameMove.from === move.from &&
            nextGameMove.to === move.to
          ) {
            setIsCorrect(true);
            setMessage('Correct! Continuing...');
            setMoveIndex(moveIndex + 1);
          } else {
            setIsCorrect(false);
            setMessage(`Wrong! Expected: ${nextGameMove?.san || 'end of game'}`);
          }
        } else {
          // Explore mode - just advance
          if (moveIndex < currentGame.moves.length) {
            setMoveIndex(moveIndex + 1);
            setMessage(`Moved: ${result.san}`);
            setIsCorrect(null);
          } else {
            setMessage('Game ended.');
            setIsCorrect(null);
          }
        }
      } catch (e) {
        setMessage('Invalid move!');
        setIsCorrect(false);
      }
    },
    [currentGame, moveIndex, trainingMode, playerColor, getExpectedMove, getCurrentPosition]
  );

  const handleSelectGame = useCallback((game: Game) => {
    setCurrentGame(game);
    setMoveIndex(0);
    setTrainingMode('train');
    setPlayerColor('w');
  }, []);

  const handleResetGame = useCallback(() => {
    if (currentGame) {
      setMoveIndex(0);
      setMessage(`Resetting game. Playing as ${playerColor === 'w' ? 'White' : 'Black'}.`);
      setIsCorrect(null);
    }
  }, [currentGame, playerColor]);

  const handleCompleteGame = useCallback(() => {
    if (currentGame) {
      const newCompleted = new Set(completedGames);
      newCompleted.add(currentGame.id);
      setCompletedGames(newCompleted);
      setMessage('Game marked as complete!');
    }
  }, [currentGame, completedGames]);

  const handleNavigateMove = useCallback((index: number) => {
    if (currentGame && index >= 0 && index <= currentGame.moves.length) {
      setMoveIndex(index);
      setIsCorrect(null);
    }
  }, [currentGame]);

  const lastMove = moveIndex > 0 ? currentGame?.moves[moveIndex - 1] : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            {currentGame && gameState ? (
              <ChessBoard
                fen={getCurrentFen()}
                onMove={handleMove}
                disabled={moveIndex >= (currentGame?.moves.length || 0) && trainingMode === 'train'}
                lastMove={lastMove ? { from: lastMove.from, to: lastMove.to } : undefined}
                orientation={playerColor === 'w' ? 'white' : 'black'}
              />
            ) : (
              <div className="w-full max-w-md aspect-square bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                <p className="text-gray-400">Select a game to begin</p>
              </div>
            )}
          </div>

          {currentGame && (
            <TrainingPanel
              game={currentGame}
              moveIndex={moveIndex}
              trainingMode={trainingMode}
              playerColor={playerColor}
              message={message}
              isCorrect={isCorrect}
              expectedMove={getExpectedMove()}
              onModeChange={setTrainingMode}
              onColorChange={setPlayerColor}
              onReset={handleResetGame}
              onNavigateMove={handleNavigateMove}
              onCompleteGame={handleCompleteGame}
              isCompleted={completedGames.has(currentGame.id)}
            />
          )}
        </div>

        <div className="flex-shrink-0">
          <GameList
            games={games}
            selectedGame={currentGame}
            onSelectGame={handleSelectGame}
            completedGames={completedGames}
          />
        </div>
      </div>
    </div>
  );
}
