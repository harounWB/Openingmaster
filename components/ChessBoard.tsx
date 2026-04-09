'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { THEME_COLORS } from '@/lib/constants';

interface ChessBoardProps {
  fen: string;
  onMove: (move: { from: string; to: string; promotion?: string }) => void;
  onNavigate?: (direction: 'next' | 'prev') => void;
  disabled?: boolean;
  lastMove?: { from: string; to: string };
  orientation?: 'white' | 'black';
}

export function ChessBoard({
  fen,
  onMove,
  onNavigate,
  disabled = false,
  lastMove,
  orientation = 'white',
}: ChessBoardProps) {
  const chess = useMemo(() => new Chess(fen), [fen]);

  // Calculate legal moves for highlighting
  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Highlight last move
    if (lastMove) {
      styles[lastMove.from] = {
        backgroundColor: THEME_COLORS.highlight,
        boxShadow: 'inset 0 0 0 2px rgba(124, 58, 237, 0.6)',
      };
      styles[lastMove.to] = {
        backgroundColor: THEME_COLORS.highlight,
        boxShadow: 'inset 0 0 0 2px rgba(124, 58, 237, 0.6)',
      };
    }

    return styles;
  }, [lastMove]);

  const onPieceDrop = useCallback(
    (sourceSquare: string, targetSquare: string, piece: string): boolean => {
      if (disabled) return false;

      try {
        const moveData = chess.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q',
        });

        if (moveData) {
          onMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: moveData.promotion,
          });
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    [chess, disabled, onMove]
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

  return (
    <div className="flex justify-center w-full">
      <div 
        className="rounded-xl overflow-hidden shadow-2xl"
        style={{
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Chessboard
          position={fen}
          onPieceDrop={onPieceDrop}
          boardOrientation={orientation}
          customSquareStyles={customSquareStyles}
          boardWidth={500}
          arePiecesDraggable={!disabled}
          customDarkSquareStyle={{
            backgroundColor: '#3d4456',
          }}
          customLightSquareStyle={{
            backgroundColor: '#8a95a8',
          }}
          animationDuration={200}
          isDraggablePiece={({ piece }) => {
            if (disabled) return false;
            const isWhiteToMove = chess.turn() === 'w';
            const isPieceWhite = piece.charCodeAt(0) < 97;
            return isWhiteToMove === isPieceWhite;
          }}
        />
      </div>
    </div>
  );
}
