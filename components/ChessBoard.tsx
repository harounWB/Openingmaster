'use client';

import React, { useState, useCallback } from 'react';
import { Chess, Move as ChessMove } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { THEME_COLORS, PIECE_COLORS } from '@/lib/constants';

interface ChessBoardProps {
  fen: string;
  onMove: (move: { from: string; to: string; promotion?: string }) => void;
  disabled?: boolean;
  lastMove?: { from: string; to: string };
  orientation?: 'white' | 'black';
}

export function ChessBoard({
  fen,
  onMove,
  disabled = false,
  lastMove,
  orientation = 'white',
}: ChessBoardProps) {
  const [moveFrom, setMoveFrom] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);

  const chess = new Chess(fen);

  const handleSquareClick = useCallback(
    (square: string) => {
      if (disabled) return;

      // If clicking the same square, deselect
      if (moveFrom === square) {
        setMoveFrom(null);
        setValidMoves([]);
        return;
      }

      // If no piece selected, try to select one
      if (!moveFrom) {
        const piece = chess.get(square);
        if (!piece) {
          setMoveFrom(null);
          setValidMoves([]);
          return;
        }

        // Check if it's the right color to move
        const isWhiteToMove = chess.turn() === 'w';
        const isPieceWhite = piece.color === 'w';

        if (isWhiteToMove !== isPieceWhite) {
          return;
        }

        // Calculate legal moves from this square
        const moves = chess.moves({ square, verbose: true });
        const legalSquares = moves.map((move: ChessMove) => move.to);

        setMoveFrom(square);
        setValidMoves(legalSquares);
        return;
      }

      // If a square is selected, try to move
      if (validMoves.includes(square)) {
        const moveData = chess.moves({ square: moveFrom, verbose: true }).find(
          (move: ChessMove) => move.to === square
        );

        if (moveData) {
          onMove({
            from: moveFrom,
            to: square,
            promotion: moveData.promotion,
          });

          setMoveFrom(null);
          setValidMoves([]);
        }
      } else {
        // Select new piece if clicking on a piece of the same color
        const piece = chess.get(square);
        if (piece) {
          const isWhiteToMove = chess.turn() === 'w';
          const isPieceWhite = piece.color === 'w';

          if (isWhiteToMove === isPieceWhite) {
            const moves = chess.moves({ square, verbose: true });
            const legalSquares = moves.map((move: ChessMove) => move.to);

            setMoveFrom(square);
            setValidMoves(legalSquares);
            return;
          }
        }

        setMoveFrom(null);
        setValidMoves([]);
      }
    },
    [moveFrom, validMoves, fen, disabled]
  );

  const highlightSquares: Record<string, React.CSSProperties> = {};

  // Highlight last move
  if (lastMove) {
    highlightSquares[lastMove.from] = {
      backgroundColor: THEME_COLORS.highlight,
    };
    highlightSquares[lastMove.to] = {
      backgroundColor: THEME_COLORS.highlight,
    };
  }

  // Highlight selected square
  if (moveFrom) {
    highlightSquares[moveFrom] = {
      backgroundColor: THEME_COLORS.selectedSquare,
    };
  }

  // Highlight valid move targets
  validMoves.forEach((square) => {
    highlightSquares[square] = {
      backgroundColor: THEME_COLORS.selectedSquare,
      borderRadius: '50%',
      boxShadow: `inset 0 0 0 2px ${THEME_COLORS.accentSecondary}`,
    };
  });

  return (
    <div className="w-full max-w-md aspect-square rounded-lg overflow-hidden shadow-lg border border-opacity-20 border-white">
      <Chessboard
        position={fen}
        onSquareClick={handleSquareClick}
        customBoardStyle={{
          borderRadius: '0.5rem',
        }}
        customSquareStyles={highlightSquares}
        boardOrientation={orientation}
        arePiecesDraggable={false}
        animationDuration={200}
      />
    </div>
  );
}
