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

// Chess.com Neo wood style pieces with realistic shading
const PieceComponent: React.FC<{ type: string; color: 'w' | 'b' }> = ({ type, color }) => {
  const isWhite = color === 'w';
  const pieceType = type.toUpperCase();

  if (isWhite) {
    // White pieces
    const whitePieces: Record<string, JSX.Element> = {
      'P': (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="whitePawnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#f5e6d3', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#e8d4b8', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#d9c4a8', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <circle cx="50" cy="28" r="11" fill="url(#whitePawnGrad)" stroke="#8b7355" strokeWidth="1.5" />
          <rect x="44" y="39" width="12" height="28" fill="url(#whitePawnGrad)" stroke="#8b7355" strokeWidth="1.5" />
          <ellipse cx="50" cy="78" rx="16" ry="5" fill="#c9b89d" stroke="#8b7355" strokeWidth="1.5" />
        </svg>
      ),
      'N': (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="whiteKnightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#f5e6d3', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#d9c4a8', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path d="M 30 65 L 35 35 Q 40 25 50 22 Q 60 25 62 38 L 68 50 Q 70 60 65 70 Q 60 78 50 82 Q 40 78 35 70 Z" fill="url(#whiteKnightGrad)" stroke="#8b7355" strokeWidth="1.5" />
          <circle cx="48" cy="48" r="3" fill="#8b7355" opacity="0.4" />
        </svg>
      ),
      'B': (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="whiteBishopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#f5e6d3', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#d9c4a8', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <circle cx="50" cy="22" r="7" fill="url(#whiteBishopGrad)" stroke="#8b7355" strokeWidth="1.5" />
          <path d="M 40 32 L 38 55 Q 35 70 50 80 Q 65 70 62 55 L 60 32 Z" fill="url(#whiteBishopGrad)" stroke="#8b7355" strokeWidth="1.5" />
          <circle cx="50" cy="35" r="4" fill="#8b7355" opacity="0.3" />
        </svg>
      ),
      'R': (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="whiteRookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#f5e6d3', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#d9c4a8', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <rect x="28" y="18" width="44" height="14" fill="url(#whiteRookGrad)" stroke="#8b7355" strokeWidth="1.5" />
          <rect x="35" y="32" width="30" height="32" fill="url(#whiteRookGrad)" stroke="#8b7355" strokeWidth="1.5" />
          <rect x="30" y="68" width="40" height="10" fill="#c9b89d" stroke="#8b7355" strokeWidth="1.5" />
          <rect x="38" y="22" width="4" height="10" fill="url(#whiteRookGrad)" stroke="#8b7355" strokeWidth="1" />
          <rect x="58" y="22" width="4" height="10" fill="url(#whiteRookGrad)" stroke="#8b7355" strokeWidth="1" />
        </svg>
      ),
      'Q': (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="whiteQueenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#f5e6d3', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#d9c4a8', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <circle cx="50" cy="18" r="8" fill="url(#whiteQueenGrad)" stroke="#8b7355" strokeWidth="1.5" />
          <circle cx="35" cy="24" r="5" fill="url(#whiteQueenGrad)" stroke="#8b7355" strokeWidth="1.5" />
          <circle cx="65" cy="24" r="5" fill="url(#whiteQueenGrad)" stroke="#8b7355" strokeWidth="1.5" />
          <path d="M 28 35 L 25 62 Q 25 75 50 82 Q 75 75 75 62 L 72 35 Z" fill="url(#whiteQueenGrad)" stroke="#8b7355" strokeWidth="1.5" />
        </svg>
      ),
      'K': (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="whiteKingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#f5e6d3', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#d9c4a8', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <line x1="50" y1="14" x2="50" y2="30" stroke="#8b7355" strokeWidth="2.5" />
          <line x1="43" y1="24" x2="57" y2="24" stroke="#8b7355" strokeWidth="2" />
          <circle cx="50" cy="18" r="2.5" fill="#8b7355" />
          <path d="M 32 38 L 28 65 Q 28 78 50 85 Q 72 78 72 65 L 68 38 Z" fill="url(#whiteKingGrad)" stroke="#8b7355" strokeWidth="1.5" />
        </svg>
      ),
    };
    return whitePieces[pieceType] || null;
  } else {
    // Black pieces
    const blackPieces: Record<string, JSX.Element> = {
      'P': (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="blackPawnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#5a4a3a', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#3d2f25', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#2a1f18', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <circle cx="50" cy="28" r="11" fill="url(#blackPawnGrad)" stroke="#1a1410" strokeWidth="1.5" />
          <rect x="44" y="39" width="12" height="28" fill="url(#blackPawnGrad)" stroke="#1a1410" strokeWidth="1.5" />
          <ellipse cx="50" cy="78" rx="16" ry="5" fill="#1a1410" stroke="#0f0c0a" strokeWidth="1.5" />
        </svg>
      ),
      'N': (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="blackKnightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#5a4a3a', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#2a1f18', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path d="M 30 65 L 35 35 Q 40 25 50 22 Q 60 25 62 38 L 68 50 Q 70 60 65 70 Q 60 78 50 82 Q 40 78 35 70 Z" fill="url(#blackKnightGrad)" stroke="#1a1410" strokeWidth="1.5" />
          <circle cx="48" cy="48" r="3" fill="#ffffff" opacity="0.2" />
        </svg>
      ),
      'B': (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="blackBishopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#5a4a3a', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#2a1f18', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <circle cx="50" cy="22" r="7" fill="url(#blackBishopGrad)" stroke="#1a1410" strokeWidth="1.5" />
          <path d="M 40 32 L 38 55 Q 35 70 50 80 Q 65 70 62 55 L 60 32 Z" fill="url(#blackBishopGrad)" stroke="#1a1410" strokeWidth="1.5" />
          <circle cx="50" cy="35" r="4" fill="#ffffff" opacity="0.15" />
        </svg>
      ),
      'R': (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="blackRookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#5a4a3a', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#2a1f18', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <rect x="28" y="18" width="44" height="14" fill="url(#blackRookGrad)" stroke="#1a1410" strokeWidth="1.5" />
          <rect x="35" y="32" width="30" height="32" fill="url(#blackRookGrad)" stroke="#1a1410" strokeWidth="1.5" />
          <rect x="30" y="68" width="40" height="10" fill="#1a1410" stroke="#0f0c0a" strokeWidth="1.5" />
          <rect x="38" y="22" width="4" height="10" fill="url(#blackRookGrad)" stroke="#1a1410" strokeWidth="1" />
          <rect x="58" y="22" width="4" height="10" fill="url(#blackRookGrad)" stroke="#1a1410" strokeWidth="1" />
        </svg>
      ),
      'Q': (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="blackQueenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#5a4a3a', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#2a1f18', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <circle cx="50" cy="18" r="8" fill="url(#blackQueenGrad)" stroke="#1a1410" strokeWidth="1.5" />
          <circle cx="35" cy="24" r="5" fill="url(#blackQueenGrad)" stroke="#1a1410" strokeWidth="1.5" />
          <circle cx="65" cy="24" r="5" fill="url(#blackQueenGrad)" stroke="#1a1410" strokeWidth="1.5" />
          <path d="M 28 35 L 25 62 Q 25 75 50 82 Q 75 75 75 62 L 72 35 Z" fill="url(#blackQueenGrad)" stroke="#1a1410" strokeWidth="1.5" />
        </svg>
      ),
      'K': (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="blackKingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#5a4a3a', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#2a1f18', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <line x1="50" y1="14" x2="50" y2="30" stroke="#1a1410" strokeWidth="2.5" />
          <line x1="43" y1="24" x2="57" y2="24" stroke="#1a1410" strokeWidth="2" />
          <circle cx="50" cy="18" r="2.5" fill="#1a1410" />
          <path d="M 32 38 L 28 65 Q 28 78 50 85 Q 72 78 72 65 L 68 38 Z" fill="url(#blackKingGrad)" stroke="#1a1410" strokeWidth="1.5" />
        </svg>
      ),
    };
    return blackPieces[pieceType] || null;
  }
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

              // Chess.com green and cream colors (Neo theme)
              let bgColor = isLight ? '#f5f5dc' : '#739552';
              
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
                    <div style={{ width: '78%', height: '78%' }}>
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
