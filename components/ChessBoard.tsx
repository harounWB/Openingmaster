'use client';

import React, { useState, useCallback } from 'react';
import { Chess, Move as ChessMove } from 'chess.js';
import { THEME_COLORS } from '@/lib/constants';

interface ChessBoardProps {
  fen: string;
  onMove: (move: { from: string; to: string; promotion?: string }) => void;
  disabled?: boolean;
  lastMove?: { from: string; to: string };
  orientation?: 'white' | 'black';
}

const PIECE_UNICODE: Record<string, string> = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

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

      if (moveFrom === square) {
        setMoveFrom(null);
        setValidMoves([]);
        return;
      }

      if (!moveFrom) {
        const piece = chess.get(square);
        if (!piece) {
          setMoveFrom(null);
          setValidMoves([]);
          return;
        }

        const isWhiteToMove = chess.turn() === 'w';
        const isPieceWhite = piece.color === 'w';

        if (isWhiteToMove !== isPieceWhite) {
          return;
        }

        const moves = chess.moves({ square, verbose: true });
        const legalSquares = moves.map((move: ChessMove) => move.to);

        setMoveFrom(square);
        setValidMoves(legalSquares);
        return;
      }

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

  const files = orientation === 'white' ? FILES : [...FILES].reverse();
  const ranks = orientation === 'white' ? RANKS : [...RANKS].reverse();

  return (
    <div className="w-full max-w-md aspect-square rounded-lg overflow-hidden shadow-lg border border-opacity-20 border-white">
      <div className="w-full h-full grid grid-cols-8 gap-0 bg-stone-800">
        {ranks.map((rank) =>
          files.map((file) => {
            const square = `${file}${rank}`;
            const piece = chess.get(square);
            const isLight = (FILES.indexOf(file) + RANKS.indexOf(rank)) % 2 === 0;
            const isHighlightedMove = lastMove && (lastMove.from === square || lastMove.to === square);
            const isSelected = moveFrom === square;
            const isValidTarget = validMoves.includes(square);

            let bgColor = isLight ? '#c8a882' : '#8b7355';
            if (isHighlightedMove) bgColor = THEME_COLORS.highlight;
            if (isSelected) bgColor = THEME_COLORS.selectedSquare;

            return (
              <button
                key={square}
                onClick={() => handleSquareClick(square)}
                disabled={disabled}
                className="w-full h-full flex items-center justify-center text-5xl transition-colors cursor-pointer hover:opacity-80 disabled:cursor-not-allowed"
                style={{ backgroundColor: bgColor }}
              >
                {isValidTarget && (
                  <div
                    className="absolute w-1/3 h-1/3 rounded-full border-2"
                    style={{ borderColor: THEME_COLORS.accentSecondary }}
                  />
                )}
                {piece && <span>{PIECE_UNICODE[piece.type + (piece.color === 'w' ? '' : 'k')]}</span>}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
