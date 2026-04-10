'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';

interface ChessBoardProps {
  fen: string;
  onMove: (move: { from: string; to: string; promotion?: string }) => void;
  onNavigate?: (direction: 'next' | 'prev') => void;
  disabled?: boolean;
  lastMove?: { from: string; to: string };
  orientation?: 'white' | 'black';
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

// Chess.com style SVG pieces
const PieceComponent: React.FC<{ type: string; color: 'w' | 'b' }> = ({ type, color }) => {
  const isWhite = color === 'w';
  const fill = isWhite ? '#f0d9b5' : '#312e2b';
  const stroke = isWhite ? '#1a1a1a' : '#f0d9b5';

  const pieces: Record<string, JSX.Element> = {
    'P': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="30" r="12" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="42" y="42" width="16" height="35" fill={fill} stroke={stroke} strokeWidth="2" />
        <ellipse cx="50" cy="82" rx="18" ry="6" fill={fill} stroke={stroke} strokeWidth="2" />
      </svg>
    ),
    'N': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M 35 70 Q 25 50 30 30 Q 35 20 45 20 Q 55 20 50 35 Q 45 40 50 50 L 60 50 Q 70 50 70 65 L 70 75 Q 70 82 65 85 L 35 85 Z" fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
    'B': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="25" r="8" fill={fill} stroke={stroke} strokeWidth="2" />
        <path d="M 42 35 L 38 55 Q 35 70 50 80 Q 65 70 62 55 L 58 35 Z" fill={fill} stroke={stroke} strokeWidth="2" />
      </svg>
    ),
    'R': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="30" y="20" width="40" height="15" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="35" y="35" width="30" height="35" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="32" y="70" width="36" height="12" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="40" y="25" width="6" height="10" fill={fill} stroke={stroke} strokeWidth="1" />
        <rect x="54" y="25" width="6" height="10" fill={fill} stroke={stroke} strokeWidth="1" />
      </svg>
    ),
    'Q': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="20" r="8" fill={fill} stroke={stroke} strokeWidth="2" />
        <circle cx="35" cy="25" r="5" fill={fill} stroke={stroke} strokeWidth="2" />
        <circle cx="65" cy="25" r="5" fill={fill} stroke={stroke} strokeWidth="2" />
        <path d="M 30 35 L 25 60 Q 25 75 50 82 Q 75 75 75 60 L 70 35 Z" fill={fill} stroke={stroke} strokeWidth="2" />
      </svg>
    ),
    'K': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <line x1="50" y1="15" x2="50" y2="30" stroke={stroke} strokeWidth="3" />
        <line x1="45" y1="25" x2="55" y2="25" stroke={stroke} strokeWidth="2" />
        <circle cx="50" cy="20" r="3" fill={stroke} />
        <path d="M 35 38 L 30 65 Q 30 78 50 85 Q 70 78 70 65 L 65 38 Z" fill={fill} stroke={stroke} strokeWidth="2" />
      </svg>
    ),
  };

  return pieces[type] || null;
};

export function ChessBoard({
  fen,
  onMove,
  onNavigate,
  disabled = false,
  lastMove,
  orientation = 'white',
}: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const chess = useMemo(() => new Chess(fen), [fen]);

  const legalMoves = useMemo(() => {
    const moves: Record<string, string[]> = {};
    const gameMoves = chess.moves({ verbose: true });
    
    gameMoves.forEach((move) => {
      if (!moves[move.from]) {
        moves[move.from] = [];
      }
      moves[move.from].push(move.to);
    });
    
    return moves;
  }, [chess, fen]);

  const onSquareClick = useCallback(
    (square: string) => {
      if (disabled) return;

      if (selectedSquare === square) {
        setSelectedSquare(null);
        return;
      }

      if (!selectedSquare) {
        const piece = chess.get(square);
        if (piece) {
          const isWhiteToMove = chess.turn() === 'w';
          const isPieceWhite = piece.color === 'w';

          if (isWhiteToMove === isPieceWhite) {
            setSelectedSquare(square);
          }
        }
        return;
      }

      const piece = chess.get(selectedSquare);
      if (!piece) {
        setSelectedSquare(null);
        return;
      }

      try {
        const move = chess.move({
          from: selectedSquare,
          to: square,
          promotion: 'q',
        });

        if (move) {
          onMove({
            from: selectedSquare,
            to: square,
            promotion: move.promotion,
          });
          setSelectedSquare(null);
        } else {
          const clickedPiece = chess.get(square);
          if (clickedPiece) {
            const isWhiteToMove = chess.turn() === 'w';
            const isPieceWhite = clickedPiece.color === 'w';

            if (isWhiteToMove === isPieceWhite) {
              setSelectedSquare(square);
            }
          } else {
            setSelectedSquare(null);
          }
        }
      } catch (e) {
        setSelectedSquare(null);
      }
    },
    [selectedSquare, chess, disabled, onMove]
  );

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNavigate?.('next');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onNavigate?.('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);

  const files = orientation === 'white' ? FILES : [...FILES].reverse();
  const ranks = orientation === 'white' ? RANKS : [...RANKS].reverse();

  return (
    <div className="flex justify-center w-full">
      <div className="rounded-lg overflow-hidden shadow-xl" style={{ width: '360px' }}>
        <div className="grid grid-cols-8 gap-0">
          {ranks.map((rank) =>
            files.map((file) => {
              const square = `${file}${rank}`;
              const piece = chess.get(square);
              const fileIndex = FILES.indexOf(file);
              const rankIndex = RANKS.indexOf(rank);
              const isLight = (fileIndex + rankIndex) % 2 === 0;
              const isHighlightedMove = lastMove && (lastMove.from === square || lastMove.to === square);
              const isSelected = selectedSquare === square;
              const isValidTarget = selectedSquare && legalMoves[selectedSquare]?.includes(square);

              // Chess.com style colors
              let bgColor = isLight ? '#f0d9b5' : '#b58863';
              
              if (isHighlightedMove) {
                bgColor = isLight ? '#baca44' : '#a9a933';
              } else if (isSelected) {
                bgColor = isLight ? '#baca44' : '#a9a933';
              }

              return (
                <button
                  key={square}
                  onClick={() => onSquareClick(square)}
                  disabled={disabled}
                  className="w-full h-full flex items-center justify-center transition-colors cursor-pointer hover:opacity-90 disabled:cursor-not-allowed relative"
                  style={{ 
                    backgroundColor: bgColor,
                    aspectRatio: '1',
                  }}
                  aria-label={`Square ${square}`}
                >
                  {isValidTarget && (
                    <div
                      className="absolute rounded-full bg-gray-800 opacity-40"
                      style={{
                        width: '20%',
                        height: '20%',
                      }}
                    />
                  )}
                  {piece && (
                    <div style={{ width: '70%', height: '70%' }}>
                      <PieceComponent type={piece.type} color={piece.color} />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
